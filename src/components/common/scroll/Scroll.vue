<template>
  <div class="warpper" ref="warpper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  
  export default {
    name: 'Scroll',
    props: {
      probetype: {
        type: Number,
        default: 0
      },
      pullupload: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.warpper, {
        click: true,
        probeType: this.probetype,
        pullUpLoad: this.pullupload
      })
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      })
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    },
    methods: {
      //这里加一个&&运算符，是为了判断&&左边的组件是否创建完成
      refresh(){
        this.scroll && this.scroll.refresh()
      }
    },
  }
</script>

<style scoped>

</style>