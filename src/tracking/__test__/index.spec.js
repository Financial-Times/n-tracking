import oTracking from 'o-tracking';
import { broadcast } from 'n-ui-foundations';
import { getUserData } from '../get-user-data';
import { prepareContext } from '../../helpers/context';
import { initialiseSitewideTrackers } from '../../trackers';
import { tracking, SPOOR_API_INGEST_URL, ERROR_MSG } from '..';

jest.mock('o-tracking', () => ({ init: jest.fn() }), { virtual: true });
jest.mock('n-ui-foundations', () => ({ broadcast: jest.fn() }), {
	virtual: true
});
jest.mock('../get-user-data', () => ({ getUserData: jest.fn() }));
jest.mock('../../helpers/context', () => ({ prepareContext: jest.fn() }));
jest.mock('../../trackers', () => ({ initialiseSitewideTrackers: jest.fn() }));

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

const appInfo = { appInfo: 'appInfo' };
const context = { context: '' };
const userData = { userData: '' };

describe('tracking', () => {
	afterEach(() => jest.clearAllMocks());

	describe('.init()', () => {
		it('should initialise `oTracking` with the correct parameters', () => {
			getUserData.mockReturnValue(userData);
			prepareContext.mockReturnValue(context);

			tracking.init({ flags, appInfo });

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: context,
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});
		});

		it('should initialise the site wide trackers', () => {
			getUserData.mockReturnValue(userData);
			prepareContext.mockReturnValue(context);

			tracking.init({ flags, appInfo });

			expect(initialiseSitewideTrackers).toHaveBeenCalledTimes(1);
		});

		it('does nothing when the flag has not been set', () => {
			const flags = {
				get: jest.fn(flag => (flag === 'oTracking' ? false : true))
			};

			tracking.init({ flags, appInfo });

			expect(flags.get).toHaveBeenCalledTimes(1);
			expect(flags.get).toHaveBeenCalledWith('oTracking');
			expect(oTracking.init).not.toHaveBeenCalled();
			expect(getUserData).not.toHaveBeenCalled();
		});

		it('does nothing when flags have not been supplied', () => {
			tracking.init({ appInfo });

			expect(oTracking.init).not.toHaveBeenCalled();
			expect(getUserData).not.toHaveBeenCalled();
		});

		it('should broadcast an error if one occurs', () => {
			const error = new Error('Something went wrong');

			getUserData.mockImplementation(() => {
				throw error;
			});

			tracking.init({ flags, appInfo });

			// TODO: Dont use the broadcast function from n-ui-foundations

			expect(broadcast).toHaveBeenCalledTimes(1);
			expect(broadcast).toHaveBeenCalledWith('oErrors.log', {
				error,
				info: { message: ERROR_MSG }
			});
		});

		it('should allow for the context to be supplied', () => {
			getUserData.mockReturnValue(userData);

			const specialContext = { specialContext: '' };

			tracking.init({
				flags,
				appInfo,
				context: specialContext
			});

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
			getUserData.mockReturnValue(userData);

			const additionalContext = { additionalContext: '' };

			tracking.init({ flags, appInfo, additionalContext });

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: { ...context, ...additionalContext },
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});
		});
	});
});
