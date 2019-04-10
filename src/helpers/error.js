export function getErrorStatus () {
	return (/nextErrorStatus=(\d{3})/.exec(window.location.search) || [])[1];
}

export function getErrorReason () {
	return (/nextErrorReason=(\w+)/.exec(window.location.search) || [])[1];
}

// TODO: Test this file
