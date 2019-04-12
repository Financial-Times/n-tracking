/* global jsdom */

import oTracking from 'o-tracking';
import PageViewTracking from '../page-view-tracking';
import { getErrorStatus } from '../../helpers/error';
import { prepareContextErrorInfo } from '../../helpers/context';
import { getRootData } from '../../helpers/dom';

jest.mock('o-tracking', () => ({ page: jest.fn() }), { virtual: true });
jest.mock('../../helpers/dom', () => ({ getRootData: jest.fn() }));
jest.mock('../../helpers/error', () => ({ getErrorStatus: jest.fn() }));
jest.mock('../../helpers/context', () => ({
	prepareContextErrorInfo: jest.fn()
}));

describe('PageViewTracking', () => {
	afterEach(() => jest.clearAllMocks());

	describe('.init()', () => {
		it('should dispatch a page view tracking event via `o-tracking`', () => {
			const context = { some: 'context' };
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.isFrameset = () => false;
			tracking.isInErrorDomain = () => true;
			tracking.prepareContext = () => context;

			tracking.init();

			expect(oTracking.page).toHaveBeenCalledTimes(1);
			expect(oTracking.page).toHaveBeenCalledWith(context);
		});

		it('should do nothing if within a frameset or if not within an error domain', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.isFrameset = () => true;
			tracking.isInErrorDomain = () => false;
			tracking.prepareContext = jest.fn();

			tracking.init();

			expect(oTracking.page).not.toHaveBeenCalled();
			expect(tracking.prepareContext).not.toHaveBeenCalled();
		});
	});

	describe('.prepareContext()', () => {
		it('should correctly prepare the context', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.prepareContextAudioInfo = () => ({ audio: 'foo' });
			tracking.prepareContextErrorInfo = () => ({ error: 'bar' });

			const result = tracking.prepareContext();

			expect(result).toEqual({
				...tracking.prepareContextAudioInfo(),
				...tracking.prepareContextErrorInfo()
			});
		});

		it('should omit the audio info from the context if there is none', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.prepareContextAudioInfo = () => undefined;
			tracking.prepareContextErrorInfo = () => ({ error: 'bar' });

			const result = tracking.prepareContext();

			expect(result).toEqual({
				...tracking.prepareContextErrorInfo()
			});
		});

		it('should omit the error info from the context if there is none', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.prepareContextAudioInfo = () => ({ audio: 'foo' });
			tracking.prepareContextErrorInfo = () => undefined;

			const result = tracking.prepareContext();

			expect(result).toEqual({
				...tracking.prepareContextAudioInfo()
			});
		});
	});

	describe('.prepareContextAudioInfo()', () => {
		const audioInfo = { content: { asset_type: 'audio' } };

		it('should return the audio info if the content type is `podcast`', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.getContentType = () => 'podcast';

			expect(tracking.prepareContextAudioInfo()).toEqual(audioInfo);
		});

		it('should prepare the audio info if the content type is `audio`', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.getContentType = () => 'audio';

			expect(tracking.prepareContextAudioInfo()).toEqual(audioInfo);
		});

		it('should return `undefined` if the content type is neither `podcast` nor `audio`', () => {
			const tracking = new PageViewTracking();

			// Stub out helper methods
			tracking.getContentType = () => 'foo';

			expect(tracking.prepareContextAudioInfo()).toBeUndefined();
		});
	});

	describe('.prepareContextErrorInfo()', () => {
		it('should return the error info if there is an error status', () => {
			const tracking = new PageViewTracking();
			const errorInfo = { error: 'info' };

			getErrorStatus.mockReturnValue('foo');
			prepareContextErrorInfo.mockReturnValue(errorInfo);

			expect(tracking.prepareContextErrorInfo()).toEqual(errorInfo);
		});

		it('should return nothing if no error status has been specified', () => {
			const tracking = new PageViewTracking();
			const errorInfo = { error: 'info' };

			getErrorStatus.mockReturnValue(undefined);
			prepareContextErrorInfo.mockReturnValue(errorInfo);

			expect(tracking.prepareContextErrorInfo()).toBeUndefined();
		});
	});

	describe('.getContentType()', () => {
		it('should delegate to the `getRootData` helper function', () => {
			const contentType = 'foo';
			const tracking = new PageViewTracking();

			getRootData.mockReturnValue(contentType);

			const result = tracking.getContentType();

			expect(result).toBe(contentType);
			expect(getRootData).toHaveBeenCalledTimes(1);
			expect(getRootData).toHaveBeenCalledWith('content-type');
		});
	});

	describe('.isFrameset()', () => {
		it('should return `false` if the script is running within an iframe', () => {
			const tracking = new PageViewTracking();
			expect(tracking.isFrameset()).toBe(false);
		});

		it('should return `true` if the script is not running within an iframe', () => {
			const top = window.top;
			const tracking = new PageViewTracking();

			Object.defineProperty(window, 'top', {
				writable: true,
				value: {}
			});

			expect(tracking.isFrameset()).toBe(true);

			window.top = top;
		});
	});

	describe('.isInErrorDomain()', () => {
		it('should return `true` if the hostname of the page is that of an FT error page ', () => {
			const href = window.location.href;
			const tracking = new PageViewTracking();

			// SEE: https://github.com/jsdom/jsdom#reconfiguring-the-jsdom-with-reconfiguresettings
			// SEE: https://github.com/facebook/jest/issues/5124
			jsdom.reconfigure({ url: 'http://errors-next.ft.com/foo' });

			expect(tracking.isInErrorDomain()).toBe(true);

			jsdom.reconfigure({ url: href });
		});

		it('should return `false` if the hostname of the page is not that of an FT error page ', () => {
			const tracking = new PageViewTracking();
			expect(tracking.isInErrorDomain()).toBe(false);
		});
	});
});
