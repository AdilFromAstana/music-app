import { setDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

const NOTE_PDF_ID = "C6Ukv0P8NWNzt7TJSd51"; // фиксированный ID

export async function createNotePdf({ file }) {
  if (!file) throw new Error("Файл обязателен");

  const storagePath = `notePdfs/${NOTE_PDF_ID}.pdf`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const docRef = doc(db, "notePdfs", NOTE_PDF_ID);
  await setDoc(docRef, {
    notePdfLink: url,
    updatedAt: new Date(),
  });

  return NOTE_PDF_ID;
}

export async function getNotePdfById() {
  const docRef = doc(db, "notePdfs", NOTE_PDF_ID);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function deleteNotePdf() {
  const filePath = `notePdfs/${NOTE_PDF_ID}.pdf`;
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);

  const docRef = doc(db, "notePdfs", NOTE_PDF_ID);
  await deleteDoc(docRef);
}
