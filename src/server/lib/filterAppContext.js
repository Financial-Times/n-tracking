// For a list of all the properties available see the app context schema:
// <https://github.com/Financial-Times/dotcom-page-kit/blob/master/packages/dotcom-server-app-context/schema.md>
const allowedProperties = [
	'appName',
	'appVersion',
	'edition'
];

export default function filterAppContext (appContext = {}) {
	const output = {};

	allowedProperties.forEach((property) => {
		if (appContext[property] !== undefined && appContext[property] !== null) {
			output[property] = appContext[property];
		}
	});

	return output;
}
