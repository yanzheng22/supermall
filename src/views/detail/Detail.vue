<template>
  <div id="detail">
    <DetailNavBar class="detail-nav" @titleClick = 'titleClick'
    ref="nav"></DetailNavBar>

    <Scroll class="content" ref="scroll" @scroll="contentScroll"
    :probetype = '3'>
      <DetailSwiper :topimages = 'topimages'></DetailSwiper>

      <DetailBaseInfo :goods = 'goods'></DetailBaseInfo>

      <DetailShopInfo :shop = 'shop'></DetailShopInfo>

      <DetailGoodsInfo :detail-info = 'detailInfo'
      @imageLoad = 'imageLoad'></DetailGoodsInfo>

      <DetailParamInfo :param-info = 'paramInfo'
      ref="params"></DetailParamInfo>

      <DetailCommentInfo :comment-info = 'commentInfo'
      ref="comment"></DetailCommentInfo>

      <GoodsList :goods = 'recommends'
      ref="recommend"></GoodsList>
    </Scroll>

    <DetailBottomBar @addCart = 'addToCart'></DetailBottomBar>

    <BackTop @click.native="backClick" v-show="isShowBackTop"></BackTop>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  
  export default {
    name: 'Detail',
    components: {
      Scroll,
      GoodsList,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topimages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        themeTopYs: [],
        refresh: null,
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    destroyed() {
      //取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    created() {
      //保存传入的iid
      this.iid = this.$route.params.iid

      //根据iid请求详细数据
      getDetail(this.iid).then(res => {
        const data = res.result
        //获取顶部的图片轮播数据
        this.topimages = data.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //获取商家信息
        this.shop = new Shop(data.shopInfo)

        //保存商品详情数据
        this.detailInfo = data.detailInfo

        //获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //取出评论的信息
        if(data.rate.cRate != 0){
          this.commentInfo = data.rate.list[0]
        }
        
      })

      //请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      //Goods图片渲染后刷新scroll的长度
      this.refresh = debounce(() => {
        this.$refs.scroll.refresh()
      }, 200)
      
      //取得图片渲染后各个组件的位置
      this.getThemeTopY = debounce(() =>{
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      }, 500)
    },
    methods: {
      imageLoad(){
        this.refresh()

        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position){
        const positionY = -position.y
        for(let i = 0; i < this.themeTopYs.length-1; i++){
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        this.isShowBackTop = (-position.y) > 1000
      },
      addToCart(){
        const product = {}
        product.image = this.topimages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        this.$store.dispatch('addCart', product).then(res => {
          this.$toast.toastShow(res, 2000)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
  }

  .detail-nav {
    position: relative;
    z-index: 1;
    background-color: #fff;
  }
</style>