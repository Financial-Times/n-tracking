/* global jsdom */

// SEE: https://github.com/jsdom/jsdom#reconfiguring-the-jsdom-with-reconfiguresettings
// SEE: https://github.com/facebook/jest/issues/5124
export function withReconfiguredWindowSettings ({ settings, assertion }) {
	const backupSettings = {
		windowTop: window.location.top,
		url: window.location.href
	};

	jsdom.reconfigure(settings);
	assertion();
	jsdom.reconfigure(backupSettings);
}

export function withDocumentInnerHTML ({ innerHTML, assertion }) {
	document.body.innerHTML = innerHTML;
	assertion();
	document.body.innerHTML = '';
}
