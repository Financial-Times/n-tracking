import {getLCP, getFID, getCLS} from 'web-vitals';
import readyState from 'ready-state';
import { broadcast } from '../broadcast';
import { seedIsInSample } from '../utils/seedIsInSample';
import { getSpoorId } from '../utils/getSpoorId';

// @see "Important metrics to measure" https://web.dev/metrics
// @see https://github.com/GoogleChrome/web-vitals#batch-multiple-reports-together

const queue = new Set();

const samplePercentage = 100;

export const realUserMonitoringForPerformance = () => {

	// Gather metrics for only a cohort of users.
	const spoorId = getSpoorId();
	if (!seedIsInSample(spoorId, samplePercentage)) return;

	//Add the web-vitals stats we want to the queue ready for the page to be unloaded or hidden
	//at which point we will send them
	function addToQueue (metric) {
		queue.add(metric);
	}
	getCLS(addToQueue);
	getFID(addToQueue);
	getLCP(addToQueue);

	let context = {};

	const navigation = performance.getEntriesByType('navigation')[0];

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	if (navigation.type !== 'navigate') return;

	readyState.complete.then(() => {
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domInteractive>
		context.domInteractive = Math.round(navigation.domInteractive);
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domComplete>
		context.domComplete = Math.round(navigation.domComplete);
	});

	// Report all available metrics whenever the page is backgrounded or unloaded.
	addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			flushQueue();
		}
	});

	// NOTE: Safari does not reliably fire the `visibilitychange` event when the
	// page is being unloaded. If Safari support is needed, you should also flush
	// the queue in the `pagehide` event.
	addEventListener('pagehide', flushQueue);

	function flushQueue () {
		if (queue.size > 0) {

			for (const metric of queue) {
				if(metric.name === 'FID') {
					context.firstInputDelay = Math.round(metric.value);
				} else if (metric.name === 'CLS') {
					//as this can be a very long floating number, am rounding to 4 decimal places
					context.cumulativeLayoutShift = +((metric.value).toFixed(4));
				} else if (metric.name === 'LCP') {
					context.largestContentfulPaint = Math.round(metric.value);
				}
			}

			//at this point, send metrics
			broadcast('oTracking.event', {
				action: 'performance',
				category: 'page',
				context
			});
			queue.clear();
		}
	}

};
