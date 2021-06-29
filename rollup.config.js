import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

// All other dependencies should be treated as externals and provided by the consuming service
const external = [
	...Object.keys(pkg.dependencies),
	...Object.keys(pkg.peerDependencies)
];

const plugins = [resolve(), commonjs()];

export default [
	{
		input: 'src/client/index.js',
		external,
		plugins,
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
			...plugins,
			babel({
				exclude: ['node_modules/**']
			})
		]
	}
];
