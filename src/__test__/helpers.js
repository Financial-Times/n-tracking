/* global jsdom */

import $jsdom from 'jsdom';

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

export function withHTML ({ html, assertion }) {
	const documentBackup = document;

	Object.defineProperty(global, 'document', {
		value: new $jsdom.JSDOM(html).window.document,
		writable: true
	});

	assertion();

	global.document = documentBackup;
}

// TODO: Rename `withDocumentInnerHTML` to something more appropriate
// TODO: Decide if you still want to use `jest.jsdom.js` as opposed to using depending on / importing jsdom directly
