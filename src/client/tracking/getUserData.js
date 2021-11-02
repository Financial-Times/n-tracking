import oGrid from '@financial-times/o-grid';
import oViewport from '@financial-times/o-viewport';
import { getLibrarySession } from '../utils/getLibrarySession';

export default function getUserData () {
	// https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
	const networkInfo =
		navigator.connection ||
		navigator.mozConnection ||
		navigator.webkitConnection;

	return {
		layout: oGrid.getCurrentLayout(),
		orientation: oViewport.getOrientation(),
		connectionType: networkInfo ? networkInfo.type : undefined,
		ft_session_publib: getLibrarySession()
	};
}
