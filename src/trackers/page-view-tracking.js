import oTracking from 'o-tracking';
import { getRootData } from '../helpers/dom';
import { getErrorStatus } from '../helpers/error';
import { prepareErrorInfoForContext } from '../helpers/context';

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
			...(this.prepareContextErrorInfo() || {})
		};
	}

	prepareContextAudioInfo () {
		if (
			this.getContentType() === 'podcast' ||
			this.getContentType() === 'audio'
		) {
			return { content: { asset_type: 'audio' } };
		}
	}

	prepareContextErrorInfo () {
		if (getErrorStatus()) {
			return prepareErrorInfoForContext();
		}
	}

	getContentType () {
		return getRootData('content-type');
	}

	isFrameset () {
		return window !== window.top;
	}

	isInErrorDomain () {
		return window.location.hostname === 'errors-next.ft.com';
	}

	static init () {
		return new PageViewTracking.init();
	}
}
