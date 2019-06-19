export default function getQueryParams() {
	const searchParams = new URLSearchParams(window.location.search);

	return {
		segmentId: searchParams.get('segmentId'),
		cpcCampaign: searchParams.get('cpccampaign')
	};
}
