import oGrid from 'o-grid';
import oViewport from 'o-viewport';
import oTracking from 'o-tracking';
import { broadcast } from 'n-ui-foundations';
import { prepareContext } from '../helpers/context';
import { initialiseSitewideTrackers } from '../trackers';
import { Tracking, SPOOR_API_INGEST_URL, ERROR_MSG } from '../tracking';

jest.mock('o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });
jest.mock('o-tracking', () => ({ init: jest.fn() }), { virtual: true });
jest.mock('o-viewport', () => ({ getOrientation: jest.fn() }), {
	virtual: true
});
jest.mock('n-ui-foundations', () => ({ broadcast: jest.fn() }), {
	virtual: true
});
jest.mock('../helpers/context', () => ({ prepareContext: jest.fn() }));
jest.mock('../trackers', () => ({ initialiseSitewideTrackers: jest.fn() }));

const flags = {
	get: value => {
		switch (value) {
			case 'oTracking':
				return true;
			case 'sendBeacon':
				return 'sendBeacon';
			default:
				return true;
		}
	}
};

const context = { context: '' };
const appInfo = { appInfo: 'appInfo' };

describe('Tracking', () => {
	afterEach(() => jest.clearAllMocks());

	describe('static .init()', () => {
		it('should setup and initialise the tracking class', () => {
			const originalConnection = navigator.connection;
			const context = { foo: 'foo' };
			const additionalContext = { bar: 'bar' };
			const userData = {
				layout: 'foo',
				orientation: 'bar',
				connectionType: 'baz'
			};

			navigator.connection = userData.connectionType;

			prepareContext.mockReturnValue(context);
			oGrid.getCurrentLayout.mockReturnValue(userData.layout);
			oViewport.getOrientation.mockReturnValue(userData.orientation);

			Tracking.init({ flags, appInfo, context, additionalContext });

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: { ...context, ...additionalContext },
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});

			navigator.connection = originalConnection;
		});
	});

	describe('.init()', () => {
		it('should initialise `oTracking` with the correct parameters', () => {
			prepareContext.mockReturnValue(context);

			const userData = { userData: '' };
			const tracking = new Tracking({ flags, appInfo });

			// Stub out helper methods
			tracking.getUserData = () => userData;

			tracking.init();

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: context,
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});
		});

		it('should initialise the site wide trackers', () => {
			const context = { context: '' };
			const userData = { userData: '' };
			const tracking = new Tracking({ flags, appInfo });

			// Stub out helper methods
			tracking.getUserData = () => userData;
			prepareContext.mockReturnValue(context);

			tracking.init();

			expect(initialiseSitewideTrackers).toHaveBeenCalledTimes(1);
		});

		it('does nothing when the flag has not been set', () => {
			const flags = {
				get: jest.fn(flag => (flag === 'oTracking' ? false : true))
			};
			const tracking = new Tracking({ flags, appInfo });

			// Stub out helper methods
			tracking.getUserData = jest.fn();

			tracking.init();

			expect(flags.get).toHaveBeenCalledTimes(1);
			expect(flags.get).toHaveBeenCalledWith('oTracking');
			expect(oTracking.init).not.toHaveBeenCalled();
			expect(tracking.getUserData).not.toHaveBeenCalled();
		});

		it('does nothing when flags have not been supplied', () => {
			const tracking = new Tracking({ appInfo });

			// Stub out helper methods
			tracking.getUserData = jest.fn();

			tracking.init();

			expect(oTracking.init).not.toHaveBeenCalled();
			expect(tracking.getUserData).not.toHaveBeenCalled();
		});

		it('should broadcast an error if one occurs', () => {
			const error = new Error('Something went wrong');
			const tracking = new Tracking({ flags, appInfo });

			// Stub out helper methods
			tracking.getUserData = () => {
				throw error;
			};

			tracking.init();

			expect(broadcast).toHaveBeenCalledTimes(1);
			expect(broadcast).toHaveBeenCalledWith('oErrors.log', {
				error,
				info: { message: ERROR_MSG }
			});
		});

		it('should allow for the context to be supplied', () => {
			const userData = { userData: '' };
			const specialContext = { specialContext: '' };
			const tracking = new Tracking({
				flags,
				appInfo,
				context: specialContext
			});

			// Stub out helper methods
			tracking.getUserData = () => userData;

			tracking.init();

			expect(prepareContext).not.toHaveBeenCalled();
			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: specialContext,
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});
		});

		it('should allow for additional context to be added to the default context', () => {
			const userData = { userData: '' };
			const additionalContext = { additionalContext: '' };
			const tracking = new Tracking({ flags, appInfo, additionalContext });

			// Stub out helper methods
			tracking.getUserData = () => userData;

			tracking.init();

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: { ...context, ...additionalContext },
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});
		});
	});

	describe('.userData', () => {
		const userData = {
			layout: 'layoutUserData',
			orientation: 'orientationUserData',
			connectionType: 'connectionTypeUserData'
		};

		it('should return the correct user data', () => {
			const tracking = new Tracking({ flags, appInfo });

			oGrid.getCurrentLayout.mockReturnValue(userData.layout);
			oViewport.getOrientation.mockReturnValue(userData.orientation);
			tracking.getConnectionType = () => userData.connectionType;

			const result = tracking.getUserData();

			expect(result).toEqual(userData);
		});

		it('should return a user data object without a `connectionType` prop when there is no connection Type ', () => {
			const tracking = new Tracking({ flags, appInfo });

			oGrid.getCurrentLayout.mockReturnValue(userData.layout);
			oViewport.getOrientation.mockReturnValue(userData.orientation);
			tracking.getConnectionType = () => null;

			const result = tracking.getUserData();

			expect(result.connectionType).toBeUndefined();
		});
	});

	describe('.getConnectionType()', () => {
		it('should return the correct connection info for the browser', () => {
			navigator.connection = 'connection';
			navigator.mozConnection = undefined;
			navigator.webkitConnection = undefined;

			const tracking = new Tracking({ flags, appInfo });
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.connection);
		});

		it('should return `mozConnection` if applicable', () => {
			navigator.connection = undefined;
			navigator.mozConnection = 'mozConnection';
			navigator.webkitConnection = 'webkitConnection';

			const tracking = new Tracking({ flags, appInfo });
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.mozConnection);
		});

		it('should return `webkitConnection` if applicable', () => {
			navigator.connection = undefined;
			navigator.mozConnection = undefined;
			navigator.webkitConnection = 'webkitConnection';

			const tracking = new Tracking({ flags, appInfo });
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.webkitConnection);
		});

		it('should return `undefined` if not available', () => {
			navigator.connection = undefined;
			navigator.mozConnection = undefined;
			navigator.webkitConnection = undefined;

			const tracking = new Tracking({ flags, appInfo });
			const result = tracking.getConnectionType();

			expect(result).toBeUndefined();
		});
	});
});
