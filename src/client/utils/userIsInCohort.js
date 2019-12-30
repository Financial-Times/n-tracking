
/**
 * userIsInCohort
 *
 * @param {integer} cohortPercent the percentage of users you want in your cohort.
 * @returns {boolean} true if the user's spoor number is between zero and `cohortPercent`.
 */
export const userIsInCohort = cohortPercent => {
	if (!cohortPercent || isNaN(cohortPercent)) return false;

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
