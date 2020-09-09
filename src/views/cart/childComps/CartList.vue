<template>
  <scroll class="content" ref="scroll">
    <div>
      <CartListItem v-for="item in cartList" :key="item.iid" :item-info="item"></CartListItem>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

	export default {
		name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    props: {
		  cartList: {
		    type: Array,
        default() {
		      return []
        }
      }
    },
    activated() {
      this.$refs.scroll.refresh()
    },
	}
</script>

<style scoped>
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 93px;
    width: 100%;
  }
</style>
