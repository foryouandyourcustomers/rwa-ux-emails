/**
 * Move item in array
 * @param {LayoutItem[]} arr
 * @param {number} fromIndex
 * @param {number} toIndex
 */
 export const arrayMove = (arr, fromIndex, toIndex) => {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  };
  