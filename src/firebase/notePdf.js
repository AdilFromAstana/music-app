import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebase";

export async function createNotePdf({ composerId, text, file }) {
  try {
    if (!composerId || !file) {
      throw new Error("Не указан composerId или файл");
    }

    const storageRef = ref(storage, `notePdfs/${composerId}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "notePdfs"), {
      composerId,
      title: text,
      notePdfLink: url,
      active: false,
      createdAt: new Date(),
    });

    console.log("ПДФ успешно добавлен с ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении ПДФ:", error);
    throw error;
  }
}

export async function getNotePdfById(id) {
  console.log("id: ", id);
  if (!id) throw new Error("ID is required");

  const notePdfDoc = doc(db, "notePdfs", id);
  const snapshot = await getDoc(notePdfDoc);

  if (!snapshot.exists()) {
    throw new Error(`notePdfs with ID ${id} not found`);
  }

  return { id: snapshot.id, ...snapshot.data() };
}

export async function getNotePdfs() {
  const compositionsCol = collection(db, "notePdfs");
  const snapshot = await getDocs(compositionsCol);
  const compositions = snapshot.docs.map((doc) => ({
    id: doc.id, // ✅ Добавляем docId
    ...doc.data(), // ✅ Добавляем все данные документа
  }));
  console.log("compositions: ", compositions);
  return compositions;
}
