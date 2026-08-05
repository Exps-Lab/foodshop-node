# Foodshop Node 项目开发规范

## 一、项目概述

基于 Express.js 的外卖系统后端，采用 **MVC 架构**，集成 MongoDB、Redis、RabbitMQ。

- **框架**: Express.js 4.x | **数据库**: MongoDB (Mongoose 6.x) | **缓存**: Redis 4.x
- **消息队列**: RabbitMQ (amqplib) | **文件存储**: 七牛云 OSS | **AI**: Ollama

---

## 二、目录结构

```
foodshop-node/
├── app/
│   ├── controller/       # 控制器 - 参数校验、调用 Service
│   │   ├── admin/        # 后台管理接口
│   │   └── h5/           # H5 用户端接口
│   ├── service/          # 服务层 - 业务逻辑
│   │   ├── admin/        # 后台管理服务
│   │   ├── h5/           # H5 用户端服务
│   │   └── base-class/   # 可复用的基础服务类
│   ├── model/            # 数据模型 - Mongoose Schema
│   │   ├── admin/        # 后台管理模型
│   │   ├── h5/           # H5 用户端模型
│   │   └── common/       # 公共模型（城市、分类等）
│   ├── router/           # 路由（admin/ + h5/）
│   ├── middleware/        # 中间件（跨域、Session、日志、响应拦截）
│   ├── helper/           # 工具函数（验证、加密、价格计算等）
│   ├── plugin/           # Mongoose 插件（自增ID）
│   ├── redis-prekey/     # Redis Key 统一管理
│   └── global.js         # 全局方法挂载 → _common
├── rabbitMQ/             # MQ 配置（DLXKeyMap / DLXList / DLXCallbackList）
├── redis/                # Redis 客户端封装
├── mongoDB/              # MongoDB 连接与初始化
├── conf/                 # 配置（数据库、Session、七牛云）
├── initSql/              # 数据库初始化数据
├── logger.js             # 日志系统（Web / App / DB）
└── index.js              # 应用入口
```

---

## 三、MVC 架构规范

### 3.1 Controller 层

**职责**：参数校验 + 转发 Service，**不写业务逻辑**。

- 文件名：`kebab-case`（如 `food-category.js`）| 类名：`PascalCase` | 方法名：`camelCase`
- 校验使用 `_common.validate(rules, req)`
- 导出单例实例：`module.exports = new XxxController()`

### 3.2 Service 层

**职责**：业务逻辑、数据库操作、缓存/MQ 调用。

- 可复用方法命名为 `xxxHelper`（如 `getOrderDetailHelper`）
- 查询默认排除系统字段：`'-_id -__v'`，使用 `.lean(true)` 返回纯 JS 对象

### 3.3 Model 层

**职责**：定义 Schema、字段类型、索引。

- 字段名：`snake_case`（如 `shop_id`、`food_category_id`）
- **必须注册自增插件**：`Schema.plugin(AutoEnhanceIndexPlugin, { model: 'xxx', field: 'id' })`
- 时间字段：`c_time`（创建）、`update_time`（更新）| 外键：`xxx_id`

---

## 四、命名规范（重点）

### 4.1 数据库字段

| 类型 | 规范 | 示例 |
|------|------|------|
| 主键/外键 | `snake_case` / `xxx_id` | `id`, `shop_id`, `food_category_id` |
| 时间戳 | `xxx_time` | `c_time`, `cancel_time`, `complete_time` |
| 布尔值 | `is_xxx` / `has_xxx` | `is_discount`, `has_discount` |
| 数组 | `xxx_Arr` | `discount_Arr` |
| 金额 | `xxx_price` / `xxx_fee` | `delivery_fee`, `packing_fee` |

### 4.2 Redis Key（统一管理：`app/redis-prekey/index.js`）

**格式**：`模块:子模块:业务标识`，**禁止业务代码硬编码 Key**。

```javascript
// 定义（redis-prekey/index.js）
const shoppingBagPreKey = { key: 'sale:shoppingBag', expireTime: 15 * 60 }

// 使用
const { h5UserInfoPreKey } = require('../../redis-prekey')
const redisKey = `${h5UserInfoPreKey.key}:${u_id}`
await _common.RedisInstance.hSet(redisKey, data, '', h5UserInfoPreKey.expireTime)
```

**强制**：所有 Key 必须在 `redis-prekey/index.js` 统一定义，含 `key` 和 `expireTime`（秒）。

### 4.3 RabbitMQ Key（统一管理：`rabbitMQ/`）

| 文件 | 职责 |
|------|------|
| `DLXKeyMap.js` | 死信交换机（`xxxExDLX`）+ 路由键（`xxxMessage`） |
| `DLXList.js` | 队列配置（延迟时间、消费者回调） |
| `DLXCallbackList.js` | 消费者回调实现 |

队列名由系统自动生成：`ttlQueue_xxx` / `consumerQueue_xxx`。

### 4.4 方法命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 查询 | `getXxx` / `getXxxList` / `getXxxDetail` | `getFoodList`, `getOrderDetailHelper` |
| 增删改 | `addXxx` / `updateXxx` / `deleteXxx` | `addFood`, `updateFood`, `deleteFood` |
| 可复用辅助 | `xxxHelper` | `getOrderDetailHelper` |
| 基础方法 | `baseXxx` | `baseLogin`, `baseLogout` |

