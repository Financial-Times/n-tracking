export default function transformListToObject(list) {
	const result = {};

	list.split(',').map(flag => {
		const [name, value] = flag.split(':');

		if (name && value) {
			result[name] = value;
		}
	});

	return result;
}
