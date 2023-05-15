<template>
  <div class="theme-details">
    <div class="imgWrap">
      <div class="taro-img">
        <img :src="templates.designTemplateImageUrl" alt="">
      </div>
    </div>

    <div class="details-text">
      <p class="text-title">{{ templates.templateTitle }}</p>
      <p class="text-center">{{ templates.kindTitle }}</p>
      <p class="text-paragraph">图片编号为{{ templates.designTemplateId }}，该{{ templates.kindTitle }}的尺寸是{{ templates.width }}
        * {{ templates.height }}。点击“立即使用”，《{{ templates.templateTitle }}》一键生成，在线编辑图片，简单拖拉拽，秒出精美{{ templates.kindTitle }}</p>
    </div>

    <div class="keyword">
      <router-link :to="`/search?keyword=${k}`" v-for="k, i in keyword" :key="i">{{ k }}</router-link>
    </div>

    <div class="recommendWrap">
      <h2>为你推荐</h2>
      <div class="templatesWrap">
        <router-link :to="`/themeDetails?t=${r.designTemplateId}`" v-for="r, i in recommend" :key="i">
          <img :src="r.designTemplateImageUrl" alt="">
        </router-link>
      </div>
    </div>

    <div class="botBtn">
      <div class="botImg" @click="Login">
        <img src="../assets/下载.png" alt="">
      </div>
      <div class="editBtn">立即编辑</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      templateId:0,
      templates: [],
      keyword: [],
      recommend: [],
    }
  },
  beforeRouteEnter(to,from,next){
    if(to.query.t){
      next((vm)=>{
        vm.templateId = to.query.t;
        vm.getMessage();
      })
    }else{
      next('/');
    }
  },
  beforeRouteUpdate(to,from,next){
    if(to.query.t){
      this.templateId = to.query.t;
      this.getMessage();
      next()
    }else{
      next('/')
    }
  },

  methods: {
    getMessage() {
      let url = `/ckt/designtemplate/getDetailCacheFileUrl.do?_dataType=json&_dataClientType=3&client_type=40&id=${this.templateId}&business_type=1%2C2%2C3`;
      axios.post(url).then(res => {
        console.log(res.data.body.recommendedTemplates);
        this.templates = res.data.body.currentTemplate;
        this.keyword = res.data.body.currentTemplate.keywords.split(' ');
        this.recommend = res.data.body.recommendedTemplates;
      })
    },
    Login(){
      this.$router.push(`/mine`)
    }
  }
}
</script>

<style scoped lang="scss">
.theme-details {
  padding: 0 .512rem;

  .imgWrap {
    background-color: #e3e6e9;
    border-radius: .426rem;
    padding: .682rem;

    .taro-img {
      width: 100%;
      height: 100%;

      // padding: 0 2rem;
      img {
        display: block;
        width: 237px;
        height: 421px;
        margin: auto;
      }
    }
  }

  .text-title {
    font-size: .768rem;
    color: #000;
    margin-top: .768rem;
    margin-bottom: .512rem;
    font-weight: 900;
    line-height: 1;
  }

  .text-center {
    color: rgba(0, 0, 0, .6);
    line-height: 1;
    font-size: .597rem;
    margin-bottom: .512rem;
  }

  .text-paragraph {
    color: #000;
    line-height: 1.067rem;
    font-size: .597rem;
    margin-bottom: .512rem;
  }

  .keyword {
    font-size: 0;

    a {
      background-color: #f3f4f9;
      border-radius: .672rem;
      padding: 0 .682rem;
      font-size: .512rem;
      color: #000;
      line-height: 1.344rem;
      text-align: center;
      display: inline-block;
      margin-right: .341rem;
      max-width: 5.461rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: .341rem;
    }
  }

  .recommendWrap {
    h2 {
      font-size: .768rem;
      font-weight: 900;
      margin-top: .512rem;
      margin-bottom: .853rem;
    }

    .templatesWrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      a {
        width: 7.95rem;
        height: 12.928rem;
        border-radius: .128rem;
        border: .021rem solid #e6e6e6;
        margin-bottom: .426rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .botBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    padding-left:0.512rem;
    padding-right: .512rem;
    height: 3.05rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .botImg {
      width: 2.026rem;
      height: 2.026rem;
      background-color: #f9fafd;
      border-radius: .213rem;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: .981rem;
        height: .981rem;
      }
    }

    .editBtn{
      width: 13.437rem;
      height: 2.026rem;
      background-color: #0773fc;
      border-radius: .213rem;
      color: #fff;
      text-align: center;
      font-size: .64rem;
      line-height: 2.026rem;
    }
  }
}</style>
