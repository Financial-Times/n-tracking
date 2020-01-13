import { broadcast } from '../broadcast';
import getTextExcerpt from './text-copying/getTextExcerpt';

export const textCopying = () => {
	document.addEventListener('copy', (event) => {
		const context = {
			nodeName: event.target.nodeName.toLowerCase()
		};

		if (window.getSelection) {
			const selection = window.getSelection().toString().trim();

			context.characters = selection.length;
			context.words = selection.split(/\s+/).length;
			context.selection = getTextExcerpt(selection);
		}

		broadcast('oTracking.event', {
			action: 'copy',
			category: 'text',
			context
		});
	});
};
