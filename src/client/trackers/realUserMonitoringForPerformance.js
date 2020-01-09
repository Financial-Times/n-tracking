import Perfume from 'perfume.js';
import { broadcast } from '../broadcast';
import { userIsInCohort } from '../utils/userIsInCohort';

// Perfume.js is a web performance package.
// @see https://zizzamia.github.io/perfume/#/default-options/
const options = {
	logging: false,
	firstPaint: true,
	largestContentfulPaint: true,
	firstInputDelay: true,
	largestContentfulPaint: true,
	navigationTiming: true,
};

// @see "Important metrics to measure" https://web.dev/metrics
const requiredMetrics = [
	'domInteractive',
	'domComplete',
	'timeToFirstByte',
	'firstPaint',
	'largestContentfulPaint',
	'firstInputDelay'
];

const cohortPercent = 5;

export const realUserMonitoringForPerformance = () => {

	// Check browser support.
	// @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
	if (!'PerformanceLongTaskTiming' in window) return;

	// Gather metrics for only a cohort of users.
	if (!userIsInCohort(cohortPercent)) return;

	const navigation = performance.getEntriesByType('navigation')[0];

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	if (navigation.type !== 'navigate') return;

	const context = {
		domInteractive: Math.round(navigation.domInteractive),
		domComplete: Math.round(navigation.domComplete),
	};

	/**
	 * analyticsTracker()
	 *
	 * This function is called every time one of the performance events occurs.
	 * The "final" event should be `firstInputDelay`, which is triggered by any "input" event (most likely to be a click.)
	 * Once all the metrics are present, it fires a broadcast() to the Spoor API.
	 */
	let hasAlreadyBroadcast = false;

	options.analyticsTracker = (({ metricName, duration, data }) => {
		if (hasAlreadyBroadcast) return;

		if (duration) {
			// Metrics with "duration":
			// firstPaint, firstContentfulPaint, firstInputDelay and largestContentfulPaint
			context[metricName] = Math.round(duration);
		}

		if (metricName === 'navigationTiming') {
			context.timeToFirstByte = Math.round(data.timeToFirstByte);
		}

		// Broadcast only if all the metrics are present
		const contextContainsAllRequiredMetrics = requiredMetrics.every(metric => !isNaN(context[metric]));

		if (contextContainsAllRequiredMetrics) {
			console.log({ performanceMetrics: context }); // eslint-disable-line no-console

			broadcast('oTracking.event', {
				action: 'performance',
				category: 'page',
				context
			});

			hasAlreadyBroadcast = true;
		}
	});

	new Perfume(options);
};
