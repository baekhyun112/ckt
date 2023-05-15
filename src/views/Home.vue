<template>
  <div class="home">

    <router-link to="/search">
      <div class="search-con">
        <div class="search-center">
          <div class="taro-img">
            <img src="../assets/search.png" alt="">
          </div>
          <span class="taro-text">400000+ 免费模板任你搜索</span>
        </div>
      </div>
    </router-link>




    <div class="scene">
      <router-link :to="`/sceneDetails?kindId=${s.designKindId}&n=${s.name}`" v-for="s in scene" :key="s.designKindId">
        <img :src="s.thumbUrl" alt="">
        <p>{{ s.name }}</p>
      </router-link>
    </div>

    <div class="theme">
      <div class="title">
        <h2>推荐专题</h2>
      </div>
      <div class="list">
        <router-link :to="`/tempDetail?themeId=${t.id}`" v-for="t in themes" :key="t.id">
          <p class="theme-text-top">{{ t.title }}</p>
          <p class="theme-text-bot">{{ t.themeDescribe }}</p>
        </router-link>
      </div>
    </div>


    <div class="scene-detail">
      <div class="kind" v-for="sc, i in sceneDetail" :key="i">
        <div class="title">
          <h2>{{ sc.name }}</h2>
          <router-link :to="`/sceneDetails?kindId=${sc.kindId}`">进入场景</router-link>
        </div>
        <div class="templates">
          <router-link :to="`/themeDetails?t=${t.designTemplateId}`" class="temImg" v-for="t in sc.templates"
            :key="t.designTemplateId">
            <img :src="t.designTemplateImageUrl" alt="">
          </router-link>
        </div>
        <div class="btns">
          <router-link :to="`/sceneDetails?kindId=${sc.kindId}`">更多</router-link>
          <a href="javascript:void(0)" @click="change(sc.kindId, sc.name, sc.pageNo, sc.pageTotal)">换一换</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
