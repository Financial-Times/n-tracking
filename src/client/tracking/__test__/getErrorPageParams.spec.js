import subject from '../getErrorPageParams';

describe('src/tracking/getErrorPageParams', () => {
	it('returns nothing if no error page is detected', () => {
		expect(subject('?errors=none')).toBeUndefined();
	});

	it('overrides the URL and referrer if an error page is detected', () => {
		const result = subject('?nextErrorStatus=500');

		expect(result).toHaveProperty('url');
		expect(result).toHaveProperty('referrer');
	});

	it('sets the error status and reason if an error page is detected', () => {
		const result = subject('?nextErrorStatus=500&nextErrorReason=oops');
		expect(result).toHaveProperty('errorStatus', '500');
		expect(result).toHaveProperty('errorReason', 'oops');
	});
});
