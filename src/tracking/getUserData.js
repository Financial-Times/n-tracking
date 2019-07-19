import oGrid from 'o-grid';
import oViewport from 'o-viewport';

export default function getUserData () {
	// https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
	const networkInfo =
		navigator.connection ||
		navigator.mozConnection ||
		navigator.webkitConnection;

	return {
		layout: oGrid.getCurrentLayout(),
		orientation: oViewport.getOrientation(),
		connectionType: networkInfo ? networkInfo.type : undefined
	};
}