### 4.5 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 普通变量 | `camelCase` | `shopId`, `foodList` |
| 配置对象 | `xxxConf` | `sessionConf`, `qiniuConf` |
| 请求/响应 | 语义化 | `resData`, `returnData` |

---

## 五、复用与解耦

### 5.1 Base Class（`app/service/base-class/`）

| 基础类 | 职责 |
|--------|------|
| `base.js` | 七牛云上传 Token |
| `login-base.js` | 登录/登出/Session/用户 Redis 缓存 |
| `shop-base.js` | 商铺查询、分类、距离筛选 |
| `city-base.js` | 城市信息查询 |
| `pos-base.js` | IP 定位、距离计算、地图 API |

**新增原则**：逻辑在 3 个以上 Service 重复时提取到 Base Class，支持继承链。

### 5.2 Helper（`app/helper/`）

通过全局 `_common` 调用：`_common.validate()`, `_common.generateOrderNumber()`, `_common.request()` 等。

纯函数优先，不依赖 req/res。复杂计算单独建文件（如 `calcGoodsPrice.js`）。

### 5.3 Common 模型（`app/model/common/`）

跨业务共享的数据放此处（如 `category.js`, `city.js`）。

---

## 六、全局方法 `_common`

挂载位置：`app/global.js`，包含 helper 工具、日志、HTTP 请求、Redis/MQ 实例。

```javascript
_common.validate(rules, req)           // 参数校验
_common.generateOrderNumber(shopId, uId) // 订单号生成
_common.request(url, data, options)    // HTTP 请求
_common.WebLogger.info/error()         // Web 日志
_common.AppLogger.warn()               // 应用日志
_common.DBLogger.info()                // DB 日志
_common.RedisInstance                  // Redis 封装实例
_common.getMQInstance('orderPay')      // 获取 MQ 实例
```

---

## 七、路由规范

**格式**：`/模块/子模块/操作`

- `/auth/xxx`：需登录（中间件自动校验 Session）
- `/noauth/xxx`：无需登录
- 查询用 GET，增删改用 POST

```javascript
router.get('/auth/shop/list', ShopController.shopList)
router.post('/auth/food/add', FoodController.addFood)
router.post('/noauth/login', LoginController.login)
```

---

## 八、响应格式

```javascript
// 统一结构（resFilter 中间件自动格式化）
{ code: 1, msg: 'success', data: {}, stime: 1234567890 }
```

| 错误码 | 说明 |
|--------|------|
| 1 / 200 | 成功 |
| 10001 | 参数错误 |
| 10002 | 非法 Token / 未登录 |
| 20001 | 用户名密码错误 |
| 20002 | 数据库/业务错误 |

---

## 九、数据库操作要点

```javascript
// 查询排除系统字段 + lean
await Model.findOne({ id }, '-_id -__v').lean(true)

// 数组更新必须 markModified
doc.arrayField.push(item)
doc.markModified('arrayField')
await doc.save()

// 关联查询用 aggregate + $lookup
await Model.aggregate([
  { $lookup: { from: 'shop', localField: 'shop_id', foreignField: 'id', as: 'shop' } },
  { $unwind: '$shop' },
  { $sort: { id: -1 } },
  { $skip: (page_num - 1) * page_size },
  { $limit: page_size }
])
```

---

## 十、Redis 操作要点

```javascript
const { RedisInstance } = _common
// 对象存储推荐 Hash
await RedisInstance.hSet(key, data, '', expireTime)  // expireTime 单位：秒
const all = await RedisInstance.hGetAll(key)
```

---

## 十一、MQ 操作要点

```javascript
// 发送消息
const mq = _common.getMQInstance('orderPay')
await mq.productMessage({ orderNum: '123456' })

// 消费者回调在 DLXCallbackList.js 中定义
```

注意：Redis 过期时间用**秒**，MQ 延迟用**毫秒**。

---

## 十二、新增功能检查清单

| 场景 | 步骤 |
|------|------|
| 新增接口 | controller → service → model（如需） → router（标注 auth/noauth） |
| 新增 Redis Key | 在 `redis-prekey/index.js` 定义 → Service 中引入使用 |
| 新增 MQ 队列 | DLXKeyMap → DLXCallbackList → DLXList → 重启应用 |
| 新增 Base Class | 确认 ≥3 处重复 → 创建于 `base-class/` → Service 继承 |

---

## 十三、常见陷阱

1. **Mongoose 数组更新**：必须 `markModified` 否则不保存
2. **Redis 过期时间**：单位是**秒**（MQ 延迟是毫秒）
3. **Session 校验**：`/auth/` 路径自动拦截，失效返回 `code: 10002`
4. **响应格式**：必须用 `{ code, msg, data }` 结构，不要直接 `res.json(data)`
5. **Redis Key**：禁止硬编码，必须在 `redis-prekey/` 统一定义

---

## 十四、参考文件

| 文件 | 用途 |
|------|------|
| `app/router/index.js` | 路由注册入口 |
| `app/middleware/index.js` | 中间件配置 |
| `app/global.js` | 全局方法挂载 |
| `app/redis-prekey/index.js` | Redis Key 统一管理 |
| `conf/index.js` | 数据库/Session/七牛云配置 |
| `rabbitMQ/DLXList.js` | MQ 队列配置 |
| `logger.js` | 日志系统 |
