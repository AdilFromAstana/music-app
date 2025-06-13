import { db } from "./firebase";
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
} from "firebase/firestore";

export async function getSupplierPerformers() {
  const supplierPerformersCol = collection(db, "supplierPerformers");
  const snapshot = await getDocs(supplierPerformersCol);
  const supplierPerformers = snapshot.docs.map((doc) => ({
    id: doc.id, // ✅ Добавляем docId
    ...doc.data(), // ✅ Добавляем все данные документа
  }));
  console.log("supplierPerformers: ", supplierPerformers);
  return supplierPerformers;
}

export async function getSupplierPerformersPag(
  pageSize = 5,
  lastVisible = null
) {
  let supplierPerformersQuery = query(
    collection(db, "supplierPerformers"),
    limit(pageSize)
  );

  if (lastVisible) {
    supplierPerformersQuery = query(
      supplierPerformersQuery,
      startAfter(lastVisible)
    );
  }

  try {
    const snapshot = await getDocs(supplierPerformersQuery);
    const supplierPerformers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // Сохраняем последний документ для пагинации
    console.log("lastDoc: ", lastDoc);
    console.log("supplierPerformers: ", supplierPerformers);

    return { supplierPerformers, lastDoc };
  } catch (error) {
    console.error("Error fetching supplierPerformers:", error);
  }
}

export const getSupplierPerformerByName = async (params = {}) => {
  const supplierPerformersRef = collection(db, "supplierPerformers");
  const snapshot = await getDocs(supplierPerformersRef);

  const allSupplierPerformers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!params.search) return allSupplierPerformers;

  const search = params.search.toLowerCase();

  return allSupplierPerformers.filter((supplierPerformer) =>
    supplierPerformer.name?.toLowerCase().includes(search)
  );
};

export async function updateSupplierPerformer(docId, updateFields) {
  const docRef = doc(db, "supplierPerformers", docId);

  try {
    await updateDoc(docRef, updateFields);
    console.log("Document updated successfully!");

    const updatedDocSnap = await getDoc(docRef);
    if (updatedDocSnap.exists()) {
      const updatedData = { id: docId, ...updatedDocSnap.data() };
      console.log("Updated SupplierPerformer:", updatedData);
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

export async function createSupplierPerformer(values) {
  try {
    const docRef = await addDoc(collection(db, "supplierPerformers"), values);
    console.log("Композитор успешно добавлен с ID:", docRef.id);
  } catch (error) {
    console.error("Ошибка при создании города:", error);
    throw error;
  }
}

export async function getSupplierPerformerById(id) {
  if (!id) throw new Error("ID is required");

  const supplierPerformerDoc = doc(db, "supplierPerformers", id);
  const snapshot = await getDoc(supplierPerformerDoc);

  if (!snapshot.exists()) {
    throw new Error(`SupplierPerformer with ID ${id} not found`);
  }

  return { id: snapshot.id, ...snapshot.data() };
}
