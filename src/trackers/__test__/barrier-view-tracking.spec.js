import { withDOM } from '../../__test__/helpers';
import BarrierViewTracking from '../barrier-view-tracking';

jest.mock('o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });
jest.mock('o-tracking', () => ({ init: jest.fn() }), { virtual: true });
jest.mock('o-viewport', () => ({ getOrientation: jest.fn() }), {
	virtual: true
});

const barrierData = {
	type: 'foo',
	messaging: 'bar',
	opportunitySubType: 'baz',
	isProductSelector: true
};

describe('BarrierViewTracking', () => {
	describe('.getAcquisitionContext()', () => {
		it('should return an array of acquisition context entries if they have been specified', () => {
			withDOM({
				html: `
					<html>
						<body>
							<div>
								<div data-acquisition-context="a"></div>
								<div data-acquisition-context="b"></div>
								<div data-acquisition-context="c"></div>
							</div>
						</body>
					</html>
				`,
				assertion: () => {
					const tracking = new BarrierViewTracking();
					expect(tracking.getAcquisitionContext()).toEqual(['a', 'b', 'c']);
				}
			});
		});

		it('should return an empty array if there is no acquisition context', () => {
			const tracking = new BarrierViewTracking();
			expect(tracking.getAcquisitionContext()).toEqual([]);
		});
	});

	describe('.getOffers()', () => {
		it('should return the ids of all the offers', () => {
			withDOM({
				html: `
					<html>
						<body>
							<div>
								<div data-offer-id="1"></div>
								<div data-offer-id="2"></div>
								<div data-offer-id="3"></div>
							</div>
						</body>
					</html>
				`,
				assertion: () => {
					const tracking = new BarrierViewTracking();
					expect(tracking.getOffers()).toEqual(['1', '2', '3']);
				}
			});
		});

		it('should return an empty array if there are no offers', () => {
			const tracking = new BarrierViewTracking();
			expect(tracking.getOffers()).toEqual([]);
		});
	});

	describe('.getBarrierReferrer()', () => {
		it('should return the barrier referrer if it has been specified', () => {
			const referrer = 'app';
			const url = `https://www.ft.com/products?barrierReferrer=${referrer}`;

			withDOM({
				url,
				assertion: () => {
					const tracking = new BarrierViewTracking();
					expect(tracking.getBarrierReferrer()).toBe(referrer);
				}
			});
		});

		it('should return undefined if the barrier referrer has not been specified', () => {
			const tracking = new BarrierViewTracking();
			expect(tracking.getBarrierReferrer()).toBeUndefined();
		});
	});

	describe('.getBarrierData()', () => {
		it('should return the barrier data if it has been specified', () => {
			withDOM({
				html: `
					<html>
						<body>
							<div
								data-barrier="${barrierData.type}"
								data-barrier-messaging="${barrierData.messaging}"
								data-opportunity-subtype="${barrierData.opportunitySubType}"
								data-barrier-is-product-selector="${barrierData.isProductSelector}">
								...
							</div>
						</body>
					</html>
				`,
				assertion: () => {
					const tracking = new BarrierViewTracking();
					expect(tracking.getBarrierData()).toEqual(barrierData);
				}
			});
		});

		it('should return nothing if the barrier data has not been specified', () => {
			const tracking = new BarrierViewTracking();
			expect(tracking.getBarrierData()).toBeUndefined();
		});
	});

	describe('.getOpportunityTaggingData()', () => {
		it('should return the opportunity tagging data', () => {
			const tracking = new BarrierViewTracking();

			// Stub out helpers
			tracking.getBarrierData = () => barrierData;

			const result = tracking.getOpportunityTaggingData();
			const expectedResult = {
				type: 'products',
				subtype: barrierData.opportunitySubType
			};

			expect(result).toEqual(expectedResult);
		});

		it('should return nothing if there is no barrier data', () => {
			const tracking = new BarrierViewTracking();

			// Stub out helpers
			tracking.getBarrierData = () => undefined;

			expect(tracking.getOpportunityTaggingData()).toBeUndefined();
		});

		it('should set the type to `barrier` is the barrier is not a product selector', () => {
			const tracking = new BarrierViewTracking();
			const barrier = { ...barrierData, isProductSelector: false };

			// Stub out helpers
			tracking.getBarrierData = () => barrier;

			const result = tracking.getOpportunityTaggingData();
			const expectedResult = {
				type: 'barrier',
				subtype: barrier.opportunitySubType
			};
			expect(result).toEqual(expectedResult);
		});

		it('should set the `subtype` to the barrier type if the barrier opportunity subtype has not been specifiexport default', () => {
			const tracking = new BarrierViewTracking();
			const barrier = { ...barrierData, opportunitySubType: undefined };

			// Stub out helpers
			tracking.getBarrierData = () => barrier;

			const result = tracking.getOpportunityTaggingData();
			const expectedResult = {
				type: 'products',
				subtype: barrier.type
			};
			expect(result).toEqual(expectedResult);
		});
	});
});
