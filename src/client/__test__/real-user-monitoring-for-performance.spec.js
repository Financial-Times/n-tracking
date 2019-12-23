
import nock from 'nock'
import { realUserMonitoringForPerformance } from '../../client/trackers/real-user-monitoring-for-performance'

const entries = [
	{ name: 'first-paint', startTime: 1 },
	{ name: 'first-contentful-paint', startTime: 1 },
];
const PerformanceObserver = class {
	constructor(cb) {
		this.observe = (options) => {
			cb({ getEntries: () => entries })
			return {}
		}
	}
}

// Don't let o-tracking make actual network requests
nock.disableNetConnect()

describe('src/client/real-user-monitoring-for-performance.js', () => {
	window.PerformanceLongTaskTiming = true
	window.ttiPolyfill = {
		getFirstConsistentlyInteractive: () => 123
	}
	window.PerformanceObserver = PerformanceObserver

	afterEach(() => {
		jest.clearAllMocks()
		nock.cleanAll()
	})
	it('correctly decides not to track if the user does not have a spoor-id', async () => {
		document.cookie = 'this-user-has-no-spoorid'
		await realUserMonitoringForPerformance()
		// Expect tracking not to be called.
	})

	it('correctly decides not to track if the user is not in the right cohort', async () => {
		document.cookie = 'spoor-id=12303'
		await realUserMonitoringForPerformance()
		// Expect tracking not to be called.
	})

	it('tracks performance if the user is in the right cohort', async () => {
		document.cookie = 'spoor-id=12302'
		await realUserMonitoringForPerformance()
		// Expect tracking to be called.
	})

})
