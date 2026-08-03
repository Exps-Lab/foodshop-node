// Node.js 18+ has native global.fetch (returns Web ReadableStream)
const { Ollama } = require('ollama')

class AiService {
  constructor () {
    this.ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
    this.defaultModel = process.env.OLLAMA_MODEL || 'gpt-oss:20b'
    this.requestTimeout = Number(process.env.OLLAMA_TIMEOUT || 20000)
    this.keepAlive = process.env.OLLAMA_KEEP_ALIVE || '5m'
  }

  normalizeKeyword (keyword = '') {
    return String(keyword).trim().replace(/\s+/g, ' ')
  }

  async getAvailableModels () {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      })
      const data = await response.json()
      return Array.isArray(data?.models) ? data.models.map(item => item.name).filter(Boolean) : []
    } catch (err) {
      return []
    } finally {
      clearTimeout(timeoutId)
    }
  }

  pickModel (modelList = []) {
    const preferModels = [...new Set([
      this.defaultModel,
      'gpt-oss:20b'
    ].filter(Boolean))]

    for (const model of preferModels) {
      if (modelList.includes(model)) {
        return model
      }
    }

    const gptModel = modelList.find(model => /gpt/i.test(model))
    return gptModel || modelList[0] || this.defaultModel
  }

  createClient (signal) {
    return new Ollama({
      host: this.ollamaHost,
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal
        })
      }
    })
  }

  buildMessages (keyword) {
    return [
      {
        role: 'system',
        content: [
          '你是一名资深餐饮店铺运营文案助手。',
          '请基于用户提供的店铺关键词，生成适合餐饮门店资料填写的扩展描述。',
          '输出要求：',
          '1. 仅输出中文描述正文，不要标题、序号、引号和 Markdown。',
          '2. 语气自然可信，突出店铺定位、口味特点、食材品质、服务或适用场景。',
          '3. 内容适合用于店铺简介，不夸大宣传，不虚构无法验证的信息。',
          '4. 字数控制在 180 字左右, 最多 200 字。'
        ].join('\n')
      },
      {
        role: 'user',
        content: `请根据店铺关键词“${keyword}”生成一段店铺扩展描述。`
      }
    ]
  }

  cleanDescription (content = '') {
    return String(content)
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[“"'`]+|[”"'`]+$/g, '')
      .trim()
  }

  async chat (model, keyword) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout)

    try {
      const ollamaClient = this.createClient(controller.signal)
      const response = await ollamaClient.chat({
        model,
        messages: this.buildMessages(keyword),
        stream: false,
        keep_alive: this.keepAlive,
        think: 'low',
        options: {
          temperature: 0.7,
          num_predict: 180
        }
      })

      return this.cleanDescription(response?.message?.content)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  getErrorMsg (err, model) {
    const errMsg = String(err?.message || err || '')

    if (/aborted|aborterror|timed out|timeout/i.test(errMsg)) {
      return 'AI 服务响应超时，请稍后重试'
    }
    if (/ECONNREFUSED|fetch failed|connect|socket hang up/i.test(errMsg)) {
      return `无法连接 Ollama 服务，请确认 ${this.ollamaHost} 已启动`
    }
    if (/not found, try pulling it first|model .* not found/i.test(errMsg)) {
      return `Ollama 模型 ${model} 不存在，请先执行 ollama pull ${model}`
    }
    if (/invalid json|unexpected token/i.test(errMsg)) {
      return 'AI 服务返回格式异常，请稍后重试'
    }
    console.error('=>errMsg:', errMsg);
    return '生成店铺描述失败，请稍后重试'
  }

  async genShopDesc (req, res) {
    const keyword = this.normalizeKeyword(req.query.keyword)
    let model = this.defaultModel

    try {
      const modelList = await this.getAvailableModels()
      model = this.pickModel(modelList)
      const description = await this.chat(model, keyword)

      if (!description) {
        throw new Error('empty ai response')
      }

      res.json({
        msg: '生成成功',
        data: {
          keyword,
          description,
          model
        }
      })
    } catch (err) {
      res.json({
        code: 20002,
        msg: this.getErrorMsg(err, model),
        errLog: err?.stack || err
      })
    }
  }

  async *chatStream(model, keyword) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout)

    try {
      const ollamaClient = this.createClient(controller.signal)
      const stream = await ollamaClient.chat({
        model,
        messages: this.buildMessages(keyword),
        stream: true,
        keep_alive: this.keepAlive,
        think: 'low',
        options: {
          temperature: 0.7,
          num_predict: 180
        }
      })

      for await (const chunk of stream) {
        yield chunk?.message?.content || ''
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async genShopDescStream (req, res) {
    const keyword = this.normalizeKeyword(req.query.keyword)
    let model = this.defaultModel

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    try {
      const modelList = await this.getAvailableModels()
      model = this.pickModel(modelList)

      // 先发送模型信息
      res.write(`data: ${JSON.stringify({ event: 'start', model })}\n\n`)

      let fullText = ''
      const stream = this.chatStream(model, keyword)

      for await (const chunk of stream) {
        if (!chunk) continue
        fullText += chunk
        res.write(`data: ${JSON.stringify({ event: 'delta', text: chunk })}\n\n`)
        res.flushHeaders()
      }

      const description = this.cleanDescription(fullText)

      if (!description) {
        throw new Error('empty ai response')
      }

      // 发送完成事件
      res.write(`data: ${JSON.stringify({ event: 'done', keyword, description })}\n\n`)
    } catch (err) {
      res.write(`data: ${JSON.stringify({ event: 'error', msg: this.getErrorMsg(err, model) })}\n\n`)
    } finally {
      res.end()
    }
  }
}

module.exports = new AiService()
