import { broadcast } from '../broadcast';
import ScrollDepth from './page-attention/ScrollDepth';
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

	const attention = new AttentionTime({ onExit });

	const onScroll = (scrollDepth) => {
		broadcast('oTracking.event', {
			category: 'page',
			action: 'scrolldepth',
			meta: {
				percentagesViewed: scrollDepth,
				attention: attention.getAttentionTime()
			}
		});
	};

	new ScrollDepth({ onScroll });
};
