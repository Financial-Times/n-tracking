import oTracking from 'o-tracking';
import { broadcast } from '../broadcast';
import { getAppInfo } from './get-app-info';
import { getUserData } from './get-user-data';
import { prepareContext } from '../context';
import { initialiseSitewideTrackers } from '../trackers';

export const ERROR_MSG = 'Failed to init o-tracking';
export const SPOOR_API_INGEST_URL = 'https://spoor-api.ft.com/ingest';

export const tracking = {
	init ({
		context,
		appInfo,
		flags = window.FT.flags,
		additionalContext = {}
	} = {}) {
		try {
			if (!flags || !flags['oTracking']) {
				return;
			}

			const userData = getUserData();
			const appInfoToUse = appInfo || getAppInfo();
			const contextToUse = context || prepareContext(appInfoToUse);

			oTracking.init({
				server: SPOOR_API_INGEST_URL,
				context: { ...contextToUse, ...additionalContext },
				user: userData,
				useSendBeacon: flags['sendBeacon']
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
