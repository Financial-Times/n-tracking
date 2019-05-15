import PageViewTracking from './page-view-tracking';

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

export function getTeaserTestContext (doc = document) {
	const teasersUnderTest = [].slice.call(
		doc.querySelectorAll('[data-trackable-context-teaser-variant]')
	);
	const transformedTeasers = teasersUnderTest.map(teaser => ({
		content_id: teaser.getAttribute('data-content-id'),
		variant: teaser.getAttribute('data-trackable-context-teaser-variant'),
		headline_text: teaser.innerText
	}));

	return transformedTeasers;
}

// TODO: Test this
// TODO: See if the static init function can be made generic
