import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmP2wIoUAJzRM2HN9hXjtB2R3bKi_HxcM",
  authDomain: "music-school-e9b92.firebaseapp.com",
  projectId: "music-school-e9b92",
  storageBucket: "music-school-e9b92.firebasestorage.app",
  messagingSenderId: "979984365304",
  appId: "1:979984365304:web:5ed1ae5c85f188fe5c6d0d",
  measurementId: "G-4YFQ33LBFW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getComposers() {
  const composersCol = collection(db, "composers");
  const snapshot = await getDocs(composersCol);
  const composers = snapshot.docs.map((doc) => ({
    id: doc.id, // ✅ Добавляем docId
    ...doc.data(), // ✅ Добавляем все данные документа
  }));
  return composers;
}

export async function getComposersPag(pageSize = 5, lastVisible = null) {
  let composersQuery = query(collection(db, "composers"), limit(pageSize));

  if (lastVisible) {
    composersQuery = query(composersQuery, startAfter(lastVisible));
  }

  try {
    const snapshot = await getDocs(composersQuery);
    const composers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // Сохраняем последний документ для пагинации
    console.log("lastDoc: ", lastDoc);
    console.log("composers: ", composers);

    return { composers, lastDoc };
  } catch (error) {
    console.error("Error fetching composers:", error);
  }
}

export async function updateComposer(docId, updateFields) {
  const docRef = doc(db, "composers", docId);

  try {
    await updateDoc(docRef, updateFields); // Обновляем документ
    console.log("Document updated successfully!");

    const updatedDocSnap = await getDoc(docRef); // Получаем обновленный документ
    if (updatedDocSnap.exists()) {
      const updatedData = { id: docId, ...updatedDocSnap.data() };
      console.log("Updated Composer:", updatedData);
      return updatedData; // ✅ Возвращаем обновленный объект
    } else {
      console.error("Document does not exist after update.");
      return null;
    }
  } catch (error) {
    console.error("Error updating document:", error);
    return null;
  }
}

export async function createComposer(values) {
  try {
    const docRef = await addDoc(collection(db, "composers"), values);
    console.log("Город успешно добавлен с ID:", docRef.id);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}
