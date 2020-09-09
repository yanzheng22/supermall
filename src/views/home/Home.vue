<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    
    <TabControl :titles = '["流行", "新款", "精选"]'
    @tabClick = 'tabClick' ref="tabControl1"
    class="tab-control" v-show="isTabFixed"></TabControl>
    
    <Scroll class="content" ref="scroll" :probetype='3'
    @scroll='contentScroll' :pullupload = 'true' @pullingUp='loadMore'>

      <HomeSwiper :banners = 'banners' @swiperImageLoad = 'swiperImageLoad'></HomeSwiper>

      <RecommendView :recommends = 'recommends'></RecommendView>

      <FeatureView></FeatureView>

      <TabControl :titles = '["流行", "新款", "精选"]'
      @tabClick = 'tabClick' ref="tabControl2"></TabControl>

      <GoodsList :goods = 'showGoods'></GoodsList>

    </Scroll>

    <!-- 如果要直接监听组件的事件，需要加.native修饰 -->
    <BackTop @click.native="backClick" v-show="isShowBackTop"></BackTop>
  </div>
</template>

<script>
  
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'


  export default {
    name: 'Home',
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      HomeSwiper,
      RecommendView,
      FeatureView
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.refresh()
      this.$refs.scroll.scroll.scrollTo(0, this.saveY)
    },
    deactivated() {
      //保存Y值
      this.saveY = this.$refs.scroll.scroll.y
      //取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    created() {
      this.homeMultidata()

      this.homeGoods('pop')
      this.homeGoods('new')
      this.homeGoods('sell')

    },
    methods: {
      
      //事件监听相关的方法
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 1000
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.homeGoods(this.currentType)
      },
      swiperImageLoad(){
        //所有组件都有一个属性$el，用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      
      //网络请求相关的方法
      homeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      homeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.scroll.finishPullUp()
        })
      }
    },
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    /* 视口高度 */
    height: 100vh;
    position: relative;
  }
  
  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1; */
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
  }

  .tab-control {
    position: relative;
    z-index: 1;
  }

</style>