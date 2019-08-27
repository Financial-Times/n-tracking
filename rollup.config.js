import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const external = [
	...Object.keys(pkg.dependencies),
	...Object.keys(pkg.peerDependencies)
];

export default [
	{
		input: 'src/index.js',
		external,
		output: {
			file: pkg.browser,
			format: 'es'
		}
	},
	{
		input: 'src/server/index.js',
		external,
		output: {
			file: pkg.main,
			format: 'cjs'
		},
		plugins: [
			babel({
				exclude: ['node_modules/**']
			})
		]
	}
];
