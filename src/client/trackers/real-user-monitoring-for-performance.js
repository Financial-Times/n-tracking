import ttiPolyfill from 'tti-polyfill';
import { broadcast } from '../broadcast';
import { userIsInCohort } from '../utils/userIsInCohort';

export const realUserMonitoringForPerformance = () => {
	const cohortPercent = 5;
	if (!userIsInCohort(cohortPercent)) return;

	// For browser compatibility @see: https://mdn.github.io/dom-examples/performance-apis/perf-api-support.html
	if (!'PerformanceLongTaskTiming' in window || !'ttiPolyfill' in window) return;

	// @see: https://web.dev/lcp/#how-to-measure-lcp (largest-contentful-paint)
	let largestContentfulPaint;
	const lcpPerformanceObserver = new PerformanceObserver((entryList) => {
		const entries = entryList.getEntries();
		const lastEntry = entries[entries.length - 1];
		largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
	});
	lcpPerformanceObserver.observe({type: 'largest-contentful-paint', buffered: true});

	ttiPolyfill.getFirstConsistentlyInteractive().then(timeToInteractive => {

		// Disconnect the observer once it no longer needs to observe the performance data
		// @SEE: https://w3c.github.io/performance-timeline/#the-performanceobserver-interface
		lcpPerformanceObserver.disconnect();

		const navigation = performance.getEntriesByType('navigation')[0];
		const { type, domInteractive, domComplete, responseStart, requestStart } = navigation;

		// Proceed only if the page load event is a "navigate".
		// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
		if (type !== 'navigate') return;

		try {
			const timeToFirstByte = responseStart - requestStart;
			const firstPaint = performance.getEntriesByName('first-paint')[0].startTime;
			const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0].startTime;
			const context = {
				firstPaint: Math.round(firstPaint),
				firstContentfulPaint: Math.round(firstContentfulPaint),
				timeToFirstByte: Math.round(timeToFirstByte),
				domInteractive: Math.round(domInteractive),
				domComplete: Math.round(domComplete),
				largestContentfulPaint: Math.round(largestContentfulPaint),
				timeToInteractive: Math.round(timeToInteractive),
			};

			console.log(context); // eslint-disable-line no-console
			const data = {
				action: 'performance',
				category: 'page',
				...context
			};
			broadcast('oTracking.event', data);
		}
		catch (error) {
			console.error(error); // eslint-disable-line no-console
		}
	});
};