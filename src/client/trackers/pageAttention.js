import { broadcast } from '../broadcast';
import AttentionTime from './page-attention/AttentionTime';

export const pageAttention = () => {
	const onExit = (attentionTime) => {
		broadcast('oTracking.event', {
			category: 'page',
			action: 'interaction',
			context: {
				attention: {
					total: attentionTime
				}
			}
		});
	};

	new AttentionTime({ onExit });
};
