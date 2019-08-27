export default function getErrorPageParams (queryString = window.location.search) {
	const searchParams = new URLSearchParams(queryString);

	const errorStatus = searchParams.get('nextErrorStatus');
	const errorReason = searchParams.get('nextErrorReason');

	if (errorStatus || errorReason) {
		return {
			errorStatus,
			errorReason,
			url: window.parent.location.toString(),
			referrer: window.parent.document.referrer,
		};
	}
}
