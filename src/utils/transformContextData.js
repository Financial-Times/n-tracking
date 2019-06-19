import transformListToObject from './transformListToObject';

// Map of property names received to property names specified by the data team
// <https://sites.google.com/ft.com/ftproductanalytics/tracking-documents>
const dataPropertyMap = {
	appName: 'app',
	contentId: 'rootContentId',
	contentType: 'rootContentType',
	conceptId: 'rootConceptId',
	conceptType: 'rootConceptType',
};

export default function transformContextData(contextData) {
	const result = {};

	Object.keys(contextData).forEach((key) => {
		const value = contextData[key];

		if (key === 'abTestStatus') {
			result['active_ammit_flags'] = transformListToObject(value);
		} else {
			result[dataPropertyMap[key] || key] = value;
		}

		// HACK: ensure content UUID and type match the audio tracking spec
		// <https://docs.google.com/spreadsheets/d/1YjXO0_3Xojact4sU24tIo_Nnv7e38zbRHWjwmOfHkb0/edit?usp=sharing>
		if (key === 'contentId') {
			result.content = { ...result.content, uuid: value }
		}

		if (key === 'contentType') {
			result.content = { ...result.content, asset_type: value }
		}
	});

	return result;
}
