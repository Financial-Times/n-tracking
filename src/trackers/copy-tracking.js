import { broadcast } from 'n-ui-foundations';

export default class CopyTracking {
	constructor (root = document) {
		this.root = root;
	}
	init () {
		const listener = e => {
			const element = e.target;
			const data = {
				action: 'copy',
				category: 'text',
				context: {
					nodeName: element.nodeName.toLowerCase(),
					product: 'next'
				}
			};

			if (window.getSelection) {
				const selection = window.getSelection().toString();
				data.context.characters = selection.length;
				data.context.words = Math.ceil(selection.split(/\b/).length / 2);
				if (selection.length > 100) {
					data.selection =
						selection.substr(0, 47) + ' ... ' + selection.substr(-47);
				} else {
					data.selection = selection;
				}
			}

			broadcast('oTracking.event', data);
		};

		const removeListener = () =>
			this.root.removeEventListener('copy', listener);

		this.root.addEventListener('copy', listener);

		return removeListener;
	}
}
