import oGrid from 'o-grid';
import oViewport from 'o-viewport';

export default function getUserData () {
	return {
		layout: oGrid.getCurrentLayout(),
		orientation: oViewport.getOrientation(),
		connectionType:
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection
	};
}
