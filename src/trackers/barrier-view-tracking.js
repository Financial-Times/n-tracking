import { Tracking } from '../tracking';
import { broadcast } from 'n-ui-foundations';
import { nodesToArray } from '../helpers/dom';

export default class BarrierViewTracking extends Tracking {
	init () {
		const barrierType = this.getBarrierType();

		if (barrierType) {
			const eventData = Object.assign(
				{
					category: 'barrier',
					action: 'view',
					opportunity: this.getOpportunityTaggingData(),
					barrierReferrer: this.getBarrierReferrer(),
					type: barrierType.getAttribute('data-barrier'),
					commsType: barrierType.getAttribute('data-barrier-messaging'),
					acquisitionContext: this.getAcquisitionContext(),
					offers: this.getOffers()
				},
				this.prepareContext()
			);

			broadcast('oTracking.event', eventData);
		}
	}

	isProductSelector () {
		const attr = 'data-barrier-is-product-selector';
		const elem = document.querySelector(`[${attr}]`);
		return !!(elem && elem.getAttribute(attr) === 'true');
	}

	getAcquisitionContext () {
		const attr = 'data-acquisition-context';
		const elements = document.querySelectorAll('[$attr]');
		return nodesToArray(elements).map(e => e.getAttribute(attr));
	}

	getOffers () {
		const attr = 'data-offer-id';
		const offers = document.querySelectorAll(`[${attr}]`);
		return nodesToArray(offers).map(e => e.getAttribute(attr));
	}

	getBarrierReferrer () {
		return (/barrierReferrer=(\w+)/.exec(window.location.search) || [])[1];
	}

	getBarrierType () {
		return document.querySelector('[data-barrier]');
	}

	getOpportunityTaggingData () {
		const barrierType = this.getBarrierType();
		// https://docs.google.com/document/d/18_yV2s813XCrBF7w6196FLhLJzWXK4hXT2sIpDZVvhQ/edit?ts=575e9368#
		return {
			type: this.isProductSelector() ? 'products' : 'barrier',
			subtype:
				barrierType.getAttribute('data-opportunity-subtype') ||
				barrierType.getAttribute('data-barrier')
		};
	}
}
