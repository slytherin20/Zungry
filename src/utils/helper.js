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

export function searchOnEnter(key, searchBtn) {
  if (key == "Enter") {
    searchBtn.current.click();
  }
}

export function debounceResult(cb, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export async function fetchRecommendation(location, keyword) {
  if (!keyword) return null;
  let domain =
    process.env.REACT_APP_ENV == "dev"
      ? "http://localhost:3000"
      : "https://zungryproxy.onrender.com";
  let url = `${domain}/search?lat=${location.lat}&long=${location.long}&kwd=${keyword}`;
  try {
    let res = await fetch(url);
    let recommendations = await res.json();
    if (recommendations) return recommendations;
    else throw new Error(res);
  } catch (err) {
    console.log(err);
  }
}

export default async function fetchLocationRecommendations(kwd) {
  if (!kwd) return null;
  let domain =
    process.env.REACT_APP_ENV == "dev"
      ? "http://localhost:3000"
      : "https://zungryproxy.onrender.com";
  let url = `${domain}/locationsearch?kwd=${kwd}`;
  try {
    let res = await fetch(url);
    let recommendations = await res.json();
    return recommendations?.data;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchCoords(id) {
  if (!id) return null;
  let domain =
    process.env.REACT_APP_ENV == "dev"
      ? "http://localhost:3000"
      : "https://zungryproxy.onrender.com";
  let url = `${domain}/locateaddress?id=${id}`;
  try {
    let res = await fetch(url);
    let coords = await res.json();
    return coords;
  } catch (err) {
    console.log(err);
  }
}
