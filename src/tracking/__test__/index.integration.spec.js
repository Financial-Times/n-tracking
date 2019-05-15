import oGrid from 'o-grid';
import oViewport from 'o-viewport';
import oTracking from 'o-tracking';
import withDomOverwrites from 'with-dom-overwrites';
import { initialiseSitewideTrackers } from '../../trackers';
import { tracking, SPOOR_API_INGEST_URL } from '..';

jest.mock('o-grid', () => ({ getCurrentLayout: jest.fn() }), { virtual: true });
jest.mock('o-tracking', () => ({ init: jest.fn() }), { virtual: true });
jest.mock('../../trackers', () => ({ initialiseSitewideTrackers: jest.fn() }));
jest.mock('o-viewport', () => ({ getOrientation: jest.fn() }), {
	virtual: true
});

const flags = {
	get: value => {
		switch (value) {
			case 'oTracking':
				return true;
			case 'sendBeacon':
				return 'sendBeacon';
			default:
				return true;
		}
	}
};

describe('tracking', () => {
	afterEach(() => jest.clearAllMocks());

	describe('@integration', () => {
		describe('.init()', () => {
			it('should initialise `oTracking` with the correct parameters', () => {
				const userData = {
					layout: 'foo:layout',
					orientation: 'foo:orientation',
					connectionType: 'foo:connectionType'
				};

				const appInfo = {
					name: 'sample-app',
					product: 'ft',
					version: '1.0.0',
					isProduction: true
				};

				oGrid.getCurrentLayout.mockReturnValue(userData.layout);
				oViewport.getOrientation.mockReturnValue(userData.orientation);

				withDomOverwrites({
					overwrites: {
						'navigator.connection': userData.connectionType,
						'document.documentElement.outerHTML': `
							<html
								data-next-is-production
								data-next-app="${appInfo.name}"
								data-next-version="${appInfo.version}"
								data-next-product="${appInfo.product}"
								data-ab-state="oTracking:on">
								...
							</html>
						`
					},
					run: () => {
						tracking.init({ flags });

						expect(oTracking.init).toHaveBeenCalledWith({
							server: SPOOR_API_INGEST_URL,
							context: {
								active_ammit_flags: { oTracking: 'on' },
								app: appInfo.name,
								appVersion: appInfo.version,
								product: appInfo.product
							},
							user: userData,
							useSendBeacon: flags.get('sendBeacon')
						});

						expect(initialiseSitewideTrackers).toHaveBeenCalledTimes(1);
					}
				});
			});
		});
	});
});
