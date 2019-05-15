import { getRootData, findInQueryString } from '../utilities/dom';
import { getErrorStatus } from '../utilities/error';
import { prepareErrorInfoForContext } from './prepare-error-info-for-context';

export function prepareContext (appInfo) {
	return {
		...(prepareContextAppInfo(appInfo) || {}),
		...(prepareContextContentInfo() || {}),
		...(prepareContextConceptInfo() || {}),
		...(prepareContextErrorInfo(appInfo) || {}),
		...(prepareContextEditionInfo() || {}),
		...(prepareContextSegmentInfo() || {}),
		...(prepareContextCPCInfo() || {}),
		...(prepareContextPageMetaInfo() || {}),
		...(prepareContextABStateInfo() || {})
	};
}

function prepareContextAppInfo (appInfo) {
	return {
		product: appInfo.product || 'next',
		app: appInfo.name,
		appVersion: appInfo.version
	};
}

function prepareContextContentInfo () {
	const contentId = getRootData('content-id');
	if (contentId) return { rootContentId: contentId };
}

function prepareContextConceptInfo () {
	const conceptId = getRootData('concept-id');
	if (conceptId) {
		return {
			rootConceptId: conceptId,
			rootTaxonomy: getRootData('taxonomy')
		};
	}
}

function prepareContextErrorInfo (appInfo) {
	const errorStatus = getErrorStatus();

	if (errorStatus) {
		return {
			...prepareErrorInfoForContext(),
			metricName: `page-error.${appInfo.name}.${errorStatus}`
		};
	}
}

function prepareContextEditionInfo () {
	const edition = document.querySelector('[data-next-edition]');
	if (edition) return { edition: edition.getAttribute('data-next-edition') };
}

function prepareContextSegmentInfo () {
	const segmentId = findInQueryString('segmentId');
	if (segmentId) return { ['marketing_segment_id']: segmentId };
}

function prepareContextCPCInfo () {
	const cpcCampaign = findInQueryString('cpccampaign');
	if (cpcCampaign) return { ['cpc_campaign']: cpcCampaign };
}

function prepareContextPageMetaInfo () {
	const pageMeta = window.FT && window.FT.pageMeta;
	if (pageMeta && typeof pageMeta === 'object') {
		const info = {};
		for (let key of Object.keys(pageMeta)) {
			info[key] = pageMeta[key];
		}
		return info;
	}
}

function prepareContextABStateInfo () {
	const abState = getRootData('ab-state');
	if (abState) {
		let ammitAllocations = abState;

		if (abState !== '-') {
			ammitAllocations = {};
			abState.split(',').forEach(flag => {
				const [name, value] = flag.split(':');
				ammitAllocations[name] = value;
			});
		}

		return { ['active_ammit_flags']: ammitAllocations };
	}
}
