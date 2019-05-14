import oGrid from 'o-grid';
import oViewport from 'o-viewport';
import { getConnectionType } from './get-connection-type';

export function getUserData () {
	const userData = {
		layout: oGrid.getCurrentLayout(),
		orientation: oViewport.getOrientation()
	};
	const connectionType = getConnectionType();

	if (connectionType) {
		userData.connectionType = connectionType;
	}

	return userData;
}
