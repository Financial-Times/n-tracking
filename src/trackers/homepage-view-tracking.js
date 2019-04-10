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
}

// TODO: Test this
