<template>
  <div id="cart">
    <NavBar class="nav-bar"><div slot="center">购物车({{cartCount}})</div></NavBar>
    <CartList :cart-list="cartList"></CartList>
    <BottomBar></BottomBar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList'
  import BottomBar from './childComps/BottomBar'

	export default {
		name: "Cart",
    components: {
		  NavBar,
      CartList,
      BottomBar
    },
    computed: {
		  cartList() {
		    return this.$store.getters.CartList
      },
      cartCount() {
		    return this.$store.getters.CartLength
      }
    }
	}
</script>

<style scoped>
  #cart {
    position: relative;
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
    position: relative;
    z-index: 1;
  }

</style>
