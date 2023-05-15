<template>
  <div class="search">
    <div class="searchTop">
      <div class="searchIcon">
        <img src="../assets/search.png" alt="">
      </div>
      <input type="text" v-model="keyword" placeholder="200000+ 免费模板任你搜索" @keyup.enter="goSearch" class="searchInput">
      <router-link :to="$route.query.secondKindId ? `/sceneDetails?kindId=${$route.query.secondKindId}` : `/`"
        class="cancel">取消</router-link>
    </div>

    <div class="search-box" v-if="!keyword">
      <div class="hotSearch">
        <p>热门搜索</p>
        <div class="hotSearchList">
          <span v-for="s in searchList" :key="s.keyword" @click="changeKeyword(s.keyword)">{{ s.keyword }}</span>
        </div>
      </div>
    </div>


    <div class="scrollbar" v-else>
      <template v-if="!$route.query.secondKindId">
        <ul class="scene-scroll">
          <li :class="{ active: kindId == 0 }" @click="changeKindId(0)">全部</li>
          <li v-for="n in navs" :key="n.kindId" :class="{ active: kindId == n.kindId }" @click="changeKindId(n.kindId)">{{
            n.kindTitle }}</li>
        </ul>
        <div class="sortWrap">
          <span>{{ templatesTotalCount }}个模板</span>
          <div class="sortWrapRight">
            <span :class="{ active: sort == 0 }" @click="changeSort(0)">最新</span> |
            <span :class="{ active: sort == 1 }" @click="changeSort(1)">最热</span>
          </div>
        </div>
      </template>

      <div class="search-results" v-if="!isLoading || picTemplates.length > 0">
        <router-link :to="`/themeDetails?t=${p.designTemplateId}`" v-for="p, i in picTemplates" :key="i">
          <img :src="p.previewUrl" alt="">
        </router-link>
      </div>
      <div class="no-search" v-if="!isLoading && picTemplates.length == 0">
        <img src="../assets/noresult.png" alt="">
        <p>当前分类暂无模板</p>
      </div>

      <div class="loading" v-if="isLoading">正在加载中</div>

    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchList: [],
      keyword: "",
      pageNo: 1,
      kindId: 0,
      sort: 0,
      isLoading: false,
      isMore: true,
      navs: [],
      templatesTotalCount: 0,
      picTemplates: [],
      scrollHandler: _.throttle(this.handler, 1000),
      scrollTop: 0,
    }
  },
  mounted() {
    if (this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword;
    }
    if (this.$route.query.secondKindId) {
      this.kindId = this.$route.query.secondKindId;
    }
    this.getSearch();
    this.getNavMessage();
    this.getPicTemplate();
    window.addEventListener("scroll", this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler)
  },
  methods: {
    getNavMessage() {
      let url = `/v2/designkind/getDesignKindBasicInfo.do?_dataType=json&client_type=40&type=2&_dataClientType=3`;
      axios.post(url).then(res => {
        this.navs = res.data.body.data.secondLabel
      });
    },
    // 热门搜索数据
    getSearch() {
      let url = `/v2/template/getRecommendKeyword.do?_dataType=json&client_type=40&from=1&_dataClientType=3`
      axios.post(url).then(res => {
        this.searchList = res.data.body.data;
      })
    },
    getPicTemplate(isDown) {
      let url = `/v2/template/wxSmallAppSearch.do?_dataType=json&client_type=40&pageNo=${this.pageNo}&pageSize=20&kw=${this.keyword}&second_kind_id=${this.kindId}&time_order=${this.sort}&use_times_order=0&collection_times_order=0&business_type=1,2,3&_dataClientType=3`;
      this.isLoading = true;
      axios.post(url).then(res => {
        if (isDown) {
          if (res.data.body.templates.length == 0) this.isMore = false;
          this.picTemplates = [...this.picTemplates, ...res.data.body.templates];
          this.templatesTotalCount = res.data.body.totalCount;
        }
        else {
          this.picTemplates = res.data.body.templates;
          this.templatesTotalCount = res.data.body.totalCount;
        }
      }).catch(err => {

      }).finally(() => {
        this.isLoading = false;
      })
    },
    changeKeyword(kw) {
      this.keyword = kw;
      this.pageNo = 1;
      this.order = 0;
      this.isLoading = false;
      this.isMore = true;
      this.getPicTemplate(false)
    },
    changeKindId(kindId) {
      this.kindId = kindId;
      this.pageNo = 1;
      this.sort = 0;
      this.isLoading = false;
      this.isMore = true;
      this.getPicTemplate(false)
    },
    changeSort(sort) {
      this.sort = sort;
      this.pageNo = 1;
      this.isLoading = false;
      this.isMore = true;
      this.getPicTemplate(false)
    },
    handler() {
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight;
      this.scrollTop = scrollTop;

      if (this.isLoading) return;
      if (!this.isMore) return;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.pageNo = this.pageNo + 1;
        this.getPicTemplate(true);
      }
    },

  }
}
</script>

<style scoped lang="scss">
.searchTop {
  padding: .21333rem .512rem;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;

  .searchIcon {
    position: absolute;
    top: .59733rem;
    left: 1.10933rem;
    z-index: 99;
    width: .68267rem;
    height: .68267rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .searchInput {
    width: 11.65467rem;
    height: 1.45067rem;
    padding-left: 1.62133rem;
    border-radius: .72533rem;
    background-color: #f8f8fb;
    font-size: .55467rem;
    color: #777;
    line-height: 1;
    border: none;
    outline: none;
  }

  .cancel {
    margin-left: .512rem;
    font-size: .512rem;
    line-height: 1.45067rem;
  }


}

.scrollbar {
  width: 100%;
  position: relative;

  .scene-scroll {
    overflow-x: scroll;
    white-space: nowrap;
    padding-left: .597rem;
    padding-right: .597rem;
    border-bottom: .021rem solid #eee;

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

  .sortWrap {
    height: 2.432rem;
    padding: 0 .426rem;
    line-height: 2.432rem;
    display: flex;
    justify-content: space-between;

    span {
      font-size: .725rem;
      color: #000;
    }

    .sortWrapRight {
      color: rgba(0, 0, 0, .6);
      font-size: .512rem;

      &.active {
        color: rgba(0, 0, 0, .8);
      }

      span {
        font-size: .512rem;
      }
    }
  }

  .search-results {
    padding: 0 .42667rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    a {
      display: block;
      width: 8.274rem;
      border: .021rem solid #ccc;
      border-radius: .213rem;
      background-color: #f3f4f7;
      margin-bottom: 0.426rem;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .no-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;

    img {
      width: 100px;
      height: 100px;
    }

    div {
      color: #666;
    }
  }

  .loading {
    font-size: .64rem;
    text-align: center;
  }
}


.hotSearch {
  padding: .81067rem .512rem 0;

  p {
    font-size: .59733rem;
    margin-bottom: .64rem;
    color: #000;
  }

  .hotSearchList {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;

    span {
      display: block;
      font-size: .512rem;
      padding: 0 .55467rem;
      margin-right: .512rem;
      margin-bottom: .512rem;
      border-radius: .64rem;
      background-color: #f3f4f9;
      color: rgba(0, 0, 0, .6);
      line-height: 1.28rem;
    }
  }
}
</style>
