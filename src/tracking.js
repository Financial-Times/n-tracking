import oGrid from 'o-grid';
import oViewport from 'o-viewport';
import oTracking from 'o-tracking';
import { broadcast } from 'n-ui-foundations';
import { prepareContext } from './helpers/context';
import { initialiseSitewideTrackers } from './trackers';

export const ERROR_MSG = 'Failed to init o-tracking';
export const SPOOR_API_INGEST_URL = 'https://spoor-api.ft.com/ingest';

export class Tracking {
	constructor ({
		flags,
		appInfo = {},
		context = prepareContext(),
		additionalContext = {}
	} = {}) {
		this.flags = flags;
		this.appInfo = appInfo;
		this.context = { ...context, ...additionalContext };
	}

	init () {
		try {
			if (!this.flags || !this.flags.get('oTracking')) {
				return;
			}

			const userData = this.getUserData();

			oTracking.init({
				server: SPOOR_API_INGEST_URL,
				context: this.context,
				user: userData,
				useSendBeacon: this.flags.get('sendBeacon')
			});

			initialiseSitewideTrackers();
		} catch (error) {
			broadcast('oErrors.log', {
				error: error,
				info: { message: ERROR_MSG }
			});
		}
	}

	getUserData () {
		const userData = {
			layout: oGrid.getCurrentLayout(),
			orientation: oViewport.getOrientation()
		};
		const connectionType = this.getConnectionType();

		if (connectionType) {
			userData.connectionType = connectionType;
		}

		return userData;
	}

	getConnectionType () {
		return (
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection
		);
	}

	static init (flags, appInfo) {
		return new Tracking(flags, appInfo).init();
	}
}
