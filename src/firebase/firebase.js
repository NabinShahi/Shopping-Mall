import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAvvunEGs89oZbyowTK2ycCzk0eA_1Xzp0",
  authDomain: "mall-b3667.firebaseapp.com",
  projectId: "mall-b3667",
  storageBucket: "mall-b3667.appspot.com",
  messagingSenderId: "78652455227",
  appId: "1:78652455227:web:2e0bf5529a14810591df1e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();

export const findMall = (id) => {
  return db.collection("mall").doc(id).get();
};

export const findMalls = () => {
  return db.collection("mall").get();
};

export const deleteMall = (id) => {
  return db.collection("mall").doc(id).delete();
};

export const deleteShopFromMall = (id, shops) => {
  return db.collection("mall").doc(id).update({ shops });
};

export const addShopImages = () => {
  return storage;
};

export const removeMallImages = async (images) => {
  await Promise.all(
    images?.map((image, i) => storage.ref(images[i]).delete())
  );
};

export const removeShopImageFromMallShop = async (images) => {
  await Promise.all(
    images?.map((image, i) => storage.ref(image).delete())
  );
};

export const removeShopImageFromShopDetail = async (image) => {
  await storage.ref(image).delete();
};

// export const addShopImages = () => {
//   return storage;
// };

export { storage, db };
