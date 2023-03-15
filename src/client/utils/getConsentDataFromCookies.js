import { getCookie } from "./getCookie";
import { getUsPrivacyForTracking } from "@financial-times/privacy-us-privacy";

export default function getConsentDataFromCookies() {
	const usprivacy = getUsPrivacyForTracking();
	const rawConsentCookie = getCookie("FTConsent");

	if (!rawConsentCookie) {
		return {
			behavioral: false,
			demographic: false,
			programmatic: false,
			all: false,
			usprivacy,
		};
	}

	const { behaviouraladsOnsite, demographicadsOnsite, programmaticadsOnsite } = parseFTConsentCookie(rawConsentCookie);

	return {
		behavioral: behaviouraladsOnsite,
		demographic: demographicadsOnsite,
		programmatic: programmaticadsOnsite,
		all: behaviouraladsOnsite && demographicadsOnsite && programmaticadsOnsite,
		usprivacy,
	};
}

function parseFTConsentCookie(value) {
	if (!value || !value.length) {
		return {
			behaviouraladsOnsite: false,
			demographicadsOnsite: false,
			programmaticadsOnsite: false,
		};
	}

	return Object.fromEntries(
		decodeURIComponent(value)
			.split(",")
			.map((item) => item.split(":"))
			.map(([key, value]) => [key, value === "on" ? true : false])
	);
}
