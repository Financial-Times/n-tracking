import { broadcast } from "../broadcast";
import ScrollDepth from "./page-attention/ScrollDepth";
import AttentionTime from "./page-attention/AttentionTime";

const defaultOptions = {
	excludeAttentionTime: false,
	excludeScrollDepth: false,
};

// TODO: The tracking event data for the `page:interaction` and `page:scrolldepth`
// events is needlessly different. We should work with the data team to align it.
export const pageAttention = (options = {}) => {
	const optionsWithDefaults = { ...defaultOptions, ...options };

	let attention;

	if (!optionsWithDefaults.excludeAttentionTime) {
		const onExit = (attentionTime) => {
			broadcast("oTracking.event", {
				category: "page",
				action: "interaction",
				context: {
					attention: {
						total: attentionTime,
					},
				},
			});
		};

		attention = new AttentionTime({ ...optionsWithDefaults, onExit });
	}

	if (!optionsWithDefaults.excludeScrollDepth) {
		const onScroll = (scrollDepth) => {
			const meta = {
				percentagesViewed: scrollDepth,
			};

			if (attention) {
				meta.attention = attention.getAttentionTime();
			}

			broadcast("oTracking.event", {
				category: "page",
				action: "scrolldepth",
				meta,
			});
		};

		new ScrollDepth({ ...optionsWithDefaults, onScroll });
	}
};
