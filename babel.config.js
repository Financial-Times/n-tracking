module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					node: 14,
				},
			},
		],
	],
	plugins: ["@babel/plugin-transform-react-jsx"],
};
