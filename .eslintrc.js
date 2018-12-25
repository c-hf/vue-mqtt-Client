module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended'],
	plugins: ['vue', 'prettier'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// 使用单引号
		quotes: ['error', 'single'],
		//总是以 ; 结尾
		semi: ['error', 'always'],
		//new时必须加小括号
		'new-parens': 'error',
		//禁止重复声明变量
		'no-redeclare': 'error',
		//一行结束后面不要有空格
		'no-trailing-spaces': 'warn',
		// //强制驼峰法命名
		// camelcase: 'error',
		//必须使用全等
		eqeqeq: 'error',
		//缩进风格
		indent: ['error', 'tab'],
		//禁用var，用let和const代替
		'no-var': 'error',
		// 不允许空格和 tab 混合缩进
		'no-mixed-spaces-and-tabs': 'error',
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
