import { broadcast } from '../broadcast';

export const textCopying = () => {
	document.addEventListener('copy', (event) => {
		const context = {
			nodeName: event.target.nodeName.toLowerCase()
		};

		if (window.getSelection) {
			const selection = window.getSelection().toString().trim();

			context.characters = selection.length;
			context.words = selection.split(/\s+/).length;
		}

		broadcast('oTracking.event', {
			action: 'copy',
			category: 'text',
			context
		});
	});
};
