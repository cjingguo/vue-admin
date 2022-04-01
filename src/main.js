import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; /*引入*/
Vue.use(ElementUI); /*注入*/

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
