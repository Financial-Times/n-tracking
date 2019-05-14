export function getConnectionType () {
	return (
		navigator.connection ||
		navigator.mozConnection ||
		navigator.webkitConnection
	);
}
