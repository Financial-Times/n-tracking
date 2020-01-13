const MAX_LENGTH = 100;

const TRUNCATED_TEXT = ' … ';

export default (text) => {
	if (text.length > MAX_LENGTH) {
		const newLength = MAX_LENGTH - TRUNCATED_TEXT.length;
		const left = Math.floor(newLength / 2);
		const right = Math.ceil(newLength / 2);

		return text.substr(0, left) + ' … ' + text.substr(right * -1);
	} else {
		return text;
	}
};
