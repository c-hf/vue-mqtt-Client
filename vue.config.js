module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	outputDir: process.env.outputDir,
	configureWebpack: {
		externals: {
			vue: 'Vue',
			'vue-router': 'VueRouter',
			vuex: 'Vuex',
			'element-ui': 'ELEMENT',
		},
	},
};
