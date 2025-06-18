import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  getDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

export async function createAudio({ composerId, text, file }) {
  try {
    if (!composerId || !file) {
      throw new Error("Не указан composerId или файл");
    }

    const cleanFileName = encodeURIComponent(file.name); // безопасное имя
    const storagePath = `audios/${composerId}/${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "audios"), {
      composerId,
      title: text,
      audioLink: url,
      storagePath, // <--- сохраняем путь
      active: false,
      createdAt: new Date(),
    });

    console.log("Аудиозапись успешно добавлена с ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении аудио:", error);
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

export async function updateAudio(audioId, data) {
  const docRef = doc(db, "audios", audioId);
  await updateDoc(docRef, {
    title: data.text,
    updatedAt: new Date(),
  });
}

export async function deleteAudio(audioId) {
  try {
    if (!audioId) throw new Error("audioId is required");

    const audioRef = doc(db, "audios", audioId);
    const snapshot = await getDoc(audioRef);

    if (!snapshot.exists()) {
      throw new Error("Аудио не найдено");
    }

    const audioData = snapshot.data();

    if (audioData.storagePath) {
      const fileRef = ref(storage, audioData.storagePath);
      await deleteObject(fileRef);
    }

    await deleteDoc(audioRef);
    console.log("Аудио удалено:", audioId);
    return true;
  } catch (error) {
    console.error("Ошибка при удалении аудио:", error);
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

export async function getAudiosByComposer(composerId) {
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
