export default function getQueryParams (queryString = window.location.search) {
	const result = {};
	const properties = ['segmentid', 'cpccampaign'];
	const searchParams = new URLSearchParams(queryString);

	// NOTE: undefined parameters will return null values so fallback to undefined
	properties.forEach((property) => {
		const value = searchParams.get(property);

		if (value) {
			result[property] = value;
		}
	});

	return result;
}
