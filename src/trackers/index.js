import oTracking from 'copy-tracking';
import CopyTracking from 'copy-tracking';

export function initialiseSitewideTrackers () {
	// Click-event tracking - https://github.com/Financial-Times/o-tracking
	oTracking.click.init('cta');
	CopyTracking.init();
}
