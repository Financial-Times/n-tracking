export function broadcast (name, data, bubbles = true) {
	const rootEl = Element.prototype.isPrototypeOf(this) ? this : document.body;

	// This requires a polyfill for IE
	// <https://caniuse.com/#feat=customevent>
	const event = new CustomEvent(name, {
		bubbles: bubbles,
		cancelable: true,
		detail: data
	});

	rootEl.dispatchEvent(event);
}
