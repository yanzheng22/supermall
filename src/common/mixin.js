import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'

//混入，意思是被抽取的可以公用的部分
export const itemListenerMixin = {
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
      
    //监听item中图片加载完成
    this.itemImgListener = () => {
      //重新计算可滚动长度
      //如果没有防抖动函数，refresh会执行30次，
      //现在可能就一次，大大提高了性能
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick(){
      //.$refs.scroll拿到Scroll组件对象
      this.$refs.scroll.scroll.scrollTo(0, 0, 500)
    }
  }
}