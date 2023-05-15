
import CKT_tabbar from '@/components/CKT_tabbar.vue';

let registerCom = {
    install(Vue, options){
        Vue.component("CKT_tabbar", CKT_tabbar);
    }
}

export default registerCom;