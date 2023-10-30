jest.mock('@financial-times/o-tracking', () => {
	return {
		init: jest.fn(),
		page: jest.fn(),
		click: { init: jest.fn() }
	};
}, { virtual: true });
jest.mock('@financial-times/o-viewport', () => ({ getOrientation: jest.fn() }), { virtual: true });
jest.mock('@financial-times/o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });
jest.mock('../utils/getConsentData', () => jest.fn());

import oTracking from '@financial-times/o-tracking';
import oViewport from '@financial-times/o-viewport';
import oGrid from '@financial-times/o-grid';
import getConsentData from '../utils/getConsentData';
import { init, SPOOR_API_INGEST_URL } from '..';

const appContext = {
	product: 'next',
	appName: 'article-page',
	contentId: 123,
	contentType: 'article',
	edition: 'uk',
	abTestState: 'generatedAudioPlayer:variant,subscriberCohort:on'
};

describe('src/index', () => {
	beforeAll(() => {
		getConsentData.mockResolvedValue({});
		window.console.warn = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
		// Clean global instance left on the window after each init() call
		delete window.oTracking;
	});

	describe('.init()', () => {
		it('initialises o-tracking', () => {
			init({ appContext });

			expect(oTracking.init).toHaveBeenCalledTimes(1);

			expect(oTracking.init).toHaveBeenCalledWith(
				expect.objectContaining({
					server: SPOOR_API_INGEST_URL,
					useSendBeacon: true
				})
			);
		});

		it('attaches the o-tracking instance to the window', () => {
			const oTrackingInstance = init({ appContext });
			expect(window.oTracking).toBe(oTrackingInstance);
		});

		it('warns the user in case an instance of o-tracking is already attached to the window without overriding the value', () => {
			window.oTracking = 'initialValue';
			const ourInstance = init({ appContext });
			expect(window.console.warn).toHaveBeenCalledWith(
				'An oTracking instance already exists on window, skipping',
				{
					currentInstance: 'initialValue',
					ourInstance,
				}
			);
			expect(window.oTracking).toBe('initialValue');
		});

		it('configures o-tracking with context data', () => {
			init({ appContext });

			expect(oTracking.init).toHaveBeenCalledWith(
				expect.objectContaining({
					context: expect.objectContaining({
						product: 'next',
						app: 'article-page',
						rootContentId: 123,
						rootContentType: 'article',
						active_ammit_flags: {
							generatedAudioPlayer: 'variant',
							subscriberCohort: 'on'
						}
					})
				})
			);
		});

		it('configures o-tracking with user data', () => {
			oGrid.getCurrentLayout.mockReturnValue('medium');
			oViewport.getOrientation.mockReturnValue('landscape');

			init({ appContext });

			expect(oTracking.init).toHaveBeenCalledWith(
				expect.objectContaining({
					user: expect.objectContaining({
						layout: 'medium',
						orientation: 'landscape'
					})
				})
			);
		});

		it('triggers a page view with page view context and consents', async () => {
			getConsentData.mockResolvedValue({ some: 'consentData' });

			init({ appContext, pageViewContext: { foo: 'bar' } });

			// We don't await the promise returned while getting consent data.
			// The line below lets us wait for the mocked getConsentData promise to resolve.
			await new Promise(process.nextTick);

			expect(oTracking.page).toHaveBeenCalledTimes(1);
			expect(oTracking.page).toHaveBeenCalledWith(
				expect.objectContaining({
					foo: 'bar',
					consents: {
						some: 'consentData'
					},
				})
			);
		});

		it('Does not pass consents down if getting consents fails', async () => {
			getConsentData.mockRejectedValueOnce(new Error('no consent data'));
			init({ appContext, pageViewContext: { foo: 'bar' } });
			await new Promise(process.nextTick);

			expect(oTracking.page).toHaveBeenCalledTimes(1);
			expect(oTracking.page).toHaveBeenCalledWith(
				expect.objectContaining({
					foo: 'bar',
				})
			);
		});

		it('initialises click tracking', () => {
			init({ appContext });

			expect(oTracking.click.init).toHaveBeenCalledTimes(1);

			expect(oTracking.click.init).toHaveBeenCalledWith('cta');
		});
	});

	// describe('.tracking');

	// describe('.broadcast()');
});
