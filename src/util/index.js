export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  return result;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

export const random = (terms) => {
  let arr_1 = []
  let arr_2 = []
  let array = []
  for (let i = 0; i < terms.length ; i++) {
    let item_1 = {
      txt: "",
      id: ""
    }
    let item_2 = {
      txt: "",
      id: ""
    }
    item_1.txt = terms[i].prompt
    item_1.id = terms[i]._id
    item_2.txt = terms[i].answer
    item_2.id = terms[i]._id
    arr_1.push(item_1)
    arr_2.push(item_2)
  }
  shuffle(arr_1)
  shuffle(arr_2)
  for (let i = 0; i < terms.length ; i++) {
    array.push(arr_1[i])
    array.push(arr_2[i])
  }
  return array
}

export function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function sortOrder(array, order, key) {
  array?.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
  return array
}
export function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}