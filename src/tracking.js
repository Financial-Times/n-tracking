import "./types";

import oGrid from "o-grid";
import oViewport from "o-viewport";
import oTracking from "o-tracking";
import { broadcast } from "n-ui-foundations";

export const ERROR_MSG = "Failed to init o-tracking";
export const SPOOR_API_INGEST_URL = "https://spoor-api.ft.com/ingest";

export class Tracking {
	/**
	 * Constructs the tracking instance
	 * @param {Flags} flags
	 * @param {AppInfo} appInfo
	 */
	constructor(flags, appInfo) {
		this.flags = flags;
		this.appInfo = appInfo;
	}

	init() {
		try {
			if (!this.flags || !this.flags.get("oTracking")) {
				return;
			}

			const context = this.prepareContext();
			const userData = this.getUserData();

			oTracking.init({
				server: SPOOR_API_INGEST_URL,
				context: context,
				user: userData,
				useSendBeacon: this.flags.get("sendBeacon")
			});
		} catch (error) {
			broadcast("oErrors.log", {
				error: error,
				info: { message: ERROR_MSG }
			});
		}
	}

	getUserData() {
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

	getConnectionType() {
		return (
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection
		);
	}

	prepareContext() {
		// TODO: IMPLEMENT
		return {};
	}

	static init(flags, appInfo) {
		return new Tracking(flags, appInfo).init();
	}
}
