import oTracking from 'o-tracking';
import { getRootData } from '../helpers/dom';
import { getErrorStatus } from '../helpers/error';
import { prepareContextErrorInfo } from '../helpers/context';

export default class PageViewTracking {
	init () {
		// FIXME - should not fire on barriers, but needs to
		// be around for a while data analytics fix their SQL
		if (!this.isFrameset() || this.isInErrorDomain()) {
			const context = this.prepareContext();
			oTracking.page(context);
		}
	}

	prepareContext () {
		return {
			...(this.prepareContextAudioInfo() || {}),
			...(this.prepareContextErrorInfo() || {}),
			...(this.prepareContextBarrierInfo() || {})
		};
	}

	prepareContextAudioInfo () {
		if (
			getRootData('content-type') === 'podcast' ||
			getRootData('content-type') === 'audio'
		) {
			return { content: { asset_type: 'audio' } };
		}
	}

	prepareContextErrorInfo () {
		if (getErrorStatus()) {
			return prepareContextErrorInfo();
		}
	}

	prepareContextBarrierInfo () {
		const barrierType = document.querySelector('[data-barrier]');
		if (barrierType) {
			return {
				barrier: true,
				barrierType: barrierType.getAttribute('data-barrier')
			};
		}
	}

	isFrameset () {
		return window === window.top;
	}

	isInErrorDomain () {
		return window.location.hostname === 'errors-next.ft.com';
	}

	static init () {
		return new PageViewTracking.init();
	}
}

// TODO: Test this
// TODO: Should barrier context be extracted to separate trackers
