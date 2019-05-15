import { getErrorReason, getErrorStatus } from '../utilities/error';

export function prepareErrorInfoForContext () {
	const info = {};
	const errorReason = getErrorReason();

	// TODO (taken from n-ui) after https://github.com/Financial-Times/o-tracking/issues/122#issuecomment-194970465
	// this should be redundant as context would propagate down to each event in its entirety
	info.url = window.parent.location.toString();
	info.referrer = window.parent.document.referrer;
	info.errorStatus = getErrorStatus();

	if (errorReason) {
		info.errorReason = errorReason;
	}

	return info;
}
