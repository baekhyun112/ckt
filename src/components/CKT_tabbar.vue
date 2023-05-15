<template>
    <div class="footer" v-if="['home', 'design', 'mine'].includes($route.name)">
        <div class="box">
            <div class="item" v-for="tab, i in tabbar" :key="i">
                <router-link :to="tab.path">
                    <img :src="$route.path == tab.path ? tab.srcActive : tab.src" alt="">
                    <p>{{ tab.title }}</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import HomeSrc from '@/assets/home.png'

export default {
    data() {
        return {
            tabbar: [
                {
                    path: "/",
                    src: HomeSrc,
                    srcActive: require("../assets/home-active.png"),
                    title: "首页"
                },
                {
                    path: "/design",
                    src: require("../assets/design.png"),
                    srcActive: require("../assets/design-active.png"),
                    title: "我的设计"
                },
                {
                    path: "/mine",
                    src: require("../assets/mine.png"),
                    srcActive: require("../assets/mine-active.png"),
                    title: "个人中心"
                }
            ]
        }
    }
}
</script>

<style scoped lang="scss">
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 9999;

    .box {
        display: flex;
        justify-content: space-between;
        height: 50px;
        border-top: 1px solid #ccc;

        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;

            a {
                text-align: center;
                padding: 5px 0 0;
                img {
                    display: block;
                    width: 27px;
                    height: 27px;
                    margin: auto;
                }
                p{
                    color: rgb(153, 153, 153);
                    font-size: 10px;
                    line-height: 1.8;
                    
                }
            }
        }
    }


}
</style>

