import Vue from 'vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import App from './App.vue';

import SvgIcon from '@/components/svgIcon';
import '@/assets/scss/index.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.component('svg-icon', SvgIcon);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
