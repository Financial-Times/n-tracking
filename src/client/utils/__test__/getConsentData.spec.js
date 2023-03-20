jest.mock("@financial-times/privacy-us-privacy", () => ({
	getUsPrivacyForTracking: jest.fn(),
}));

jest.mock("@financial-times/ads-personalised-consent", () => ({
	getPersonalisedConsent: jest.fn(),
}));

import { getUsPrivacyForTracking } from "@financial-times/privacy-us-privacy";
import { getPersonalisedConsent } from "@financial-times/ads-personalised-consent";

import getConsentData from "../getConsentData";

describe("getConsentData", () => {

	beforeEach(() => {
		getPersonalisedConsent.mockResolvedValue({
			isAllowed: jest.fn().mockReturnValue({
				consent1: true,
				consent2: false,
			}),
		});
		getUsPrivacyForTracking.mockReturnValue("usprivacy");
	})
	afterEach(() => {
		jest.clearAllMocks();
	});


	it("returns the consent data and awaits for getPersonalisedConsent.isAllowed()", async () => {
		const consentData = await getConsentData();

		expect(consentData).toEqual({
			consent1: true,
			consent2: false,
			usprivacy: "usprivacy",
		});
	});

	it("Errors if getPersonalisedConsent.isAllowed() rejects", async () => {
		getPersonalisedConsent.mockRejectedValue(new Error("no consent"));

		await expect(getConsentData()).rejects.toThrow("no consent");
	});

	it("Errors if getUsPrivacyForTracking rejects", async () => {
		getUsPrivacyForTracking.mockImplementation(() => {
			throw new Error("us privacy error");
		});

		await expect(getConsentData()).rejects.toThrow("us privacy error");
	});
});
