import Perfume from 'perfume.js';
import readyState from 'ready-state';
import { broadcast } from '../broadcast';
import { seedIsInSample } from '../utils/seedIsInSample';
import { getSpoorId } from '../utils/getSpoorId';

// @see "Important metrics to measure" https://web.dev/metrics
const requiredMetrics = [
	'domInteractive',
	'domComplete',
	'timeToFirstByte',
	'firstPaint',
	'largestContentfulPaint',
	'firstInputDelay',
	'cumulativeLayoutShift'
];

const samplePercentage = 5;

const isContextComplete = (context) => {
	return requiredMetrics.every((metric) => typeof context[metric] === 'number');
};

export const realUserMonitoringForPerformance = () => {

	// Check browser support.
	// @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
	if (!'PerformanceLongTaskTiming' in window) return;

	const spoorId = getSpoorId();

	// Gather metrics for only a cohort of users.
	if (!seedIsInSample(spoorId, samplePercentage)) return;

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	// When testing, you will need to open a new browser window and paste the URL in i.e. simply reloading the page will not work.
	const navigation = performance.getEntriesByType('navigation') && performance.getEntriesByType('navigation')[0];
	if (!navigation || navigation.type !== 'navigate') return;

	const context = {};

	readyState.complete.then(() => {
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domInteractive>
		context.domInteractive = Math.round(navigation.domInteractive);
		// <https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/domComplete>
		context.domComplete = Math.round(navigation.domComplete);
	});

	/**
	 * analyticsTracker()
	 *
	 * This function is called every time one of the performance events occurs.
	 * The "final" event should be `firstInputDelay`, which is triggered by any "input" event (most likely to be a click.)
	 * Once all the metrics are present, it fires a broadcast() to the Spoor API.
	 */
	let hasAlreadyBroadcast = false;

	const analyticsTracker = (({ metricName, data}) => {
		if (hasAlreadyBroadcast) return;

		if (metricName === 'fid') {
			context.firstInputDelay = Math.round(data);
		} else if (metricName === 'lcp') {
			//This fires twice, we are collecting the 'first firing' - see PR notes for more context https://github.com/Financial-Times/n-tracking/pull/86
			context.largestContentfulPaint = Math.round(data);
		} else if (metricName === 'ttfb') {
			context.timeToFirstByte = Math.round(data);
		} else if (metricName === 'fp') {
			context.firstPaint = Math.round(data);
		} else if (metricName === 'cls') {
			context.cumulativeLayoutShift = data;
		}

		if (isContextComplete(context)) {
			console.log({ performanceMetrics: context }); // eslint-disable-line no-console

			broadcast('oTracking.event', {
				action: 'performance',
				category: 'page',
				context
			});

			hasAlreadyBroadcast = true;
		}
	});

	new Perfume({
		analyticsTracker,
		logging: false
	});
};
