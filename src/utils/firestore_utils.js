import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
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
  await setDoc(
    doc(db, "Users", userid, "restaurantInfo", "restaurant"),
    restaurantInfo
  );
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

export async function createOrder(uid, orderId, items, restaurantInfo) {
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

export async function getAccountDetails(uid) {
  let accountRef = doc(db, "Users", uid, "Account", "account");
  let res = await getDoc(accountRef);
  let accountDetails = res.data();
  return accountDetails;
}