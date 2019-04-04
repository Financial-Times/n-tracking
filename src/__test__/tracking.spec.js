import oTracking from "o-tracking";
import { Tracking, SPOOR_API_INGEST_URL } from "../tracking";

jest.mock("o-tracking", () => ({ init: jest.fn() }), { virtual: true });

jest.mock("n-ui-foundations", () => ({ broadcast: jest.fn() }), {
	virtual: true
});

const flags = {
	get: value => `flag::${value}`
};

const appInfo = { appInfo: "" };

describe("Tracking", () => {
	describe(".init()", () => {
		it("should initialise `oTracking` with the correct parameters", () => {
			const context = { context: "" };
			const userData = { userData: "" };
			const tracking = new Tracking(flags, appInfo);

			// Stub out helper methods
			tracking.getUserData = () => userData;
			tracking.prepareContext = () => context;

			tracking.init();

			expect(oTracking.init).toHaveBeenCalledTimes(1);
			expect(oTracking.init).toHaveBeenCalledWith({
				server: SPOOR_API_INGEST_URL,
				context: context,
				user: userData,
				useSendBeacon: flags.get("sendBeacon")
			});
		});
	});
});
