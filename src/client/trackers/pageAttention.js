import { broadcast } from '../broadcast';
import ScrollDepth from './page-attention/ScrollDepth';
import AttentionTime from './page-attention/AttentionTime';

// TODO: The tracking event data for the `page:interaction` and `page:scrolldepth`
// events is needlessly different. We should work with the data team to align it.
export const pageAttention = (options = {}) => {
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

	const attention = new AttentionTime({ ...options, onExit });

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

	new ScrollDepth({ ...options, onScroll });
};
