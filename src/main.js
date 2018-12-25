import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

import SvgIcon from '@/components/svgIcon';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/scss/index.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.component('svg-icon', SvgIcon);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
