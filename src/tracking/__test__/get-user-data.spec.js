import oGrid from 'o-grid';
import oViewport from 'o-viewport';
import { getUserData } from '../get-user-data';
import { getConnectionType } from '../get-connection-type';

jest.mock('o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });
jest.mock('o-viewport', () => ({ getOrientation: jest.fn() }), {
	virtual: true
});
jest.mock('../get-connection-type', () => ({ getConnectionType: jest.fn() }));

describe('getUserData()', () => {
	const userData = {
		layout: 'layoutUserData',
		orientation: 'orientationUserData',
		connectionType: 'connectionTypeUserData'
	};

	it('should return the correct user data', () => {
		oGrid.getCurrentLayout.mockReturnValue(userData.layout);
		oViewport.getOrientation.mockReturnValue(userData.orientation);
		getConnectionType.mockReturnValue(userData.connectionType);

		const result = getUserData();

		expect(result).toEqual(userData);
	});

	it('should return a user data object without a `connectionType` prop when there is no connection Type ', () => {
		oGrid.getCurrentLayout.mockReturnValue(userData.layout);
		oViewport.getOrientation.mockReturnValue(userData.orientation);
		getConnectionType.mockReturnValue(null);

		const result = getUserData();

		expect(result.connectionType).toBeUndefined();
	});
});
