import withDomOverwrites from 'with-dom-overwrites';
import { getErrorStatus } from '../error';

describe('helper: error', () => {
	describe('getErrorStatus()', () => {
		it('should return the error status specified in the query string', () => {
			const errorStatus = '503';
			const url = `http://errors-next.ft.com/errors/page/503?anonymous=true&edition=uk&nextErrorStatus=${errorStatus}`;

			withDomOverwrites({
				overwrites: {
					'document.location.href': url
				},
				run: () => {
					expect(getErrorStatus()).toBe(errorStatus);
				}
			});
		});
	});
});
