import React from 'react';
import formatAppContext from '../lib/formatAppContext';

const pixel = 'https://spoor-api.ft.com/px.gif?data=';

const placeholder = '[SOURCE]';

export function CoreTracking({ appContext }) {
	// We only need the basics as the full data cannot be assembled
	// on the server without the client-side JS.
	const context = formatAppContext(appContext);

	const trackingData = {
		category: 'page',
		action: 'view',
		system: {
			source: 'non-ctm'
		},
		context: {
			...context,
			product: 'next',
			data: { source: placeholder }
		}
	};

	const encodedTrackingData = encodeURIComponent(JSON.stringify(trackingData));

	// NOTE: This function will be stringified and embedded so use ES5 only!
	function coreExperience() {
		if (/\bcore\b/.test(document.documentElement.className)) {
			var currentScript = document.scripts[document.scripts.length - 1];
			var img = new Image();

			img.src = currentScript.getAttribute('data-pixel-src');
		}
	}

	return (
		<React.Fragment>
			<script
				// To pass this information to the client-side
				data-pixel-src={
					pixel + encodedTrackingData.replace(placeholder, 'core-experience')
				}
				dangerouslySetInnerHTML={{
					__html: '(' + coreExperience.toString() + ')();'
				}}
			/>
			<noscript>
				<img src={pixel + encodedTrackingData.replace(placeholder, 'no-js')} />
			</noscript>
		</React.Fragment>
	);
}
