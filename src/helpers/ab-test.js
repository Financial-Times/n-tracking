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

// TODO: Test this file
