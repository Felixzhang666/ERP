import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; //full import element plus
import "./assets/style/index.css";

import App from "./App.vue";
import router from "./router/index";

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
 
import store from "./store"; 
import storage from "./utils/storage";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
 
const app = createApp(App);
// v - permission
app.directive("permission", {
  mounted(el, binding){
 // button has permission
    const marks = storage.getItem("marks");
    if(marks.indexOf(binding.value) === -1){
       el.disabled = true;
       el.style.cursor = "not-allowed";
    }
  }
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
//app.use(ElementPlus);

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(store);
app.use(router);

app.mount("body");

