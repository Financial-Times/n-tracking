import { Tracking } from '../tracking';
import { broadcast } from 'n-ui-foundations';
import { selectEachAttributeValue, findInQueryString } from '../helpers/dom';

export default class BarrierViewTracking extends Tracking {
	init () {
		const barrier = this.getBarrierData();

		if (barrier) {
			const eventData = Object.assign(
				{
					category: 'barrier',
					action: 'view',
					opportunity: this.getOpportunityTaggingData(),
					barrierReferrer: this.getBarrierReferrer(),
					type: barrier.type,
					commsType: barrier.messaging,
					acquisitionContext: this.getAcquisitionContext(),
					offers: this.getOffers()
				},
				this.prepareContext()
			);

			broadcast('oTracking.event', eventData);
		}
	}

	getAcquisitionContext () {
		return selectEachAttributeValue('data-acquisition-context');
	}

	getOffers () {
		return selectEachAttributeValue('data-offer-id');
	}

	getBarrierReferrer () {
		return findInQueryString('barrierReferrer');
	}

	getBarrierData () {
		const barrierElement = document.querySelector('[data-barrier]');
		if (barrierElement) {
			return {
				type: barrierElement.getAttribute('data-barrier'),
				messaging: barrierElement.getAttribute('data-barrier-messaging'),
				opportunitySubType: barrierElement.getAttribute(
					'data-opportunity-subtype'
				),
				isProductSelector: !!(
					barrierElement.getAttribute('data-barrier-is-product-selector') ===
					'true'
				)
			};
		}
	}

	getOpportunityTaggingData () {
		// https://docs.google.com/document/d/18_yV2s813XCrBF7w6196FLhLJzWXK4hXT2sIpDZVvhQ/edit?ts=575e9368#
		const barrier = this.getBarrierData();
		if (barrier) {
			return {
				type: barrier.isProductSelector ? 'products' : 'barrier',
				subtype: barrier.opportunitySubType || barrier.type
			};
		}
	}
}
