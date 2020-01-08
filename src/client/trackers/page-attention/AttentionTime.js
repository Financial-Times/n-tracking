// Automatically stop the attention timer after this time
const ATTENTION_INTERVAL = 15000;

// These events re/start the attention timer
const ATTENTION_EVENTS = [
	'load',
	'click',
	'focus',
	'scroll',
	'mousemove',
	'touchstart',
	'touchend',
	'touchcancel',
	'touchleave'
];

// These events pause the attention timer
const ATTENTION_LOST_EVENTS = ['blur'];

// These events will trigger the exit callback
const PAGE_EXIT_EVENTS = ['beforeunload', 'unload', 'pagehide'];

const defaultOptions = {
	onExit: () => {},
	debug: false
};

export default class AttentionTime {
	constructor (options) {
		this.options = { ...defaultOptions, ...options };

		this.totalAttentionTime = 0;
		this.hasExited = false;

		this.init();
	}

	init () {
		ATTENTION_EVENTS.forEach((event) => {
			window.addEventListener(event, this.startAttention.bind(this));
		});

		ATTENTION_LOST_EVENTS.forEach((event) => {
			window.addEventListener(event, this.endAttention.bind(this));
		});

		PAGE_EXIT_EVENTS.forEach((event) => {
			window.addEventListener(event, this.handleExit.bind(this));
		});

		document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

		const videoPlayers = document.querySelectorAll('video');

		videoPlayers.forEach((element) => {
			element.addEventListener('playing', this.startConstantAttention.bind(this));

			element.addEventListener('pause', this.endConstantAttention.bind(this));

			element.addEventListener('ended', this.endConstantAttention.bind(this));
		});
	}

	startAttention (event) {
		clearTimeout(this.attentionTimeout);

		if (!this.startAttentionTime) {
			this.startAttentionTime = Date.now();
		}

		this.attentionTimeout = setTimeout(
			this.endAttention.bind(this, { type: 'timeout' }),
			ATTENTION_INTERVAL
		);

		if (this.options.debug) {
			console.log(`start:${event.type}`, event.type); // eslint-disable-line no-console
		}
	}

	endAttention (event) {
		if (this.startAttentionTime) {
			clearTimeout(this.attentionTimeout);

			this.totalAttentionTime = this.getAttentionTime();
			this.startAttentionTime = null;
		}

		if (this.options.debug) {
			console.log(`end:${event.type}`, this.totalAttentionTime); // eslint-disable-line no-console
		}
	}

	startConstantAttention () {
		this.constantAttentionInterval = setInterval(
			this.startAttention.bind(this),
			ATTENTION_INTERVAL
		);
	}

	endConstantAttention () {
		this.endAttention();
		clearInterval(this.constantAttentionInterval);
	}

	getAttentionTime () {
		let currentAttentionTime = 0;

		if (this.startAttentionTime) {
			currentAttentionTime = Math.round(
				(Date.now() - this.startAttentionTime) / 1000
			);
		}

		return this.totalAttentionTime + currentAttentionTime;
	}

	handleVisibilityChange () {
		if (document.visibilityState === 'hidden') {
			this.endAttention({ type: 'visibility' });
		} else {
			this.startAttention({ type: 'visibility' });
		}
	}

	handleExit () {
		if (this.hasExited) {
			return;
		}

		this.endAttention();

		if (this.options.debug) {
			console.log('broadcast', this.totalAttentionTime); // eslint-disable-line no-console
		}

		this.options.onExit(this.totalAttentionTime);

		this.hasExited = true;
	}
}
