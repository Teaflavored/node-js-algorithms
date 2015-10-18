//key idea, partition array around a pivot element

//find pivot then rearrange such that all elements smaller
//than the pivot we put on the left, all the elements greater we put into the right
//the pivot will always be in the right place
//
//partition is done in linear time, no extra memory

var quicksort = function (arr, start, endIdx) {
	if (arr.length == 1) {
		return arr;
	}	

	if (typeof start == "undefined") {
		start = 0;
	}

	if (typeof endIdx == "undefined") {
		endIdx = arr.length - 1;
	}

	if (start >= endIdx) {
		return arr;
	}
	
	var partitionedIdx = partitionInPlace(arr, start, endIdx);			

	quicksort(arr, start, partitionedIdx - 1);
	quicksort(arr, partitionedIdx + 1, endIdx);

	return arr;
};


var swap = function (arr, idx1, idx2) {
	if (idx1 == idx2) {
		return;
	}
	var temp = arr[idx2];	
	arr[idx2] = arr[idx1];
	arr[idx1] = temp;
}

var partitionInPlace = function (arr, left, right) {
	if (left == right || left < 0 || right > arr.length - 1 ) {
		return left;
	}
	//pivot is in place	
	var pivot = arr[left]
	var i = j = left + 1;
	
	//iterate j to the end
	while ( j <= right ) {
		if ( arr[j] < pivot ) {
			swap(arr, i, j)
			i++;
		}
		j++;
	}
	swap( arr, i - 1, left);
	return i - 1;
};

var test = [5,5,5,5,5,5,5,1,2,1];
quicksort(test);
console.log(test);
