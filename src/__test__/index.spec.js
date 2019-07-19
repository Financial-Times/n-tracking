import oTracking from 'o-tracking';
import oViewport from 'o-viewport';
import oGrid from 'o-grid';
import { init, SPOOR_API_INGEST_URL } from '..';

jest.mock('o-tracking', () => {
	return {
		init: jest.fn(),
		page: jest.fn(),
		click: { init: jest.fn() }
	};
}, { virtual: true });
jest.mock('o-viewport', () => ({ getOrientation: jest.fn() }), { virtual: true });
jest.mock('o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });

const appContext = {
	product: 'next',
	appName: 'article-page',
	contentId: 123,
	contentType: 'article',
	edition: 'uk',
	abTestState: 'generatedAudioPlayer:variant,subscriberCohort:on'
};

describe('src/index', () => {
	afterEach(() => jest.clearAllMocks());

	describe('.init()', () => {
		it('initialises o-tracking', () => {
			init({ appContext });

			expect(oTracking.init).toHaveBeenCalledTimes(1);

			expect(oTracking.init).toHaveBeenCalledWith(
				expect.objectContaining({
					server: SPOOR_API_INGEST_URL,
					useSendBeacon: false
				})
			);
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

		it('triggers a page view with page view context', () => {
			init({ appContext, pageViewContext: { foo: 'bar' } });

			expect(oTracking.page).toHaveBeenCalledTimes(1);

			expect(oTracking.page).toHaveBeenCalledWith(
				expect.objectContaining({
					foo: 'bar'
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
