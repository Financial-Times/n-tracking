
// Mock the ready-state module
jest.mock('ready-state', () => ({
	complete: {
		// We want ready-state to complete immediately
		then: (fn) => fn()
	}
}));

// Mock the utility to check whether the seed is in the sample
jest.mock('../../utils/seedIsInSample', () => ({
	seedIsInSample: jest.fn().mockReturnValue(true)
}));
import {seedIsInSample} from '../../utils/seedIsInSample';

// Mock the utility to get a spoor ID from the cookie
jest.mock('../../utils/getSpoorId', () => ({
	getSpoorId: jest.fn().mockReturnValue('mock-spoor-id')
}));

// Mock the broadcast method which fires an o-tracking event
jest.mock('../../broadcast', () => ({
	broadcast: jest.fn()
}));
import {broadcast} from '../../broadcast';

// Mock Perfume
jest.mock('perfume.js', () => {
	return jest.fn();
});
import Perfume from 'perfume.js';

// Mock global performance metrics
Performance.prototype.getEntriesByType = jest.fn().mockReturnValue([
	{
		type: 'navigate',
		domComplete: 123.45,
		domInteractive: 678.90
	}
]);

// Mock requestIdleCallback so we can capture metrics
// sent by Perfume
window.requestIdleCallback = jest.fn();

import {realUserMonitoringForPerformance} from '../realUserMonitoringForPerformance';

describe('src/client/trackers/realUserMonitoringForPerformance', () => {

	describe('.realUserMonitoringForPerformance()', () => {

		beforeEach(() => {
			realUserMonitoringForPerformance();
		});

		it('creates a Perfume instance with a custom analytics tracker', () => {
			expect(Perfume).toHaveBeenCalledTimes(1);
			const perfumeOptions = Perfume.mock.calls[0][0];
			expect(typeof perfumeOptions).toBe('object');
			expect(typeof perfumeOptions.analyticsTracker).toBe('function');
		});

		describe('analyticsTracker(options)', () => {
			let analyticsTracker;
			let oldConsole;

			beforeEach(() => {
				// We mock the console here so that our library's console.logs don't
				// make it hard to read the test output
				oldConsole = global.console;
				global.console = {log: jest.fn()};
				analyticsTracker = Perfume.mock.calls[0][0].analyticsTracker;
			});

			afterEach(() => {
				global.console = oldConsole;
			});

			describe('when only one metric type is sent', () => {
				beforeEach(() => {
					analyticsTracker({ metricName: 'fid', data: 13.7 });
				});

				it('does not broadcast an o-tracking event', () => {
					expect(broadcast).toHaveBeenCalledTimes(0);
				});
			});

			describe('when all metrics are sent', () => {
				beforeEach(() => {
					analyticsTracker({ metricName: 'fid', data: 13.7 });
					analyticsTracker({ metricName: 'lcp', data: 13.7 });
					analyticsTracker({ metricName: 'ttfb', data: 13.7 });
					analyticsTracker({ metricName: 'fp', data: 13.7 });
					analyticsTracker({ metricName: 'fcp', data: 13.7 });
					analyticsTracker({ metricName: 'cls', data: 13.7 });
					analyticsTracker({ metricName: 'tbt', data: 13.7 });
				});

				it('broadcasts an o-tracking event with the formatted metrics data', () => {
					expect(broadcast).toHaveBeenCalledTimes(1);
					const broadcastArguments = broadcast.mock.calls[0];
					expect(broadcastArguments[0]).toBe('oTracking.event');
					expect(broadcastArguments[1]).toMatchSnapshot();
				});

				describe('when any one of the metrics are sent a second time', () => {
					beforeEach(() => {
						analyticsTracker({ metricName: 'fid', data: 13.7 });
					});

					it('does not broadcast a second o-tracking event', () => {
						expect(broadcast).toHaveBeenCalledTimes(1);
					});
				});
			});

		});

		describe('when the seed is not in the sample', () => {

			beforeEach(() => {
				Perfume.mockReset();
				seedIsInSample.mockReturnValue(false);
				realUserMonitoringForPerformance();
			});

			it('does not create a Perfume instance', () => {
				expect(Perfume).toHaveBeenCalledTimes(0);
			});

		});

		describe('when no "navigation" performance entries are available', () => {

			beforeEach(() => {
				Perfume.mockReset();
				Performance.prototype.getEntriesByType.mockReturnValue([]);
				realUserMonitoringForPerformance();
			});

			it('does not create a Perfume instance', () => {
				expect(Perfume).toHaveBeenCalledTimes(0);
			});

		});

	});
});
