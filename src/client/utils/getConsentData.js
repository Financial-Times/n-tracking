import { getUsPrivacyForTracking } from "@financial-times/privacy-us-privacy";
import { getPersonalisedConsent } from "@financial-times/ads-personalised-consent";

export default async function getConsentData() {
	const consentValues = (await getPersonalisedConsent()).isAllowed();
	const usprivacy = getUsPrivacyForTracking();
	return {
		...consentValues,
		usprivacy,
	};
}
