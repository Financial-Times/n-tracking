import subject from '../transformContextData';

describe('src/utils/transformContextData', () => {
	it('maps the received properties to property names specified by tracking documents', () => {
		const fixture = {
			conceptId: 1234,
			conceptType: 'audio'
		};

		const expected = {
			rootConceptId: 1234,
			rootConceptType: 'audio'
		};

		expect(subject(fixture)).toEqual(expected);
	});

	it('maps the content UUID and type to match the audio tracking spec', () => {
		const fixture = {
			contentId: 1234,
			contentType: 'audio'
		};

		const expected = {
			rootContentId: 1234,
			rootContentType: 'audio',
			content: {
				uuid: 1234,
				asset_type: 'audio'
			}
		};

		expect(subject(fixture)).toEqual(expected);
	});
});
