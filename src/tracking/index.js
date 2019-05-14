import oTracking from 'o-tracking';
import { broadcast } from 'n-ui-foundations';
import { getUserData } from './get-user-data';
import { prepareContext } from '../helpers/context';
import { initialiseSitewideTrackers } from '../trackers';

export const ERROR_MSG = 'Failed to init o-tracking';
export const SPOOR_API_INGEST_URL = 'https://spoor-api.ft.com/ingest';

export const tracking = {
	init ({
		flags,
		appInfo = {},
		context = prepareContext(appInfo),
		additionalContext = {}
	} = {}) {
		try {
			if (!flags || !flags.get('oTracking')) {
				return;
			}

			const userData = getUserData();

			oTracking.init({
				server: SPOOR_API_INGEST_URL,
				context: { ...context, ...additionalContext },
				user: userData,
				useSendBeacon: flags.get('sendBeacon')
			});

			initialiseSitewideTrackers();
		} catch (error) {
			broadcast('oErrors.log', {
				error: error,
				info: { message: ERROR_MSG }
			});
		}
	}
};
