
<p align="center">
  <img width="180" src="http://static.foodshops.fun/G5jFHRBPy8RwPhM.png" alt="logo">
</p>

# FoodShop
一个有完整全流程(商品列表，定位推荐，下单，支付，配送(定时任务)，订单，个人中心)业务场景的C端外卖项目，由20多个的页面承载实现!

## Server端技术栈
node(v14.20) + express(v4.17.3) + mongoDB(v4.2.12) + mongoose(^6.2.8) + redis(v7.0.5) + rabbitMQ(v3.13.0) + 自定义logger分割

## 项目运行
>- TIPS: 项目运行前 请先安装并启动mongoDB，redis以及rabbitmq的对应版本，保证数据和缓存的正常存取。

```
git clone https://github.com/Exps-Lab/foodshop-node.git

cd foodshop-node

npm install

npm run start

```
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
```
* 参考项目以及开发过程中的技术选型：
  wiki：(https://github.com/exp-express/exp-express/wiki)
* 项目表结构设计：
  wiki：https://github.com/exp-express/exp-express/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AE%BE%E8%AE%A1
* 各业务场景api:
  wiki：https://github.com/exp-express/exp-express/wiki/%E7%B1%BBelm%E5%B9%B3%E5%8F%B0-server-%E6%96%87%E6%A1%A3
```

## 项目结构简介
```
.
├── README.md
├── app
│   ├── controller
│   │   ├── admin
│   │   ├── h5
│   │   └── test.js
│   ├── global.js
│   ├── helper
│   │   ├── calcGoodsPrice.js
│   │   ├── captcha.js
│   │   ├── dictionary.js
│   │   ├── fetch.js
│   │   └── index.js
│   ├── middleware
│   │   ├── gateway.js
│   │   ├── index.js
│   │   └── resFilter.js
│   ├── model
│   │   ├── admin
│   │   ├── common
│   │   ├── h5
│   │   └── test.js
│   ├── plugin
│   │   └── autoEnhanceIndex.js
│   ├── redis-prekey
│   │   └── index.js
│   ├── router
│   │   ├── admin
│   │   ├── h5
│   │   ├── index.js
│   │   └── test.js
│   └── service
│       ├── admin
│       ├── base-class
│       ├── h5
│       └── test.js
├── build
│   └── new_tag.sh
├── conf
│   └── index.js
├── index.js
├── initSql
│   ├── category.js
│   ├── city.js
│   ├── index.js
│   ├── menu.js
│   ├── originData
│   │   ├── category.min.js
│   │   └── city.min.js
│   ├── role.js
│   └── user.js
├── logger.js
├── mongoDB
│   ├── dbBackend.shell
│   └── index.js
├── package-lock.json
├── package.json
├── rabbitMQ
│   ├── DLXCallbackList.js
│   ├── DLXKeyMap.js
│   ├── DLXList.js
│   ├── createTTLMQ.js
│   └── index.js
├── redis
│   └── index.js

26 directories, 40 files

```

## License
[GPL](https://github.com/Exps-Lab/foodshop-h5/blob/master/LICENSE)
