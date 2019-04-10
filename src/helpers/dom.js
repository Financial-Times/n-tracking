export function getRootData (name) {
	return document.documentElement.getAttribute(`data-${name}`);
}

export function findInQueryString (name) {
	let exp = new RegExp(`[?&]${name}=([^?&]+)`);
	return (String(window.location.search).match(exp) || [])[1];
}

// TODO: Test these functions
