export function getCookie (name) {
	const regex = new RegExp(`${name}=([^;]+)/`);
	const match = document.cookie && document.cookie.match(regex);
	return match ? match[1] : null;
}
