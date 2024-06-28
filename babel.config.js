module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 18,
				},
			},
		],
	],
	plugins: ['@babel/plugin-transform-react-jsx'],
};
