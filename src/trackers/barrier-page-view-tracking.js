import PageViewTracking from './page-view-tracking';

export default class BarrierPageViewTracking extends PageViewTracking {
	prepareContext () {
		return {
			...super.prepareContext(),
			...(this.prepareContextBarrierInfo() || {})
		};
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

	static init () {
		return new BarrierPageViewTracking.init();
	}
}
