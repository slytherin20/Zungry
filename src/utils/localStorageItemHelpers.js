export function removeItemFromStorage(id) {
  let items = window.localStorage.getItem("items");
  let parsedItems = JSON.parse(items);
  if (parsedItems.length == 1) {
    if (parsedItems[0].selectedQty == 1) window.localStorage.clear();
    else {
      parsedItems[0].selectedQty = parsedItems[0].selectedQty - 1;
      window.localStorage.setItem("items", JSON.stringify(parsedItems));
    }
  } else {
    let itemIndex = parsedItems.findIndex((obj) => obj.id == id);
    if (parsedItems[itemIndex].selectedQty == 1) {
      parsedItems = parsedItems.filter((obj) => obj.id != id);
    } else {
      parsedItems[itemIndex].selectedQty =
        parsedItems[itemIndex].selectedQty - 1;
    }
    window.localStorage.setItem("items", JSON.stringify(parsedItems));
  }
}

export function addItemToStorage(item, restaurantInfo) {
  let items = window.localStorage.getItem("items");
  if (!items) {
    item.selectedQty = 1;
    window.localStorage.setItem("items", JSON.stringify([item]));
    window.localStorage.setItem("restaurant", JSON.stringify(restaurantInfo));
  } else {
    items = JSON.parse(items);
    let foundAt = items.findIndex((obj) => obj.id == item.id);
    if (foundAt < 0) {
      item.selectedQty = 1;
      items.push(item);
    } else {
      items[foundAt].selectedQty += 1;
    }
    window.localStorage.setItem("items", JSON.stringify(items));
  }
}

export function removeCustomItemFromStorage(id) {
  let items = window.localStorage.getItem("items");
  items = JSON.parse(items);
  items = items.filter((item) => item.id != id);
  if (items.length == 0) window.localStorage.clear();
  else window.localStorage.setItem("items", JSON.stringify(items));
}

export function updateCustomItemInStorage(id, option) {
  let items = window.localStorage.getItem("items");
  items = JSON.parse(items);
  let itemIndex = items.findIndex((obj) => obj.id == id);
  items[itemIndex].selectedOptions.size = option;
  window.localStorage.setItem("items", JSON.stringify(items));
}
