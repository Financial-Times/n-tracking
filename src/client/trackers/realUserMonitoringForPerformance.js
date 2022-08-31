import {onCLS, onFCP, onFID, onLCP, onTTFB} from 'web-vitals';
import readyState from 'ready-state';
import { broadcast } from '../broadcast';
import { seedIsInSample } from '../utils/seedIsInSample';
import { getSpoorId } from '../utils/getSpoorId';

// @see "Important metrics to measure" https://web.dev/metrics
const requiredMetrics = [
	'domInteractive',
	'domComplete',
	'timeToFirstByte',
	'largestContentfulPaint',
	'firstInputDelay',
	'cumulativeLayoutShift',
	'firstContentfulPaint'
];

const defaultSampleRate = 10;

const isContextComplete = (context) => {
	return requiredMetrics.every((metric) => typeof context[metric] === 'number');
};

export const realUserMonitoringForPerformance = ({ sampleRate } = {}) => {

	// Check browser support.
	// @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
	if (!'PerformanceLongTaskTiming' in window) return;

	const spoorId = getSpoorId();

	sampleRate = Number.isFinite(sampleRate) && sampleRate <= 100 && sampleRate >= 0 ? sampleRate : defaultSampleRate;

	// Gather metrics for only a cohort of users.
	if (!seedIsInSample(spoorId, sampleRate)) return;

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
	 * recordMetric()
	 *
	 * This function is called every time one of the performance events occurs.
	 * The "final" event should be `firstInputDelay`, which is triggered by any "input" event (most likely to be a click.)
	 * Once all the metrics are present, it fires a broadcast() to the Spoor API.
	 */
	let hasAlreadyBroadcast = false;

	const recordMetric = ((metric) => {
		if (hasAlreadyBroadcast) return;

		// @see https://github.com/GoogleChrome/web-vitals#metric
		// for available properties of `metric`
		const metricName = metric.name.toLowerCase();
		const data = metric.value;

		if (metricName === 'fid') {
			context.firstInputDelay = Math.round(data);
		} else if (metricName === 'lcp') {
			//This fires twice, we are collecting the 'first firing' - see PR notes for more context https://github.com/Financial-Times/n-tracking/pull/86
			context.largestContentfulPaint = Math.round(data);
		} else if (metricName === 'ttfb') {
			context.timeToFirstByte = Math.round(data);
		} else if (metricName === 'fcp'){
			context.firstContentfulPaint = Math.round(data);
		} else if (metricName === 'cls') {
			context.cumulativeLayoutShift = data;
		}

		context.url = window.document.location.href || null;

		if (isContextComplete(context)) {
			console.log({ performanceMetrics: context }); // eslint-disable-line no-console

			broadcast('oTracking.event', {
				action: 'performance',
				category: 'page',
				...context
			});

			hasAlreadyBroadcast = true;
		}
	});

	onCLS(recordMetric);
	onFCP(recordMetric);
	onFID(recordMetric);
	onLCP(recordMetric);
	onTTFB(recordMetric);
};
