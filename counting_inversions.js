//divide into smaller subproblems
//conquer via recursive calls
//combine solutions of subproblems into one for original problem


//counting inversions
//problem: input: array A of length n, the numbers 1,2,3,....n in some arbitrary order
//output number of inversion = number of pairs (i, j) of array indices with i < j and A[i] > A[j]

//ex : [1,3,5,2,4,6]
//inversions: [3,2], [5,2], [5,4]
//inversion indices: [1, 3], [2,3], [2, 4]
//
//motivation for this problem: numerical similar measure between 2 ranked lists

//bruce force, double for loop and check each pair individually

var testArr = [1,3, 5, 2, 4, 6];

var bruteForceInversion = function (arr) {
	//iterate through the arr, for each idx, iterate through the greater index to see if we have inversions
	var results = [];
	var left;
	var right;

	for (var i = 0; i < arr.length; i++ ) {
		left = arr[i];
		for (var j = i + 1; j < arr.length; j++ ) {
			right = arr[j];
			if ( left > right ) {
				results.push([i, j]);
			}
		}				
	}

	return results;
};
//input will contain array and number of inversions
function recInversion (input) {
	//divide and solve left and right
	if (input[0].length <= 1) {
		return [input[0], 0];
	}

	console.log('fn called');
	var mid = Math.floor( input[0].length / 2 );
	var leftInversions = recInversion([input[0].slice(0, mid), input[1] ]);
	var rightInversions = recInversion([input[0].slice(mid, input[0].length), input[1]]);
	var splitInversions = countSplitInversions(leftInversions[0], rightInversions[0]);

	return [splitInversions[0], leftInversions[1] + rightInversions[1] + splitInversions[1]];
};

var countSplitInversions = function (leftArr, rightArr) {
	var inversions = 0;
	var sortedArr = [];

	while (leftArr.length != 0 && rightArr.length != 0) {
		if (leftArr[0] < rightArr[0]) {
			sortedArr.push(leftArr.shift());
		} else if (rightArr[0] < leftArr[0]) {
			inversions += leftArr.length;
			sortedArr.push(rightArr.shift());
		}
	}

	return [sortedArr.concat(leftArr).concat(rightArr), inversions ];
};

// console.log(bruteForceInversion(testArr));
console.log(recInversion([[5, 4, 1, 3], 0]));

