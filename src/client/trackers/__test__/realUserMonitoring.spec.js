
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

// Mock web-vitals
jest.mock('web-vitals', () => ({
	onCLS: jest.fn(),
	onFCP: jest.fn(),
	onFID: jest.fn(),
	onLCP: jest.fn(),
	onTTFB: jest.fn(),
	onINP: jest.fn(),
}));
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

// Mock global performance metrics
Performance.prototype.getEntriesByType = jest.fn().mockReturnValue([
	{
		type: 'navigate',
		domComplete: 123.45,
		domInteractive: 678.90
	}
]);

import {realUserMonitoringForPerformance} from '../realUserMonitoringForPerformance';

describe('src/client/trackers/realUserMonitoringForPerformance', () => {

	describe('.realUserMonitoringForPerformance()', () => {

		beforeEach(() => {
			realUserMonitoringForPerformance();
		});

		it('listens to metrics with the web-vitals package', () => {
			expect(onCLS).toHaveBeenCalledTimes(1);
			expect(typeof onCLS.mock.calls[0][0]).toBe('function');
			expect(onCLS.mock.calls[0][1]).toEqual({ reportAllChanges: true });
			expect(onFCP).toHaveBeenCalledTimes(1);
			expect(typeof onFCP.mock.calls[0][0]).toBe('function');
			expect(onFID).toHaveBeenCalledTimes(1);
			expect(typeof onFID.mock.calls[0][0]).toBe('function');
			expect(onLCP).toHaveBeenCalledTimes(1);
			expect(typeof onLCP.mock.calls[0][0]).toBe('function');
			expect(onTTFB).toHaveBeenCalledTimes(1);
			expect(typeof onTTFB.mock.calls[0][0]).toBe('function');
			expect(onINP).toHaveBeenCalledTimes(1);
			expect(typeof onINP.mock.calls[0][0]).toBe('function');
		});

		it('uses the same handler for all metrics', () => {
			const clsHandler = onCLS.mock.calls[0][0];
			expect(onFCP.mock.calls[0][0]).toStrictEqual(clsHandler);
			expect(onFID.mock.calls[0][0]).toStrictEqual(clsHandler);
			expect(onLCP.mock.calls[0][0]).toStrictEqual(clsHandler);
			expect(onTTFB.mock.calls[0][0]).toStrictEqual(clsHandler);
			expect(onINP.mock.calls[0][0]).toStrictEqual(clsHandler);
		});

		describe('recordMetric(metric)', () => {
			let recordMetric;
			let oldConsole;

			beforeEach(() => {
				// We mock the console here so that our library's console.logs don't
				// make it hard to read the test output
				oldConsole = global.console;
				global.console = {log: jest.fn()};
				recordMetric = onCLS.mock.calls[0][0];
			});

			afterEach(() => {
				global.console = oldConsole;
			});

			describe('when only one metric type is sent', () => {
				beforeEach(() => {
					recordMetric({ name: 'FID', value: 13.7 });
				});

				it('does not broadcast an o-tracking event', () => {
					expect(broadcast).toHaveBeenCalledTimes(0);
				});
			});

			describe('when all metrics are sent', () => {
				beforeEach(() => {
					recordMetric({ name: 'FID', value: 13.7 });
					recordMetric({ name: 'LCP', value: 13.7 });
					recordMetric({ name: 'TTFB', value: 13.7 });
					recordMetric({ name: 'FCP', value: 13.7 });
					recordMetric({ name: 'CLS', value: 13.76539 });
					recordMetric({ name: 'INP', value: 13.7 });
				});

				it('broadcasts an o-tracking event with the formatted metrics data', () => {
					expect(broadcast).toHaveBeenCalledTimes(1);
					const broadcastArguments = broadcast.mock.calls[0];
					expect(broadcastArguments[0]).toBe('oTracking.event');
					expect(broadcastArguments[1]).toMatchSnapshot();
				});

				it('rounds the CLS metric to four decimal places', () => {
					expect(broadcast).toHaveBeenCalledTimes(1);
					const {cumulativeLayoutShift} = broadcast.mock.calls[0][1];
					expect(cumulativeLayoutShift).toBe(13.7654);
				});

				describe('when any one of the metrics are sent a second time', () => {
					beforeEach(() => {
						recordMetric({ name: 'FID', value: 13.7 });
					});

					it('does not broadcast a second o-tracking event', () => {
						expect(broadcast).toHaveBeenCalledTimes(1);
					});
				});
			});

		});

		describe('when the seed is not in the sample', () => {

			beforeEach(() => {
				onCLS.mockReset();
				onFCP.mockReset();
				onFID.mockReset();
				onLCP.mockReset();
				onTTFB.mockReset();
				onINP.mockReset();
				seedIsInSample.mockReturnValue(false);
				realUserMonitoringForPerformance();
			});

			it('does not listen for performance metrics', () => {
				expect(onCLS).toHaveBeenCalledTimes(0);
				expect(onFCP).toHaveBeenCalledTimes(0);
				expect(onFID).toHaveBeenCalledTimes(0);
				expect(onLCP).toHaveBeenCalledTimes(0);
				expect(onTTFB).toHaveBeenCalledTimes(0);
				expect(onINP).toHaveBeenCalledTimes(0);
			});

		});

		describe('when no "navigation" performance entries are available', () => {

			beforeEach(() => {
				onCLS.mockReset();
				onFCP.mockReset();
				onFID.mockReset();
				onLCP.mockReset();
				onTTFB.mockReset();
				onINP.mockReset();
				Performance.prototype.getEntriesByType.mockReturnValue([]);
				realUserMonitoringForPerformance();
			});

			it('does not listen for performance metrics', () => {
				expect(onCLS).toHaveBeenCalledTimes(0);
				expect(onFCP).toHaveBeenCalledTimes(0);
				expect(onFID).toHaveBeenCalledTimes(0);
				expect(onLCP).toHaveBeenCalledTimes(0);
				expect(onTTFB).toHaveBeenCalledTimes(0);
				expect(onINP).toHaveBeenCalledTimes(0);
			});

		});

	});
});