export default {
  data() {
    return {
      scene: [],
      sceneDetail: [],
      themes: [],
      pageNo: 1,
      scrollHalder: _.throttle(this.hanlder, 1000),
      scrollTop: 0,
      isLoading: false,
      isMore: true,
    }
  },
  mounted() {
    this.getMainMiniProgramHomeInfo()
    this.getRecommendedTopic()
    window.addEventListener("scroll",this.scrollHalder)
  },
  beforeDestroy(){
    window.removeEventListener("scroll",this.scrollHalder)
  },
  methods: {
    async getMainMiniProgramHomeInfo() {
      let url = `/v2/mobile/main/getMainMiniProgramHomeInfo.do?_dataType=json&_dataClientType=3&client_type=40&business_type=1,2,3`;
      let result = await axios.get(url);
      console.log(result)
      let data = result.data.body.data;
      this.scene = _.slice(data.scene, 0, 8);

      let sceneDetail = data.sceneDetails.sceneDetail;
      for (const sc of sceneDetail) {
        sc.pageNo = 1;
      }
      // console.log(sceneDetail);
      this.sceneDetail = sceneDetail
    },
    async getRecommendedTopic() {
      let url = `/v2/solutionSubject/theme.do?_dataType=json&_dataClientType=3&client_type=40&solutionSubjectId=1&pageNum=1&pageSize=6&templatePageSize=6&type=3&device=2&business_type=1%2C2%2C3`
      let result = await axios.get(url);
      // console.log(result.data.body.data.themes);
      this.themes = result.data.body.data.themes
    },
    change(kindId, name, pageNo, pageTotal) {
      pageNo = pageNo >= pageTotal ? 1 : pageNo + 1;
      let url = `https://pub-cdn-oss.chuangkit.com/cache/today_recommend_template_v2/today_recommend_mobile_v2_${kindId}_6_${pageNo}?v=1683340291000&client_type=40&_dataClientType=3`;
      axios.get(url).then(res => {
        // console.log(res.data.body.templates)
        // 重新更改this.sceneDetail中的pageNo
        var data = res.data.body;
        data.pageNo = pageNo;
        data.name = name;

        let index = this.sceneDetail.findIndex(sc => sc.kindId == kindId);
        this.sceneDetail.splice(index, 1, data);

      });
    },
    hanlder() {
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      this.scrollTop = scrollTop;

      if (this.isLoading) return;
      if (!this.isMore) return;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.pageNo = this.pageNo + 1;
        let url = `/v2/mobile/main/getSceneDetail.do?_dataType=json&_dataClientType=3&client_type=40&page_no=${this.pageNo}&business_type=1,2,3`
        this.isLoading = true;
        axios.get(url).then(res => {
          let data = res.data.body.data;
          if (data.recordCount == 0) {
            this.isMore = false;
          }

          let sceneDetail = data.sceneDetail;
          for(const sc of sceneDetail){
            sc.pageNo = 1;
           
          }
          this.sceneDetail = [...this.sceneDetail,...sceneDetail]
        }).catch(err=>{
          this.pageNo = this.pageNo - 1;
        }).finally(()=>{
          this.isLoading = false;
        })

      }
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  .search-con {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 999;
    padding: .42667rem 0;

    .search-center {
      width: 14.976rem;
      height: 1.45067rem;
      margin: 0 auto;
      background-color: #f8f8fb;
      border-radius: .72533rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .taro-img {
        width: 0.59rem;
        margin-right: .448rem;
        display: inline-block;

        &>img {
          width: 100%;
          height: 100%;
          margin-bottom: 2px;
        }
      }

      .taro-text {
        font-size: .55467rem;
        color: rgba(0, 0, 0, .6);
      }
    }
  }

  .scene {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 2.78rem 0 .59733rem;
    border-bottom: 0.1707rem solid rgb(247, 249, 251);

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 2.34667rem;
      margin: 0 .81067rem .68267rem;

      img {
        width: 2.34667rem;
        height: 2.34667rem;
        margin-bottom: .55467rem;

      }

      p {
        white-space: nowrap;
        font-size: .512rem;
        color: rgba(0, 0, 0, .8);
      }
    }

  }

  .theme {
    padding: 0 .512rem;

    .title {
      padding: 1.08rem 0px 0.6534rem;

      h2 {
        font-size: .68267rem;
        color: #000;
        font-weight: 600;
      }
    }

    .list {
      overflow-x: scroll;
      white-space: nowrap;

      a {
        display: inline-block;
        position: relative;
        width: 4.42rem;
        height: 2.7733rem;
        padding-left: .68267rem;
        font-weight: bolder;
        background-color: #fff;
        box-shadow: 0 0.17067rem 0.768rem 0 rgba(20, 38, 86, .1);
        border-radius: .17067rem;
        overflow: hidden;
        text-align: left;
        margin: .512rem 0 .68267rem .512rem;

        &:first-child {
          margin: .512rem 0 .68267rem;
        }

        &::after {
          content: "";
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          position: absolute;
          right: -20px;
          bottom: -20px;
        }

        &:nth-child(1)::after {
          background-color: #ff406c;
        }

        &:nth-child(2)::after {
          background-color: #ffc11b;
        }

        &:nth-child(3)::after {
          background-color: #00cb47;
        }

        &:nth-child(4)::after {
          background-color: #c86efd;
        }

        &:nth-child(5)::after {
          background-color: #3ba9ff;
        }

        &:nth-child(6)::after {
          background-color: #ff406c;
        }

        .theme-text-top {
          color: #000;
          font-size: .59733rem;
          font-weight: 700;
          margin-top: .68267rem;
        }

        .theme-text-bot {
          color: rgba(0, 0, 0, .6);
          font-size: .46933rem;
          margin-top: .17067rem;
        }
      }
    }
  }

  .scene-detail {
    .kind {
      .title {
        display: flex;
        justify-content: space-between;
        padding: .68267rem .512rem .85333rem;
        line-height: 1;

        h2 {
          font-size: .68267rem;
          color: #000;
          font-weight: 600;
        }

        a {
          font-size: .512rem;
          color: #000;
        }
      }

      .templates {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 .512rem;

        a {
          display: flex;
          width: 5.34rem;
          border-radius: .128rem;
          border: .02133rem solid #e6e6e6;
          margin-bottom: .42667rem;

          img {
            width: 100%;
          }
        }
      }

      .btns {
        padding: 0 .512rem;
        color: rgba(0, 0, 0, .8);
        font-size: .55467rem;
        display: flex;
        justify-content: space-between;

        a {
          display: block;
          width: 7.27467rem;
          line-height: 1.70667rem;
          text-align: center;
          background-color: #f3f4f9;
          border-radius: .85333rem;
        }
      }
    }
  }
}
</style>
