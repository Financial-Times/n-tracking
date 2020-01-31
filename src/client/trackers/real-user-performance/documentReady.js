export const isReady = () => document.readyState === 'complete';

export const documentReady = () => {
	return new Promise((resolve) => {
		if (isReady()) {
			resolve();
		} else {
			document.addEventListener('readystatechange', () => {
				if (isReady()) {
					resolve();
				}
			});
		}
	});
};
