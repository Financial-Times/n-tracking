export const userIsInCohort = (cohortPercent = 5) => {
	const { cookie } = document || {};
	if (!cookie) return false;

	let spoorNumber = false;
	let isInCohort = false;
	try {
		spoorNumber = parseInt(decodeURIComponent(cookie.match(/spoor-id=([^;]+)/)[1].replace(/[^0-9]+/g,'')));
		isInCohort = spoorNumber % 100 <= cohortPercent;
	} catch (error) {
		// The spoor id is not in the cohort percentile.
	}
	return isInCohort;
};
