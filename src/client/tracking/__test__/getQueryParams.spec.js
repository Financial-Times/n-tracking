import subject from '../getQueryParams';

describe('src/tracking/getQueryParams', () => {
	it('sets the value for each query string property found', () => {
		const result = subject('?segmentid=123&cpccampaign=foo');
		expect(result).toHaveProperty('segmentid', '123');
		expect(result).toHaveProperty('cpccampaign', 'foo');
	});

	it('falls back to undefined for each query string value not found', () => {
		const result = subject('?');
		expect(result).not.toHaveProperty('segmentid');
		expect(result).not.toHaveProperty('cpccampaign');
	});
});
