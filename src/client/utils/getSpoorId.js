export function getSpoorId () {
	const match = document.cookie && document.cookie.match(/spoor-id=([^;]+)/);
	return match ? match[1] : null;
}
