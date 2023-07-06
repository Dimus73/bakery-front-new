
function FieldCheck (data) {
	const checkWord = ['SELECT', 'INSERT', 'DELETE', 'UPDATE'];
	if (checkWord.some ((value) => data.toLowerCase().indexOf(value.toLowerCase()) !== -1)){
		console.log('False');
		return false;
	}
	return true;
}

module.exports = {
	FieldCheck
}