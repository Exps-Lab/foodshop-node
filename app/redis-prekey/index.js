// 存储所有redis的key前置值，便于维护全站redis结构

// 购物袋
const shoppingBagPreKey = {
  key: 'sale:shoppingBag',
  expireTime: 15 * 60 // 购物袋有效期15分钟
}

// h5 User
const h5UserInfoPreKey = {
  key: 'user:h5:userInfo',
  expireTime: 24 * 60 * 60 // 用户信息效期24小时
}

// h5 地址
const h5UserAddressPreKey = {
  key: 'user:h5:address',
  expireTime: 15 * 24 * 60 * 60 // 地址信息效期15天
}

module.exports = {
  shoppingBagPreKey,
  h5UserInfoPreKey,
  h5UserAddressPreKey
}
