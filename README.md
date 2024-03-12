
<p align="center">
  <img width="180" src="http://static.foodshops.fun/G5jFHRBPy8RwPhM.png" alt="logo">
</p>

# FoodShop
一个有完整全流程(商品列表，定位推荐，下单，支付，配送(定时任务)，订单，个人中心)业务场景的C端外卖项目，由20多个的页面承载实现!

## Server端技术栈
node(v14.20) + express(v4.17.3) + mongoDB(v4.2.12) + mongoose(^6.2.8) + redis(v7.0.5) + rabbitMQ(v3.13.0) + 自定义logger分割

## 项目运行
```
git clone https://github.com/Exps-Lab/foodshop-node.git

cd foodshop-node

npm install

npm run start
```
> **Tips：项目运行前 请先安装并启动 mongoDB，redis以及rabbitmq，保证数据和缓存的正常存取和所有功能正常使用。目前foodshop-h5用户端项目数据都是从接口获取的真实数据！**

## 特殊场景实现
>- **订单支付**：目前是以 “餐币” 承载支付，账户不足可以在用户端账户页面自行充值！

>- **订单超时取消 / 订单配送(虚拟)**： rabbitmq延时任务实现，业务计算配送时间，超过时间自行取消订单 或 商品已送达

## 效果演示
#### h5端线上效果演示，直接扫码体验：
<img width="200" src="http://static.foodshops.fun/ns6dBb2iJWbteQi.png" alt="qrcode">

## 关联项目列表
| 项目             | 项目描述       | 技术栈                                                                    | 项目链接          |
|----------------|----------------|------------------------------------------------------------------------|-----------------|
| foodshop-h5    | FoodShop售卖系统——h5用户端 | Vue3 + Vite + Vant + MPA                                               | https://github.com/Exps-Lab/foodshop-h5     |
| foodshop-node  | FoodShop售卖系统——server端 | Node + Mongodb + Mongoose + Express + Redis + RabbitMQ + Nginx + MVC模式 | https://github.com/Exps-Lab/foodshop-node   |
| foodshop-admin | FoodShop售卖系统——admin管理后台端| Vue3 + Vite + Arco.design + SPA                                        | https://github.com/Exps-Lab/foodshop-admin     |

## 相关文档：
#### 参考项目以及开发过程中的技术选型：
  wiki：https://github.com/Exps-Lab/foodshop-node/wiki/foodshop%E2%80%90node-wiki
#### 项目表结构设计：
  wiki：https://github.com/Exps-Lab/foodshop-node/wiki/FoodShop-%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3
#### 各业务场景 接口文档:
  wiki：https://github.com/Exps-Lab/foodshop-node/wiki/FoodShop-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3

## 项目结构简介
```
.
├── README.md
├── app                                    所有业务代码文件
│   ├── controller                         控制器：
│   │   ├── admin                                管理后台 控制器
│   │   ├── h5                                   用户端 控制器
│   │   └── test.js
│   ├── global.js                                全局方案方法统一绑定
│   ├── helper                                   helper工具库
│   │   ├── calcGoodsPrice.js
│   │   ├── captcha.js                           验证码
│   │   ├── dictionary.js                        中英文转换搜索码表
│   │   ├── fetch.js                             fetch请求封装
│   │   └── index.js
│   ├── middleware                               中间件
│   │   ├── gateway.js                           统一简单网关，处理auth接口拦截等
│   │   ├── index.js
│   │   └── resFilter.js                         接口返回格式统一封装
│   ├── model                              model数据层：
│   │   ├── admin                                管理后台相关
│   │   ├── common                               公共逻辑
│   │   ├── h5                                   用户端相关
│   │   └── test.js
│   ├── plugin                             plugin相关：
│   │   └── autoEnhanceIndex.js                  数据库自增
│   ├── redis-prekey                       redis的所有key值统一维护
│   │   └── index.js
│   ├── router                             接口路由表：
│   │   ├── admin                                用户端 接口路由
│   │   ├── h5                                   管理后台 接口路由
│   │   ├── index.js
│   │   └── test.js
│   └── service                            service业务层：
│       ├── admin                                管理后台 service业务层
│       ├── base-class                           base 公用的业务封装
│       ├── h5                                   用户端 service业务层
│       └── test.js
├── conf                                   mongodb，redis，log等配置：
│   └── index.js
├── index.js                               初始化项目：
├── initSql                                部分需要初始化数据库操作：
│   ├── category.js                              商品分类表
│   ├── city.js                                  城市表
│   ├── index.js
│   ├── menu.js                                  admin菜单表
│   ├── originData
│   │   ├── category.min.js
│   │   └── city.min.js
│   ├── role.js                                  admin角色表
│   └── user.js                                  用户端用户表
├── logger.js                              logger埋点封装
├── mongoDB
│   ├── dbBackend.shell                          数据库备份脚本：
│   └── index.js                                 数据库配置项：
├── package.json
├── rabbitMQ                               rabbitMQ相关：
│   ├── DLXCallbackList.js                       mq延时任务回调配置
│   ├── DLXKeyMap.js                             mq延时任务Key值表
│   ├── DLXList.js                               mq延时任务列表
│   ├── createTTLMQ.js                           mq创建
│   └── index.js
├── redis                                  redis相关：
│   └── index.js                                 redis配置

26 directories, 40 files

```

## License
[GPL](https://github.com/Exps-Lab/foodshop-h5/blob/master/LICENSE)
