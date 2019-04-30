import PageViewTracking from './page-view-tracking';
import { getTeaserTestContext } from '../helpers/ab-test';

export default class HomepageViewTracking extends PageViewTracking {
	prepareContext () {
		return {
			...super.prepareContext(),
			...(this.prepareContextHomepageInfo() || {})
		};
	}

	prepareContextHomepageInfo () {
		if (location.pathname === '/') {
			return { ['teaser_tests']: getTeaserTestContext() };
		}
	}

	static init () {
		return new HomepageViewTracking.init();
	}
}

// TODO: Test this
// TODO: See if the static init function can be made generic
