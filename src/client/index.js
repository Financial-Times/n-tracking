import oTracking from '@financial-times/o-tracking';
import getUserData from './tracking/getUserData';
import getQueryParams from './tracking/getQueryParams';
import getErrorPageParams from './tracking/getErrorPageParams';
import transformContextData from './utils/transformContextData';

export const SPOOR_API_INGEST_URL = 'https://spoor-api.ft.com/ingest';

export function init ({ appContext, extraContext, pageViewContext }) {
	const queryParams = getQueryParams();

	const options = {
		server: SPOOR_API_INGEST_URL,
		// This data will be appended to _all_ events captured by o-tracking
		context: transformContextData({
			...queryParams,
			...appContext,
			...extraContext
		}),
		user: getUserData(),
		// Using the Beacon API ensures that no tracking event data is lost
		// when the document is being unloaded, which happens when navigating
		// to a different page.
		useSendBeacon: true
	};

	oTracking.init(options);

	// Automatically trigger the page view event unless we're in an iframe
	if (window === window.top || window.location.hostname === 'errors-next.ft.com') {
		const errorPageParams = getErrorPageParams();

		oTracking.page({
			...errorPageParams,
			...pageViewContext,
		});
	}

	//  Initialise click event tracking for interactive elements
	oTracking.click.init('cta');

	return oTracking;
}

export * from './broadcast';
import * as trackers from './trackers/index.js';
export { trackers };
