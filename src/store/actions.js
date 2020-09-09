export default {
  addCart(context, payload){
    return new Promise((resolve, reject) => {
      //1.查找之前数组中是否有该商品,有就返回以前商品对象
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      //2.判断oleProduct
      if(oldProduct){
        context.commit('addCounter', oldProduct)
        resolve('当前的商品数量+1')
      }else {
        payload.count = 1
        context.commit('addToCart', payload)
        resolve('添加了新的商品')
      }
    })
  }
}