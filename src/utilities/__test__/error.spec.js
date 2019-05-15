import { withDOM } from '../../__test__/helpers';
import { getErrorStatus } from '../error';

describe('helper: error', () => {
	describe('getErrorStatus()', () => {
		it('should return the error status specified in the query string', () => {
			const errorStatus = '503';
			const url = `http://errors-next.ft.com/errors/page/503?anonymous=true&edition=uk&nextErrorStatus=${errorStatus}`;

			withDOM({
				url,
				assertion: () => {
					expect(getErrorStatus()).toBe(errorStatus);
				}
			});
		});
	});
});
