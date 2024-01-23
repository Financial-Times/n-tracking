const { Task } = require('@dotcom-tool-kit/types');
const rollup = require('rollup');
const loadConfigFile = require('rollup/dist/loadConfigFile');
const path = require('path');

class Rollup extends Task {
	async run () {
		const config = path.join(process.cwd(), 'rollup.config.js');
		const { options, warnings } = await loadConfigFile(config);

		// print any config warnings to the console
		warnings.flush();

		for (const optionsEntry of options) {
			const bundle = await rollup.rollup(optionsEntry);
			await Promise.all(optionsEntry.output.map(bundle.write));
		}
	}
}

exports.tasks = [Rollup];
