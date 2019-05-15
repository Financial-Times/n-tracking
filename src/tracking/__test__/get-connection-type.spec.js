import { getConnectionType } from '../get-connection-type';

describe('getConnectionType()', () => {
	it('should return the correct connection info for the browser', () => {
		navigator.connection = 'connection';
		navigator.mozConnection = undefined;
		navigator.webkitConnection = undefined;

		const result = getConnectionType();

		expect(result).toBe(navigator.connection);
	});

	it('should return `mozConnection` if applicable', () => {
		navigator.connection = undefined;
		navigator.mozConnection = 'mozConnection';
		navigator.webkitConnection = 'webkitConnection';

		const result = getConnectionType();

		expect(result).toBe(navigator.mozConnection);
	});

	it('should return `webkitConnection` if applicable', () => {
		navigator.connection = undefined;
		navigator.mozConnection = undefined;
		navigator.webkitConnection = 'webkitConnection';

		const result = getConnectionType();

		expect(result).toBe(navigator.webkitConnection);
	});

	it('should return `undefined` if not available', () => {
		navigator.connection = undefined;
		navigator.mozConnection = undefined;
		navigator.webkitConnection = undefined;

		const result = getConnectionType();

		expect(result).toBeUndefined();
	});
});
