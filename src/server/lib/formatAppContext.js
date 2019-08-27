// For a list of all the properties available see the app context schema:
// <https://github.com/Financial-Times/dotcom-page-kit/blob/master/packages/dotcom-server-app-context/schema.md>
export default function formatAppContext (appContext = {}) {
	return {
		name: appContext.appName || 'unknown',
	};
}
