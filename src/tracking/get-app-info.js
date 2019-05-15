import { getRootData, hasRootData } from '../utilities/dom';

export function getAppInfo () {
	return {
		isProduction: hasRootData('next-is-production'),
		version: getRootData('next-version'),
		name: getRootData('next-app'),
		product: getRootData('next-product')
	};
}
