<template>
  <div class="scene-details">
    <div class="scene-top">
      <div class="scene-serach">
        <div class="scene-icon"></div>
        <router-link :to="`/search?secondKindId=${this.kindId}`">在当前场景下搜索</router-link>
      </div>

      <div class="scrollbar">
        <ul class="scene-scroll">
          <li :class="{ active: tagId == 0 }" @click="changeId(0)">全部</li>
          <li :class="{ active: tagId == s.tagId }" v-for="s, i in scrolltitle" :key="i" @click="changeId(s.tagId)">
            {{ s.name }}</li>
        </ul>
      </div>

      <div class="filderBtn">
        <div class="rankBtn">
          <div class="rankItem" :class="{ active: type == 0 }" @click="changeType(0)">最热</div>
          <div class="rankItem" :class="{ active: type == 1 }" @click="changeType(1)">最新</div>
          <div class="rankItem" :class="{ active: type == 2 }" @click="changeType(2)">使用最多</div>
          <div class="rankItem" :class="{ active: type == 3 }" @click="changeType(3)">最多收藏</div>
          <div class="rankItem more" @click="changeShow">
            <span v-if="add">筛选</span>
            <span v-if="edd">收起</span>
          </div>
        </div>
        <div class="priceBtn" v-show="isShow">
          <div class="priceItem" :class="{ active: screening == 0 }" @click="changeScreening(0)">全部</div>
          <div class="priceItem" :class="{ active: screening == 2 }" @click="changeScreening(2)">免费</div>
          <div class="priceItem" :class="{ active: screening == 3 }" @click="changeScreening(3)">付费</div>
        </div>
      </div>


    </div>

    <div class="scene-bot">
      <router-link :to="`/themeDetails?t=${s.designTemplateId}`" v-for="s, i in sceneImg" :key="i">
        <img :src="s.designTemplateThumbUrls[0]" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
export default {
  data() {
    return {
      kindId: 0,
      pageNo: 1,
      scrolltitle: [],
      tagId: 0,
      type: 0,
      screening: 0,
      isShow: false,
      add: true,
      edd: false,
      sceneImg: [],
      currentPage: 1,
      isLoading: false,
      isMore: true,
      scrollHandler:_.throttle(this.handler,1000),
      scrollTop:0,
    }
  },
  watch: {
    type(newValue, oldValue) {
      this.currentPage = 1;
      this.getScrollTitle()
    }
  },
  mounted() {
    this.kindId = this.$route.query.kindId
    this.getScrollTitle();
    this.getSceneImg(false);
    window.addEventListener("scroll",this.scrollHandler)
  },
  beforeRouteEnter(to,from,next){
    if(to.query.kindId){
      next();
    }else{
      next('/')
    }
  },
  beforeDestroy(){
    window.removeEventListener("scroll",this.scrollHandler)
  },
  methods: {
    // 全部 列表数据
    getScrollTitle() {
      let url = `/ckt/home/getDesignType.do?_dataType=json&client_type=40&second_kind_id=${this.kindId}&_dataClientType=3`;
      axios.get(url).then(res => {
        this.scrolltitle = res.data.body.secondKindInfo.repoTag.use;
      })

    },
    getSceneImg(isDown) {
      let url = `/oss/cache/today_recommend_template_v2/today_recommend_mobile_v2_${this.kindId}_50_${this.pageNo}?v=${Date.now()}&client_type=40&_dataClientType=3`
      if (this.tagId != 0 || this.type != 0 || this.screening != 0) {
        if (this.tagId == 0) {
          url = `/oss/cache/wx_app_template_cache_v2/0_${this.pageNo}_50_0_${this.kindId}_0_0_${this.type}_${this.screening}?v=${Date.now()}&client_type=40&_dataClientType=3`
        }
        else {
          url = `/oss/cache/wx_app_template_cache_v2/1_${this.pageNo}_50_${this.kindId}_0_0_${this.tagId}_${this.type}_${this.screening}?v=${Date.now()}&client_type=40&_dataClientType=3`
        }
      }
      this.isLoading = true;
      axios.get(url).then(res => {
        if (isDown) {
          this.sceneImg = [...this.sceneImg, ...res.data.body.templates]
        } else {
          this.sceneImg = res.data.body.templates;
        }
      }).catch(err => {

      }).finally(() => {
        this.isLoading = false;
      })
    },
    changeId(id) {
      this.tagId = id;
      this.pageNo = 1;
      this.isLoading = false;
      this.isMore = true;
      this.getSceneImg(false);
    },
    changeType(type) {
      this.type = type;
      this.pageNo = 1;
      this.isLoading = false;
      this.isMore = true;
      this.getSceneImg(false);
    },
    changeScreening(screening) {
      this.screening = screening;
      this.pageNo = 1;
      this.isLoading = false;
      this.isMore = true;
      this.getSceneImg(false);
    },
    changeShow() {
      this.isShow = !this.isShow;
      this.add = !this.add;
      this.edd = !this.edd;
    },
    handler(){
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      this.scrollTop = scrollTop;

      if (this.isLoading) return;
      if (!this.isMore) return;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.pageNo = this.pageNo + 1;
        this.getSceneImg(true);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.scene-top {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #fff;

  .scene-serach {
    margin: .21333rem auto;
    width: 14.976rem;
    height: 1.45rem;
    background-color: #f8f8fb;
    border-radius: .725rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .scene-icon {
      width: .597rem;
      height: .597rem;
      margin-right: .448rem;
      background: url(../assets/search.png) no-repeat;
      background-size: contain;
    }

    a {
      font-size: .554rem;
      color: rgba(0, 0, 0, .6);
    }
  }

  .scrollbar {
    width: 100%;
    border-bottom: .021rem solid #eee;

    position: relative;

    .scene-scroll {
      overflow-x: scroll;
      white-space: nowrap;
      padding-left: .597rem;
      padding-right: .597rem;

      li {
        white-space: nowrap;
        display: inline-block;

        font-size: .64rem;
        margin-right: .853rem;
        line-height: 1.664rem;
      }

      .active {
        position: relative;
        font-weight: 600;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: .853rem;
          height: .128rem;
          background-color: #0773fc;
          border-radius: 2.133rem 2.133rem 0 0;
        }
      }
    }
  }

  .filderBtn {
    padding: .597rem .512rem;
    background-color: #fff;
    font-size: 0;

    .rankItem,
    .priceItem {
      display: inline-block;
      border-radius: .64rem;
      height: 1.28rem;
      line-height: 1.28rem;
      text-align: center;
      font-size: .512rem;
      margin-right: .469rem;
      background-color: #f3f4f9;

      &:nth-child(n+3) {
        width: 3.072rem;
      }

      &:nth-child(-n+2) {
        width: 2.133rem;
      }

      &:last-child {
        width: 2.63rem;
        margin: 0;
      }

      &.active {
        background-color: #0773fc;
        color: #fff;
      }
    }

    .priceBtn {
      padding-top: .512rem;

      .priceItem {
        width: 2.133rem;
        color: rgba(0, 0, 0, .8);

        &.active {
          color: #fff;
        }
      }
    }
  }
}

.scene-bot {
  padding: 0 .512rem .512rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  a {
    display: block;
    width: 7.974rem;
    height: 12.928rem;
    margin-bottom: .426rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
