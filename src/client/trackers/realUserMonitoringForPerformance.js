import Perfume from 'perfume.js';
import { broadcast } from '../broadcast';
import { seedIsInSample } from '../utils/seedIsInSample';
import { getSpoorId } from '../utils/getSpoorId';
import { documentReady } from './real-user-performance/documentReady';

// @see "Important metrics to measure" https://web.dev/metrics
const requiredMetrics = [
	'domInteractive',
	'domComplete',
	'timeToFirstByte',
	'firstPaint',
	'largestContentfulPaint',
	'firstInputDelay'
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

	const navigation = performance.getEntriesByType('navigation')[0];

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	if (navigation.type !== 'navigate') return;

	const context = {};

	documentReady().then(() => {
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

	const analyticsTracker = (({ metricName, duration, data }) => {
		if (hasAlreadyBroadcast) return;

		if (duration) {
			// Metrics with "duration":
			// firstPaint, firstContentfulPaint, firstInputDelay and largestContentfulPaint
			context[metricName] = Math.round(duration);
		}

		// Metrics with "data":
		// navigationTiming, networkInformation
		if (metricName === 'navigationTiming') {
			context.timeToFirstByte = Math.round(data.timeToFirstByte);
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
		logging: false,
		largestContentfulPaint: true
	});
};
