var assert = require("assert");
//matrix is represented by 2d array
//assume input of n by n
//[[1,2], [2,3]] * [[3,4], [5,6]]
//[[1 * 3 + 2 * 5, 1 * 4 + 2 * 6 ], [ 2 * 3 + 3 * 5, 2 * 4 + 3 * 6 ]]
//[[13, 16], [ 21, 26 ]]

var naiveMultiply = function (matrix1, matrix2) {
	var n = matrix1.length;
	var result = [];
	for (var i = 0; i < n; i++ ) {
		var row = matrix1[i];
		var newRow = [];
		for (var j = 0; j < n; j++) {
			var col = getIthColumn(matrix2, j);
			var computedResultAtij = dotProduct(row, col);
			newRow.push(computedResultAtij);
		}
		result.push(newRow);
	}

	return result;
};

var getIthColumn = function (matrix, i) {
	var col = [];

	for (var rowIndex = 0; rowIndex < matrix.length; rowIndex++ ) {
		col.push(matrix[rowIndex][i]);
	}
	return col;
};

//assume arr1 and arr2 are same length
var dotProduct = function (arr1, arr2) {
	var product = 0;	
	for (var i = 0; i < arr1.length; i++ ) {
		product += arr1[i] * arr2[i];
	}	

	return product;
};

var recursiveMultiply = function (mat1, mat2) {
	//divide up the matrix into different components and then compute the sums
	//[[A, B], [C, D]]	 * [[E, F], [G, H]]
	// [[A * E + B * G, A * F + B * H], [ C * E + D * G, C * F + D * H ]]	
	// Need to compute AE, BG, AF, BH, CE, DG, CF, DH	
	// base case is if both matrices are of 1 single element, then we multiply just the numbers together
	if (mat1.length != mat2.length ) {
		console.log("Can't compute a non-NxN matrix.");
		process.exit(0);
	}	

	if (mat1.length == 1) {
		return [[ mat1[0][0] * mat2[0][0] ]];
	}

	var quadrantsABCD = divideIntoQuadrants(mat1);
	var quadrantsEFGH = divideIntoQuadrants(mat2);

	var A = quadrantsABCD[0],
		B = quadrantsABCD[1],
		C = quadrantsABCD[2],
		D = quadrantsABCD[3],
		E = quadrantsEFGH[0],
		F = quadrantsEFGH[1],
		G = quadrantsEFGH[2],
		H = quadrantsEFGH[3];

	//8 recursive calls, this will be cubic still, if we use strassen's rule here we can make it subcubic
	var AE = recursiveMultiply(A, E),
		BG = recursiveMultiply(B, G),
		AF = recursiveMultiply(A, F),
		BH = recursiveMultiply(B, H),
		CE = recursiveMultiply(C, E),
		DG = recursiveMultiply(D, G),
		CF = recursiveMultiply(C, F),
		DH = recursiveMultiply(D, H);
	
	return combineQuadrants(
				addMatrices(AE, BG),
				addMatrices(AF, BH),
				addMatrices(CE, DG),
				addMatrices(CF, DH)
			);
};

var combineQuadrants = function (A, B, C, D) {
	var resultMatrix = [];	
	var numTopRows = A.length;
	var numBottomRows = C.length;

	for ( var i = 0; i < numTopRows; i++) {
		var newRow = [];
		for (var j = 0; j < A[i].length; j++) {
			newRow.push(A[i][j])
		}

		for (var j = 0; j < B[i].length; j++) {
			newRow.push(B[i][j]);
		}

		resultMatrix.push(newRow);
	}

	for ( var i = 0; i < numBottomRows; i++ ) {
		var newRow = [];
		
		for (var j = 0; j < C[i].length; j++ ) {
			newRow.push(C[i][j]);
		}

		for (var j = 0; j < D[i].length; j++ ) {
			newRow.push(D[i][j]);
		}

		resultMatrix.push(newRow);
	}

	return resultMatrix;
};

var addMatrices = function (mat1, mat2) {
	var resultMatrix = [];	
	var n = mat1.length;			

	for ( var i = 0; i < n; i++ ) {
		var newRow = [];
		for (var j = 0 ; j < n; j++ ) {
			newRow.push(mat1[i][j] + mat2[i][j]);
		}	
		resultMatrix.push(newRow);
	}

	return resultMatrix;
};

//n by n matrix
var divideIntoQuadrants = function (matrix) {
	var A = [],
		B = [],
		C = [],
		D = [];

	var n = matrix.length;
	if ( n == 1 ) {
		return matrix;
	}

	var mid = Math.floor( n / 2 );

	for (var i = 0; i < n; i++ ) { 
		var row = matrix[i];
		if ( i < mid ) {
			//A and B
			A.push(row.slice(0, mid));
			B.push(row.slice(mid, n));
		} else {
			//C and D
			C.push(row.slice(0, mid));
			D.push(row.slice(mid, n));
		}
	} 				

	return [A, B, C, D];
};
	
try {
	assert.equal( 64, dotProduct([1, 3, 5, 6], [ 5, 6, 7, 1 ]), "dot product successfully computed");
	assert.deepEqual([[4, 8], [3, 9]], combineQuadrants([[4]], [[8]], [[3]], [[9]]) );
	assert.deepEqual([[3, 6, 8], [8, 2, 3], [2, 7, 1]], combineQuadrants( [[3]], [[6, 8]] , [[8], [2]], [[2, 3], [7 , 1]]  ));
	assert.deepEqual([[7, 13], [26, 24]], addMatrices([[5, 2], [11, 2]], [[2, 11],[15, 22]]));
	assert.deepEqual([[[4]], [[8]], [[3]], [[9]]], divideIntoQuadrants([[4, 8],[3, 9]]) );
	assert.deepEqual([ [[3]], [[6, 8]] , [[8], [2]], [[2, 3], [7 , 1]]  ], divideIntoQuadrants([[3, 6, 8], [8, 2, 3], [2, 7, 1]]));
	assert.deepEqual([[13, 16],[21, 26]], naiveMultiply([[1,2], [2,3]],[[3,4], [5,6]]));
	assert.deepEqual(
			[
				[1069, 309, 521, 1811],
				[1594, 555, 1954, 5885],
				[3869, 1366, 2603, 11554],
				[2137, 955, 2761, 12480]
			],
			naiveMultiply(
				[
					[5, 6, 8, 10],
					[11, 31, 32, 13],
					[51, 23, 51, 32],
					[51, 22, 77, 12]
					],
				[
					[7, 9, 11, 111],
					[0, 3, 38, 72], 
					[8, 2, 16, 63],
					[97, 23, 11, 32]
				]
			)
		);
	assert.deepEqual(
			[[10]],
			recursiveMultiply(
				[[2]],
				[[5]]
				)
			);
	assert.deepEqual([[13, 16],[21, 26]], recursiveMultiply([[1,2], [2,3]],[[3,4], [5,6]]));
	assert.deepEqual(

			[
				[1069, 309, 521, 1811],
				[1594, 555, 1954, 5885],
				[3869, 1366, 2603, 11554],
				[2137, 955, 2761, 12480]
			],
			recursiveMultiply(

				[
					[5, 6, 8, 10],
					[11, 31, 32, 13],
					[51, 23, 51, 32],
					[51, 22, 77, 12]
					],
				[
					[7, 9, 11, 111],
					[0, 3, 38, 72], 
					[8, 2, 16, 63],
					[97, 23, 11, 32]
				]
				)
			);
} catch (e) {
	console.log(e.message);
	process.exit(0);
}
