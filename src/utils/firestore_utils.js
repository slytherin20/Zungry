import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase_config.mjs";
export async function addToDBCart(item, userid) {
  let docSnap = await getDoc(doc(db, "Users", userid, "cart", item.id));
  if (docSnap.exists()) {
    updateCartItemInDB(userid, item.id, docSnap.data().selectedQty);
  } else {
    item.selectedQty = 1;
    await setDoc(doc(db, "Users", userid, "cart", item.id), item);
  }
}

export async function addRestaurantToDB(restaurantInfo, userid) {
  try {
    await setDoc(
      doc(db, "Users", userid, "restaurantInfo", "restaurant"),
      restaurantInfo
    );
    return true;
  } catch (err) {
    console.log(err);
  }
}

export async function updateCartItemInDB(uid, itemId, count) {
  const cartRef = doc(db, "Users", uid, "cart", itemId);
  await updateDoc(cartRef, {
    selectedQty: count,
  });
}
export async function getItemsFomDB(uid) {
  const cartRef = collection(db, "Users", uid, "cart");
  let querySnapshot = await getDocs(cartRef);
  let items = [];
  querySnapshot.forEach((doc) => items.push(doc.data()));
  return items;
}
export async function getRestaurant(uid) {
  let restaurantInfo = await getDoc(
    doc(db, "Users", uid, "restaurantInfo", "restaurant")
  );
  return restaurantInfo;
}

export async function clearDB(uid) {
  const cartRef = collection(db, "Users", uid, "cart");
  let querySnapshotCart = await getDocs(cartRef);
  let itemsId = [];
  querySnapshotCart.forEach((doc) => itemsId.push(doc.id));
  itemsId.forEach(async (id) => {
    await deleteDoc(doc(db, "Users", uid, "cart", id));
  });
  await deleteRestaurantFromDB(uid);
  return true;
}

export async function updateCustomizedItemInDB(uid, itemId, option) {
  const cartRef = doc(db, "Users", uid, "cart", itemId);
  await updateDoc(cartRef, {
    selectedOptions: {
      size: option,
    },
  });
}

export async function deleteItemFromDB(uid, id) {
  await deleteDoc(doc(db, "Users", uid, "cart", id));
}

export async function deleteRestaurantFromDB(uid) {
  await deleteDoc(doc(db, "Users", uid, "restaurantInfo", "restaurant"));
}

export async function createOrder(uid, orderId, items, restaurantInfo, amount) {
  try {
    let order = {
      id: orderId,
      items: items,
      restaurant: {
        id: restaurantInfo.id,
        location: restaurantInfo.latLong,
        name: restaurantInfo.name,
        locality: restaurantInfo.locality,
      },
      status: "pending",
      totalAmount: amount,
    };
    const orderRef = doc(db, "Users", uid, "orders", orderId);
    await setDoc(orderRef, order);
  } catch (err) {
    console.log("Error creating order", err.message);
  }
}

export async function saveAccountDetails(uid, details) {
  try {
    let accountRef = doc(db, "Users", uid, "Account", "account");
    await setDoc(accountRef, details);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function getOrdersList(uid) {
  try {
    let orders = [];
    let ordersRef = collection(db, "Users", uid, "orders");
    const q = query(ordersRef, where("status", "!=", "pending"));
    let docs = await getDocs(q);
    docs.forEach((doc) => orders.push(doc.data()));
    return orders;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function addOrderRating(uid, orderId, val) {
  let orderRef = doc(db, "Users", uid, "orders", orderId);
  await updateDoc(orderRef, {
    rating: val,
  });
}
