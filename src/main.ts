import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

//axios -> see https://javatodev.com/vue-js-crud-with-vuetify/
import axios from 'axios';
import VueAxios from 'vue-axios';

//rest api base url
axios.defaults.baseURL = 'http://localhost:8080/api';

//axios
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
