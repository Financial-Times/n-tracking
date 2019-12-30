
import { userIsInCohort } from '../userIsInCohort';

describe('src/utils/userIsInCohort.js', () => {

	it('correctly returns false if the user has no spoor-id', () => {
		document.cookie = 'this-user-has-no-spoorid';
		expect(userIsInCohort()).toBe(false);
	});

	it('correctly returns false if the user is not in the right cohort', () => {
		document.cookie = 'spoor-id=2';
		expect(userIsInCohort(1)).toBe(false);
	});

	it('returns true if the user is in the right cohort', () => {
		document.cookie = 'spoor-id=2';
		expect(userIsInCohort(2)).toBe(true);
	});
});
