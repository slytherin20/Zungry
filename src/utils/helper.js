export function filterData(list, input) {
  if (!input) return list;
  else {
    let result = list.filter((restaurant) =>
      restaurant.info.name.toLowerCase().includes(input.toLowerCase())
    );
    return result;
  }
}

export function countSize(sizeTypes) {
  return Object.keys(sizeTypes).reduce(
    (count, sizeType) => count + sizeTypes[sizeType],
    0
  );
}
