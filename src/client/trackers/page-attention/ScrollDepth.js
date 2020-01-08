// Create markers at each of these percentage points
const DEPTH_MARKERS = [25, 50, 75, 100];

const defaultOptions = {
	onScroll: () => {},
	target: 'body',
	debug: false
};

export default class ScrollDepth {
	constructor (options) {
		this.options = { ...defaultOptions, ...options };

		this.init();
	}

	init () {
		const target = document.querySelector(this.options.target);

		if (target && 'IntersectionObserver' in window) {
			this.observer = new IntersectionObserver(this.handleIntersection.bind(this));

			target.style.position = 'relative';

			DEPTH_MARKERS.forEach((percentage) => {
				const marker = document.createElement('div');
				marker.className = 'n-tracking-scroll-depth-marker';
				marker.style.position = 'absolute';
				marker.style.top = `${percentage}%`;
				marker.style.bottom = '0';
				marker.style.width = '100%';
				marker.style.zIndex = '-1';
				marker.setAttribute('data-scroll-depth', percentage);

				target.appendChild(marker);

				this.observer.observe(marker);
			});
		}
	}

	handleIntersection (changes) {
		changes.forEach((change) => {
			if (change.isIntersecting || change.intersectionRatio > 0) {
				const marker = change.target;
				const scrollDepth = marker.getAttribute('data-scroll-depth');

				this.options.onScroll(scrollDepth);

				if (this.options.debug) {
					console.log('ScrollDepth', { marker: scrollDepth }); // eslint-disable-line no-console
				}

				if (marker.parentNode) {
					marker.parentNode.removeChild(marker);
				}

				this.observer.unobserve(marker);
			}
		});
	};
}
