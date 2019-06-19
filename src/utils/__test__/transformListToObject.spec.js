import subject from '../transformListToObject';

describe('src/utils/transformListToObject', () => {
	it('transforms a list of A/B tests into an object', () => {
		expect(subject('')).toEqual({});
	});

	it('adds each test to the object', () => {
		const result = subject('foo:bar,baz:qux');

		expect(result.foo).toEqual('bar');
		expect(result.baz).toEqual('qux');
	});

	it('ignores invalid tests', () => {
		const result = subject('foo:bar,baz,qux:quux');

		expect(result.hasOwnProperty('foo')).toEqual(true);
		expect(result.hasOwnProperty('baz')).toEqual(false);
	});
});
