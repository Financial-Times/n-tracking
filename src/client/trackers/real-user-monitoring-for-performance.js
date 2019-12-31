import Perfume from 'perfume.js';
import { broadcast } from '../broadcast';
import { userIsInCohort } from '../utils/userIsInCohort';

const cohortPercent = 5;
export const realUserMonitoringForPerformance = () => {
	if (!userIsInCohort(cohortPercent)) return;

	const navigation = performance.getEntriesByType('navigation')[0];
	const { type, domInteractive, domComplete } = navigation;

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	if (type !== 'navigate') return;

	const context = {
		action: 'performance',
		category: 'page',
		domInteractive: Math.round(domInteractive),
		domComplete: Math.round(domComplete),
	};

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
		else if (metricName === 'navigationTiming') {
			context.timeToFirstByte = Math.round(data.timeToFirstByte);
		}

		// Broadcast only if all the metrics are present
		const contextContainsAllRequiredMetrics = [
			'domInteractive', 'domComplete', 'timeToFirstByte', 'firstPaint', 'firstContentfulPaint', 'firstInputDelay'
		].every(metric => !isNaN(context[metric]));

		if (contextContainsAllRequiredMetrics) {
			console.log({performanceMetrics:context}); // eslint-disable-line no-console
			broadcast('oTracking.event', context);
			hasAlreadyBroadcast = true;
		}
	});

	// Perfume.js is a web performance package.
	// @see https://zizzamia.github.io/perfume/#/default-options/
	const options = {
		analyticsTracker,
		logging: false,
		firstPaint: true,
		firstContentfulPaint: true,
		firstInputDelay: true,
		largestContentfulPaint: true,
		navigationTiming: true,
	};
	new Perfume(options);
};
