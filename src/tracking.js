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
	constructor(flags, appInfo = {}) {
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
		return {
			...(this.prepareContextAppInfo() || {}),
			...(this.prepareContextContentInfo() || {}),
			...(this.prepareContextConceptInfo() || {}),
			...(this.prepareContextErrorInfo() || {}),
			...(this.prepareContextEditionInfo() || {}),
			...(this.prepareContextSegmentInfo() || {}),
			...(this.prepareContextCPCInfo() || {}),
			...(this.prepareContextPageMetaInfo() || {}),
			...(this.prepareContextABStateInfo() || {})
		};
	}

	prepareContextAppInfo() {
		return {
			product: this.appInfo.product || "next",
			app: this.appInfo.name,
			appVersion: this.appInfo.version
		};
	}

	prepareContextContentInfo() {
		const contentId = this.getRootData("content-id");
		if (contentId) return { rootContentId: contentId };
	}

	prepareContextConceptInfo() {
		const conceptId = this.getRootData("concept-id");
		if (conceptId) {
			return {
				rootConceptId: conceptId,
				rootTaxonomy: this.getRootData("taxonomy")
			};
		}
	}

	prepareContextErrorInfo() {
		const errorStatus = (/nextErrorStatus=(\d{3})/.exec(
			window.location.search
		) || [])[1];

		if (errorStatus) {
			const info = {};

			const errorReason = (/nextErrorReason=(\w+)/.exec(
				window.location.search
			) || [])[1];

			// TODO after https://github.com/Financial-Times/o-tracking/issues/122#issuecomment-194970465
			// this should be redundant as context would propagate down to each event in its entirety
			info.url = window.parent.location.toString();
			info.referrer = window.parent.document.referrer;
			info.errorStatus = errorStatus;
			info.metricName = `page-error.${this.appInfo.name}.${errorStatus}`;

			if (errorReason) {
				info.errorReason = errorReason;
			}

			return info;
		}
	}

	prepareContextEditionInfo() {
		const edition = document.querySelector("[data-next-edition]");
		if (edition) return { edition: edition.getAttribute("data-next-edition") };
	}

	prepareContextSegmentInfo() {
		const segmentId = this.findInQueryString("segmentId");
		if (segmentId) return { ["marketing_segment_id"]: segmentId };
	}

	prepareContextCPCInfo() {
		const cpcCampaign = this.findInQueryString("cpccampaign");
		if (cpcCampaign) return { ["cpc_campaign"]: cpcCampaign };
	}

	prepareContextPageMetaInfo() {
		const pageMeta = window.FT && window.FT.pageMeta;
		if (pageMeta && pageMeta === Object(pageMeta)) {
			const info = {};
			for (let key of Object.keys(pageMeta)) {
				info[key] = pageMeta[key];
			}
			return info;
		}
	}

	prepareContextABStateInfo() {
		const abState = this.getRootData("ab-state");
		if (abState) {
			let ammitAllocations = abState;

			if (abState !== "-") {
				ammitAllocations = {};
				abState.split(",").forEach(flag => {
					const [name, value] = flag.split(":");
					ammitAllocations[name] = value;
				});
			}

			return { ["active_ammit_flags"]: ammitAllocations };
		}
	}

	getRootData(name) {
		return document.documentElement.getAttribute(`data-${name}`);
	}

	findInQueryString(name) {
		let exp = new RegExp(`[?&]${name}=([^?&]+)`);
		return (String(window.location.search).match(exp) || [])[1];
	}

	static init(flags, appInfo) {
		return new Tracking(flags, appInfo).init();
	}
}
