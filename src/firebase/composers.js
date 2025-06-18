import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  limit,
  startAfter,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

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

export const getComposersByName = async (params = {}) => {
  const composersRef = collection(db, "composers");
  const snapshot = await getDocs(composersRef);

  const allComposers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!params.search) return allComposers;

  const search = params.search.toLowerCase();

  return allComposers.filter((composer) =>
    composer.name?.toLowerCase().includes(search)
  );
};

export async function updateComposer(docId, updateFields) {
  const docRef = doc(db, "composers", docId);

  const sanitized = Object.fromEntries(
    Object.entries(updateFields).filter(([_, v]) => v !== undefined)
  );

  try {
    await updateDoc(docRef, sanitized);

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

export async function getComposerById(id) {
  if (!id) throw new Error("ID is required");

  const composerDoc = doc(db, "composers", id);
  const snapshot = await getDoc(composerDoc);

  if (!snapshot.exists()) {
    throw new Error(`Composer with ID ${id} not found`);
  }

  return { id: snapshot.id, ...snapshot.data() };
}

export async function composerAudioBio({ composerId, file, lang }) {
  if (!composerId || !file || !lang) {
    throw new Error("composerId, file или lang не указаны");
  }

  try {
    const filePath = `audios/${composerId}/${lang}.mp3`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    // 2. Обновляем composer с полем вроде 'ruAudioBio'
    const composerRef = doc(db, "composers", composerId);
    const fieldName = `${lang}AudioBio`;

    await updateDoc(composerRef, {
      [fieldName]: downloadUrl,
      updatedAt: serverTimestamp(),
    });

    console.log(`Поле ${fieldName} обновлено`);
    return downloadUrl;
  } catch (error) {
    console.error("Ошибка при сохранении аудио:", error);
    throw error;
  }
}
