// As per https://github.com/facebook/jest/issues/5124
// As per https://github.com/jsdom/jsdom#reconfiguring-the-jsdom-with-reconfiguresettings

const JSDOMEnvironment = require('jest-environment-jsdom');

module.exports = class CustomizedJSDomEnvironment extends JSDOMEnvironment {
	constructor (config) {
		super(config);
		this.global.jsdom = this.dom;
	}

	teardown () {
		this.global.jsdom = null;
		return super.teardown();
	}
};
