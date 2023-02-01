const arr = [16, 17, 4, 3, 5, 2];

function test(arr) {
  const _arr = [];
  let max = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (max === null || arr[i] > max) {
      max = arr[i];
      _arr.push(max);
    }
  }
  return _arr.reverse();
}

console.log(test(arr));
