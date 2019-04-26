import { findInQueryString } from './dom';

export function getErrorStatus () {
	return findInQueryString('nextErrorStatus');
	// return (/nextErrorStatus=(\d{3})/.exec(window.location.search) || [])[1]; // TODO: Remove this line
}

export function getErrorReason () {
	return (/nextErrorReason=(\w+)/.exec(window.location.search) || [])[1];
}

// TODO: See if to use findInQueryString to do this
// TODO: Test this file
