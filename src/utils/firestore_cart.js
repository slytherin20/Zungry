import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase_config";
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
    selectedQty: count + 1,
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
  const ref = collection(db, "Users", uid, "restaurantInfo");
  let querySnapshot = await getDocs(ref);
  let restaurantInfo;
  querySnapshot.forEach((doc) => (restaurantInfo = doc.data()));
  return restaurantInfo;
}

export async function clearDB(uid) {
  const restRef = collection(db, "Users", uid, "restaurantInfo");
  const cartRef = collection(db, "Users", uid, "cart");
  let querySnapshotCart = await getDocs(cartRef);
  let querySnapshotRest = await getDocs(restRef);
  let restId = querySnapshotRest.forEach((doc) => doc.id);
  let itemsId = [];
  querySnapshotCart.forEach((doc) => itemsId.push(doc.id));
  itemsId.forEach(async (id) => {
    await deleteDoc(doc(db, "Users", uid, "cart", id));
  });
  await deleteDoc(doc(db, "Users", uid, "restaurantInfo", restId));
}
