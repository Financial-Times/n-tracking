import { findInQueryString } from './dom';

export function getErrorStatus () {
	return findInQueryString('nextErrorStatus');
}

export function getErrorReason () {
	return findInQueryString('nextErrorReason');
}
