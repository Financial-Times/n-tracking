import {
	withHTML,
	withDocumentInnerHTML,
	withReconfiguredWindowSettings
} from './helpers';
import { prepareContext } from '../context';
import { getErrorStatus } from '../helpers/error';
import { prepareErrorInfoForContext } from '../helpers/context';

jest.mock('../helpers/error', () => ({
	getErrorStatus: jest.fn()
}));

jest.mock('../helpers/context', () => ({
	prepareErrorInfoForContext: jest.fn()
}));

getErrorStatus;

const appInfo = {
	name: 'foo',
	product: 'bar',
	version: '1.0.0'
};

const expectedContextAppInfo = {
	app: 'foo',
	product: 'bar',
	appVersion: '1.0.0'
};

describe('prepareContext(appInfo)', () => {
	afterEach(() => jest.resetAllMocks());

	describe('app info', () => {
		it('should correctly prepare the error context', () => {
			const context = prepareContext(appInfo);

			expect(context).toEqual(expectedContextAppInfo);
		});

		it('should set the `product` property to `next` if the `appInfo` arg does not contain a `product` prop', () => {
			const $appInfo = Object.assign({}, appInfo, { product: undefined });
			const context = prepareContext($appInfo);

			expect(context).toEqual({
				app: 'foo',
				product: 'next',
				appVersion: '1.0.0'
			});
		});
	});

	describe('content info', () => {
		it('should add the content info to the created context it is present', () => {
			withHTML({
				html: '<html data-content-id="10001"></html>',
				assertion: () => {
					const context = prepareContext(appInfo);

					expect(context).toEqual({
						...expectedContextAppInfo,
						rootContentId: '10001'
					});
				}
			});
		});
	});

	describe('concept info', () => {
		describe('when the concept id has been specified', () => {
			it('should add the concept info to the created context', () => {
				const conceptId = 'concept-123';
				const taxonomy = 'taxonomy-123';

				withHTML({
					html: `<html data-concept-id="${conceptId}"  data-taxonomy="${taxonomy}"></html>`,
					assertion: () => {
						const context = prepareContext(appInfo);

						expect(context).toEqual({
							...expectedContextAppInfo,
							rootConceptId: conceptId,
							rootTaxonomy: taxonomy
						});
					}
				});
			});
		});

		describe('when the concept id has not been specified', () => {
			it('should not add the concept info to the created context', () => {
				withHTML({
					html: '<html data-taxonomy="123"></html>',
					assertion: () => {
						const context = prepareContext(appInfo);

						expect(context).toEqual(expectedContextAppInfo);
					}
				});
			});
		});
	});

	describe('error info', () => {
		it('should add the error info to the created context if it has been specified', () => {
			const errorStatus = '503';
			const baseErrorInfo = { baseErrorInfo: 'error' };

			getErrorStatus.mockReturnValue(errorStatus);
			prepareErrorInfoForContext.mockReturnValue(baseErrorInfo);

			const context = prepareContext(appInfo);

			expect(context).toEqual({
				...expectedContextAppInfo,
				...baseErrorInfo,
				metricName: `page-error.${appInfo.name}.${errorStatus}`
			});
		});
	});

	describe('edition info', () => {
		it('should add the edition info to the context if it is present', () => {
			const edition = 'edition123';
			withDocumentInnerHTML({
				innerHTML: `
					<div data-next-edition="${edition}">
						...
					</div>
				`,
				assertion: () => {
					const context = prepareContext(appInfo);
					expect(context).toEqual({ ...expectedContextAppInfo, edition });
				}
			});
		});
	});

	describe('segment info', () => {
		it('should add the segment info to the context if it is present', () => {
			const segmentId = '12345';
			const url = `https://www.ft.com/content/foo?desktop=true&segmentId=${segmentId}#myft:notification:instant-email:content`;
			withReconfiguredWindowSettings({
				settings: { url },
				assertion: () => {
					const context = prepareContext(appInfo);
					expect(context).toEqual({
						...expectedContextAppInfo,
						['marketing_segment_id']: segmentId
					});
				}
			});
		});
	});

	describe('cpc campaign info', () => {
		it('should add the cpc campaign info to the context if it is present', () => {
			const cpcCampaign = 'EducationHub';
			const url = `https://enterprise.ft.com/en-gb/contact-us/?cpccampaign=${cpcCampaign}`;
			withReconfiguredWindowSettings({
				settings: { url },
				assertion: () => {
					const context = prepareContext(appInfo);
					expect(context).toEqual({
						...expectedContextAppInfo,
						['cpc_campaign']: cpcCampaign
					});
				}
			});
		});
	});

	describe('page meta info', () => {
		it('should add the page meta info to the context if it is present', () => {
			window.FT = {
				pageMeta: {
					one: '1',
					two: '2'
				}
			};

			const context = prepareContext(appInfo);
			expect(context).toEqual({
				...expectedContextAppInfo,
				...window.FT.pageMeta
			});

			delete window.FT;
		});
	});

	describe('ab state info', () => {
		it('should add the AB state data to the context if it is present', () => {
			withHTML({
				html: `
					<html  data-ab-state="one:on,two:off">
						...
					</html>
				`,
				assertion: () => {
					const context = prepareContext(appInfo);
					expect(context).toEqual({
						...expectedContextAppInfo,
						['active_ammit_flags']: {
							one: 'on',
							two: 'off'
						}
					});
				}
			});
		});
	});
});

// TODO: Make sure you test prepareErrorInfoForContext function
// TODO: Install the jsdom lib directly
// TODO: Test when the appInfo does not have a product
