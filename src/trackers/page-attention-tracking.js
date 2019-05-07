// COPIED AS IS FROM N-UI

const oViewport = require('o-viewport');
const broadcast = require('n-ui-foundations').broadcast;
const ATTENTION_INTERVAL = 15000;
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
const UNATTENTION_EVENTS = ['blur'];
const EXIT_EVENTS = ['beforeunload', 'unload', 'pagehide'];

export default class PageAttentionTracking {
	constructor () {
		this.totalAttentionTime = 0;
		this.startAttentionTime;
		this.endAttentionTime;
		this.hasSentEvent = false;
	}

	init () {
		//Add events for all the other Attention events
		for (let i = 0; i < ATTENTION_EVENTS.length; i++) {
			window.addEventListener(ATTENTION_EVENTS[i], ev =>
				this.startAttention(ev)
			);
		}

		for (let i = 0; i < UNATTENTION_EVENTS.length; i++) {
			window.addEventListener(UNATTENTION_EVENTS[i], ev =>
				this.endAttention(ev)
			);
		}

		oViewport.listenTo('visibility');
		document.body.addEventListener(
			'oViewport.visibility',
			ev => this.handleVisibilityChange(ev),
			false
		);

		this.addVideoEvents();

		// Add event to send data on unload
		EXIT_EVENTS.forEach(event => {
			window.addEventListener(event, () => {
				if (this.hasSentEvent) {
					return;
				}
				this.hasSentEvent = true;
				this.endAttention();
				broadcast('oTracking.event', {
					category: 'page',
					action: 'interaction',
					context: {
						attention: {
							total: this.totalAttentionTime
						}
					}
				});
			});
		});
	}

	startAttention () {
		clearTimeout(this.attentionTimeout);
		if (!this.startAttentionTime) {
			this.startAttentionTime = new Date().getTime();
		}
		this.attentionTimeout = setTimeout(
			() => this.endAttention(),
			ATTENTION_INTERVAL
		);
	}

	startConstantAttention () {
		this.constantAttentionInterval = setInterval(
			() => this.startAttention(),
			ATTENTION_INTERVAL
		);
	}

	endConstantAttention () {
		this.endAttention();
		clearInterval(this.constantAttentionInterval);
	}

	endAttention () {
		if (this.startAttentionTime) {
			this.endAttentionTime = new Date().getTime();
			this.totalAttentionTime += Math.round(
				(this.endAttentionTime - this.startAttentionTime) / 1000
			);
			clearTimeout(this.attentionTimeout);
			this.startAttentionTime = null;
		}
	}

	get () {
		//getter should restart attention capturing as endAttention updates the value:
		this.endAttention();
		this.startAttention();
		return this.totalAttentionTime;
	}

	addVideoEvents () {
		this.videoPlayers = document.getElementsByTagName('video');
		for (let i = 0; i < this.videoPlayers.length; i++) {
			this.videoPlayers[i].addEventListener('playing', ev =>
				this.startConstantAttention(ev)
			);
			this.videoPlayers[i].addEventListener('pause', ev =>
				this.endConstantAttention(ev)
			);
			this.videoPlayers[i].addEventListener('ended', ev =>
				this.endConstantAttention(ev)
			);
		}
	}

	handleVisibilityChange (ev) {
		if (ev.detail.hidden) {
			this.endAttention();
		} else {
			this.startAttention();
		}
	}

	static init () {
		return new PageAttentionTracking().init();
	}
}
