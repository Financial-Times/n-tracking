
/**
 * Add document ready data
 * @param {PerformanceNavigationTiming} navigation
 * @param {Object} context
 */
export default function addDocumentReadyData (navigation, context) {
	const decorateState = () => {
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domInteractive>
		context.domInteractive = Math.round(navigation.domInteractive);
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domComplete>
		context.domComplete = Math.round(navigation.domComplete);
	};

	const listener = () => {
		if (document.readyState === 'complete') {
			decorateState();
			document.removeEventListener('readystatechange', listener);
		}
	};

	if (document.readyState === 'complete') {
		decorateState();
	} else {
		document.addEventListener('readystatechange', listener);
	}
}
