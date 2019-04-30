import { findInQueryString } from './dom';

export function getErrorStatus () {
	return findInQueryString('nextErrorStatus');
}

export function getErrorReason () {
	return findInQueryString('nextErrorReason');
}

// TODO: See if to use findInQueryString to do this
// TODO: Test getErrorReason
