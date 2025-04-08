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
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSKG4HTK0TVLZYy0wYtyZfTu2Dsv4rQMs",
  authDomain: "test-backend-fbf6b.firebaseapp.com",
  databaseURL:
    "https://test-backend-fbf6b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-backend-fbf6b",
  storageBucket: "test-backend-fbf6b.appspot.com",
  messagingSenderId: "332032628708",
  appId: "1:332032628708:web:a999e6175540817a74d9f1",
  measurementId: "G-J69K1WK6GJ",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export async function getComposers() {
  const composersCol = collection(db, "composers");
  const snapshot = await getDocs(composersCol);
  const composers = snapshot.docs.map((doc) => ({
    id: doc.id, // ✅ Добавляем docId
    ...doc.data(), // ✅ Добавляем все данные документа
  }));
  console.log("composers: ", composers);
  return composers;
}

export async function getComposerById(id) {
  if (!id) throw new Error("ID is required");

  const composerDoc = doc(db, "composers", id);
  const snapshot = await getDoc(composerDoc);

  if (!snapshot.exists()) {
    throw new Error(`Composer with ID ${id} not found`);
  }

  return { id: snapshot.id, ...snapshot.data() };
}

export async function getAudiosByComposer(composerId) {
  console.log("composerId: ", composerId);
  if (!composerId) throw new Error("composerId is required");

  const audiosQuery = query(
    collection(db, "audios"),
    where("composerId", "==", composerId)
  );

  const snapshot = await getDocs(audiosQuery);

  if (snapshot.empty) {
    return []; // Возвращаем пустой массив, если ничего не найдено
  }

  const audios = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("audios: ", audios);

  return audios;
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
    await updateDoc(docRef, updateFields);
    console.log("Document updated successfully!");

    const updatedDocSnap = await getDoc(docRef);
    if (updatedDocSnap.exists()) {
      const updatedData = { id: docId, ...updatedDocSnap.data() };
      console.log("Updated Composer:", updatedData);
      return updatedData;
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
    console.log("Композитор успешно добавлен с ID:", docRef.id);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}

export async function createAudio({ composerId, text, file }) {
  try {
    if (!composerId || !file) {
      throw new Error("Не указан composerId или файл");
    }

    // 1. Загружаем файл в Firebase Storage
    const storageRef = ref(storage, `audios/${composerId}`);
    await uploadBytes(storageRef, file);

    // 2. Получаем ссылку на файл
    const url = await getDownloadURL(storageRef);

    // 3. Сохраняем в Firestore
    const docRef = await addDoc(collection(db, "audios"), {
      composerId,
      title: text,
      audioLink: url,
      active: true,
      fileName: file.name,
      createdAt: new Date(),
    });

    console.log("Аудиозапись успешно добавлена с ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении аудио:", error);
    throw error;
  }
}

export async function toggleAudioStatus(audioId) {
  try {
    const docRef = doc(db, "audio", audioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Документ не найден");
    }

    const currentStatus = docSnap.data().active ?? false;
    const newStatus = !currentStatus;

    await updateDoc(docRef, { active: newStatus });

    const updatedDocSnap = await getDoc(docRef);
    if (updatedDocSnap.exists()) {
      const updatedData = { id: audioId, ...updatedDocSnap.data() };
      console.log("Обновлённый аудио:", updatedData);
      return updatedData;
    }
  } catch (error) {
    console.error("Ошибка при обновлении статуса аудио:", error);
    throw error;
  }
}

export async function uploadAudio(values) {
  try {
    console.log("Город успешно добавлен с ID:", values);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}

export async function updateAudio(values) {
  try {
    console.log("Город успешно добавлен с ID:", values);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}

export async function deleteAudio(values) {
  try {
    console.log("Город успешно добавлен с ID:", values);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}
