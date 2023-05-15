<template>
  <div class="temp-details">

    <div class="temp-con" v-for="t, i in themeExtends" :key="i">
      <p class="temp-title">{{ t.title }}</p>
      <div class="temp-list" v-if="!isLoading || t.templates.length > 0">
        <router-link :to="`/themeDetails?t=${th.designTemplateId}`" v-for="th in t.templates" :key="th.designTemplateId">
          <img :src="th.designTemplateImageUrl" alt="">
        </router-link>
      </div>
      <div class="loading" v-if="isLoading">正在加载中</div>
      <div class="btnBox" v-else>
        <div class="temp-btn" @click="getMore(t.id,t.pageNum)">查看更多</div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      themeExtends: [],
      isLoading: false,
    }
  },
  mounted() {
    console.log(this.$route.query);
    this.getTempMessage(this.$route.query.themeId)
  },
  methods: {
    getTempMessage(themeId) {
      let url = `/v2/solutionSubject/themeDetail.do?_dataType=json&_dataClientType=3&client_type=40&themeId=${themeId}&templatePageSize=6`;
      axios.get(url).then(res => {
        console.log(res.data.body.data.theme.themeExtends);
        var data = res.data.body.data.theme.themeExtends;
        for (let i = 0; i < data.length; i++) {
          data[i].pageNum = 1;
        }
        this.themeExtends = data;
      })
    },
    getMore(id, pageNum) {
      let url = `/v2/solutionSubject/themeExtend/template.do?_dataType=json&_dataClientType=3&client_type=40&themeExtendId=${id}&pageSize=6&pageNum=${pageNum + 1}`
      this.isLoading = true;
      axios.get(url).then(res => {
        var data = res.data.body.data.templates;

        var arr = this.themeExtends;
        var index = arr.findIndex(t => t.id == id);
        var oldTemps = arr[index].templates;
        arr[index].templates = [...oldTemps,...data];
        arr[index].pageNum = pageNum + 1;

        this.themeExtends = arr;
      }).finally(()=>{
        this.isLoading = false;
      })
    }
  }
}
</script>

<style scoped lang="scss">
.temp-con {
  .temp-title {
    margin-top: .512rem;
    font-size: .682rem;
    color: #000;
    line-height: .682rem;
    margin-bottom: 1.024rem;
    text-align: center;
  }

  .loading {
    font-size: .64rem;
    text-align: center;
  }

  .temp-list {
    padding: .512rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    a {
      width: 5.3rem;

      img {
        width: 100%;
      }
    }
  }

  .btnBox {
    display: flex;
    justify-content: center;
    align-items: center;

    .temp-btn {
      width: 6.4rem;
      height: 1.706rem;
      background-color: #f9fafd;
      border-radius: .554rem;
      font-size: .554rem;
      line-height: 1.706rem;
      text-align: center;
      margin-bottom: 1.365rem;
      margin-top: .426rem;
    }
  }

}
</style>




