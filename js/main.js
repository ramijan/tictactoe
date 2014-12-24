angular
	.module('tttApp', ['firebase'])
	.filter('leadingZeroes', function() {
		return function(input) {
			if(!input) return '000000';
			var totalLength = 6;
			var inputLength = input.toString().length;
			var output = '';
			for(var i = 0; i < totalLength - inputLength; i++) {
				output += '0';
			}
			output += input;
			return output;
		};
});
