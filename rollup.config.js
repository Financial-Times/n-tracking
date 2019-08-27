import pkg from './package.json';

const external = [
	...Object.keys(pkg.dependencies)
];

export default [
	{
		input: 'src/index.js',
		external,
		output: {
			file: pkg.browser,
			format: 'es'
		}
	}
];
