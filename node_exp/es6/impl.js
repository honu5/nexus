// const { mergeSort, selectionSort } = require("./Sorting");
import { selectionSort, mergeSort } from "./Sorting.js";

console.log(mergeSort);

const arr = [64, 25, 12, 22, 11];

console.log(mergeSort(arr));
console.log(selectionSort(arr));
