import oGrid from "o-grid";
import oViewport from "o-viewport";
import oTracking from "o-tracking";
import { Tracking, SPOOR_API_INGEST_URL } from "../tracking";

jest.mock("o-grid", () => ({ getCurrentLayout: jest.fn() }), { virtual: true });

jest.mock("o-tracking", () => ({ init: jest.fn() }), { virtual: true });

jest.mock("o-viewport", () => ({ getOrientation: jest.fn() }), {
	virtual: true
});

jest.mock("n-ui-foundations", () => ({ broadcast: jest.fn() }), {
	virtual: true
});

const flags = {
	get: value => `flag::${value}`
};

const appInfo = { appInfo: "appInfo" };

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

	describe(".userData", () => {
		afterEach(() => jest.clearAllMocks());

		const userData = {
			layout: "layoutUserData",
			orientation: "orientationUserData",
			connectionType: "connectionTypeUserData"
		};

		it("should return the correct user data", () => {
			const tracking = new Tracking(flags, appInfo);

			oGrid.getCurrentLayout.mockReturnValue(userData.layout);
			oViewport.getOrientation.mockReturnValue(userData.orientation);
			tracking.getConnectionType = () => userData.connectionType;

			const result = tracking.getUserData();

			expect(result).toEqual(userData);
		});

		it("should return a user data object without a `connectionType` prop when there is no connection Type ", () => {
			const tracking = new Tracking(flags, appInfo);

			oGrid.getCurrentLayout.mockReturnValue(userData.layout);
			oViewport.getOrientation.mockReturnValue(userData.orientation);
			tracking.getConnectionType = () => null;

			const result = tracking.getUserData();

			expect(result.connectionType).toBeUndefined();
		});
	});

	describe(".getConnectionType()", () => {
		it("should return the correct connection info for the browser", () => {
			navigator.connection = "connection";
			navigator.mozConnection = undefined;
			navigator.webkitConnection = undefined;

			const tracking = new Tracking(flags, appInfo);
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.connection);
		});

		it("should return `mozConnection` if applicable", () => {
			navigator.connection = undefined;
			navigator.mozConnection = "mozConnection";
			navigator.webkitConnection = "webkitConnection";

			const tracking = new Tracking(flags, appInfo);
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.mozConnection);
		});

		it("should return `webkitConnection` if applicable", () => {
			navigator.connection = undefined;
			navigator.mozConnection = undefined;
			navigator.webkitConnection = "webkitConnection";

			const tracking = new Tracking(flags, appInfo);
			const result = tracking.getConnectionType();

			expect(result).toBe(navigator.webkitConnection);
		});

		it("should return `undefined` if not available", () => {
			navigator.connection = undefined;
			navigator.mozConnection = undefined;
			navigator.webkitConnection = undefined;

			const tracking = new Tracking(flags, appInfo);
			const result = tracking.getConnectionType();

			expect(result).toBeUndefined();
		});
	});
});
