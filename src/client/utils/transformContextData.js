import transformListToObject from './transformListToObject';

// Map of property names received to property names specified by the data team
// <https://sites.google.com/ft.com/ftproductanalytics/tracking-documents>
const dataPropertyMap = {
	appName: 'app',
	contentId: 'rootContentId',
	contentType: 'rootContentType',
	conceptId: 'rootConceptId',
	conceptType: 'rootConceptType',
	segmentid: 'marketing_segment_id',
	cpccampaign: 'cpc_campaign',
	abTestState: 'active_ammit_flags'
};

export default function transformContextData (contextData) {
	const result = {};

	Object.keys(contextData).forEach((key) => {
		let value = contextData[key];

		if (key === 'abTestState') {
			value = transformListToObject(value);
		}

		// HACK: ensure content UUID and type match the audio tracking spec
		// <https://docs.google.com/spreadsheets/d/1YjXO0_3Xojact4sU24tIo_Nnv7e38zbRHWjwmOfHkb0/edit?usp=sharing>
		if (key === 'contentId') {
			result.content = { ...result.content, uuid: value };
		}

		if (key === 'contentType') {
			result.content = { ...result.content, asset_type: value };
		}

		result[dataPropertyMap[key] || key] = value;
	});

	return result;
}
