var fs = require("fs");

fs.readFile("../IntegerArray.txt", "utf-8", function (err, data) {
	if (err) {
		console.log("Error reading file");
		process.exit(0);
	} else {
		var arr = data.trim().split("\r\n").map(function (numString) {
			return parseInt(numString);	
		});
		console.log("The number of inversions is " + countInversions([arr, 0])[1]);
	}
});

var countInversions = function (data) {
	//piggy back off merge sort	
	var arr = data[0];
	var inversions = data[1];
	
	if (arr.length <= 1) {
		return data;
	}

	var mid = Math.floor(arr.length / 2);
	var leftInversionData = countInversions([arr.slice(0, mid), inversions]);
	var rightInversionData = countInversions([arr.slice(mid, arr.length), inversions]);
	var splitInversionData = countSplitInversions(leftInversionData[0], rightInversionData[0]);

	return [splitInversionData[0], leftInversionData[1] + rightInversionData[1] + splitInversionData[1]];
};

var countSplitInversions = function (leftArr, rightArr) {
	var result = [];	
	var totalInversions = 0;
	//when we're extracting from the right array, the number of elements left in the left array is the number of inversions
	while (leftArr.length != 0 && rightArr.length != 0) {
		if (rightArr[0] < leftArr[0]) {
			result.push(rightArr.shift());
			totalInversions += leftArr.length;	
		} else {
			result.push(leftArr.shift());
		}
	}

	return [result.concat(leftArr).concat(rightArr), totalInversions];
};
