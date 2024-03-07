import { onLCP, onFID, onCLS } from 'web-vitals/attribution';
import { broadcast } from '../broadcast';
import { seedIsInSample } from '../utils/seedIsInSample';
import { getSpoorId } from '../utils/getSpoorId';

// 1% of users
const defaultSampleRate = 1;

const dataFromCWV = (metric) => {
	if (metric.name === 'LCP') {
		return {
			name: metric.name,
			lcp: metric.value,
			lcpDelta: metric.delta,
			element: metric.attribution.largestShiftTarget
		};
	}
	if (metric.name === 'FID') {
		return {
			name: metric.name,
			fid: metric.value,
			fidDelta: metric.delta,
			element: metric.attribution.eventTarget
		};
	}
	if (metric.name === 'CLS') {
		return {
			name: metric.name,
			cls: metric.value,
			clsDelta: metric.delta,
			element: metric.attribution.largestShiftTarget
		};
	}
};

export const realUserMonitoringWithAttribution = ({ sampleRate } = {}) => {
	const broadcastCWV = (data) => {
		  broadcast('oTracking.event', {
			action: 'performance-attribution',
			category: 'page',
			...dataFromCWV(data),
		});
	};

	// Check browser support.
	// @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
	if (!'PerformanceLongTaskTiming' in window) return;

	const spoorId = getSpoorId();
	const proportionToSample = sampleRate || defaultSampleRate;

	// Gather metrics for only a cohort of users.
	if (!seedIsInSample(spoorId, proportionToSample)) return;

	// Proceed only if the page load event is a "navigate".
	// @see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
	// When testing, you will need to open a new browser window and paste the URL in i.e. simply reloading the page will not work.
	const navigation = performance.getEntriesByType('navigation') && performance.getEntriesByType('navigation')[0];
	if (!navigation || navigation.type !== 'navigate') return;

	onCLS(broadcastCWV, { reportAllChanges: true });
	onFID(broadcastCWV);
	onLCP(broadcastCWV);
};
