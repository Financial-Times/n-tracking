import jsdom from 'jsdom';

export function withDOM ({ html, referrer, url, windowTop, assertion }) {
	const originalHtml = document.documentElement.outerHTML;
	const originalWindow = window;
	const originalDocument = document;
	const dom = new jsdom.JSDOM(html || originalHtml);
	const toReconfigure = {};

	Object.defineProperty(global, 'window', {
		value: dom.window,
		writable: true
	});

	Object.defineProperty(global, 'document', {
		value: dom.window.document,
		writable: true
	});

	if (referrer) {
		Object.defineProperty(window.document, 'referrer', {
			value: referrer,
			writable: true
		});
	}

	if (windowTop) {
		toReconfigure.windowTop = windowTop;
	}

	if (url) {
		toReconfigure.url = url;
	}

	if (toReconfigure.windowTop || toReconfigure.url) {
		// See https://github.com/jsdom/jsdom#reconfiguring-the-jsdom-with-reconfiguresettings
		dom.reconfigure(toReconfigure);
	}

	assertion();

	global.window = originalWindow;
	global.document = originalDocument;
}
