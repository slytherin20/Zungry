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

export function calculateBillDetails(items, restaurant) {
  let amountArr = items.map((item) => {
    if (item.selectedOptions?.size) {
      let count = countSize(item.selectedOptions.size);
      return (
        count * ((item.defaultPrice ? item.defaultPrice : item.price) / 100)
      );
    } else
      return (
        ((item.defaultPrice ? item.defaultPrice : item.price) / 100) *
        item.selectedQty
      );
  });
  let amount = amountArr.reduce((amt, curr) => amt + curr, 0);
  let delivery = restaurant?.feeDetails?.totalFee / 100 || 0;
  let gst = (amount * 5) / 100;
  return { amount, delivery, gst };
}

export function generateOrderTrackingId() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let orderId = "";
  let i = 0;
  while (i < 15) {
    orderId += chars.charAt(Math.random() * chars.length);
    i++;
  }
  return orderId;
}
