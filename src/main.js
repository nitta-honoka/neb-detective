import Vue from 'vue';
import App from './App.vue';
// import router from './router';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'nasa.js/dist/nasa.js'
import Toasted from 'vue-toasted'

Vue.config.productionTip = false;
Vue.use(MuseUI);
Vue.use(Toasted, {
  position: 'top-center',
  duration: 3000
})

Nasa.contract.set({
  default: {
    testnet: 'n1w1RLvQUchyN3w71BJaPCM7rY8bGqF7C5x'
  }
})
Nasa.env.set('testnet')

new Vue({
  // router,
  render: h => h(App),
}).$mount('#app');
