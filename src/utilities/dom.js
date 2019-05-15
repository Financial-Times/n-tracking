export function nodesToArray (nodelist) {
	return [].slice.call(nodelist);
}

export function getRootData (name) {
	return document.documentElement.getAttribute(`data-${name}`);
}

export function hasRootData (name) {
	return document.documentElement.hasAttribute(`data-${name}`);
}

export function findInQueryString (name) {
	let exp = new RegExp(`[?&]${name}=([^?&]+)`);
	return (String(window.location.search).match(exp) || [])[1];
}

export function selectEachAttributeValue (attr) {
	const offers = document.querySelectorAll(`[${attr}]`);
	return nodesToArray(offers).map(e => e.getAttribute(attr));
}
