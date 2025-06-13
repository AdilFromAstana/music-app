import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  limit,
  startAfter,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export const getVideos = async (query) => {
  const videosRef = collection(db, "videos");
  const snapshot = await getDocs(videosRef);

  const allVideos = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!query || query.trim() === "") {
    return allVideos;
  }

  const q = query.toLowerCase();
  return allVideos.filter((video) => video.title.toLowerCase().includes(q));
};

export const getVideoById = async (id) => {
  if (!id) return null;

  const videoRef = doc(db, "videos", id);
  const videoSnap = await getDoc(videoRef);

  if (videoSnap.exists()) {
    return { id: videoSnap.id, ...videoSnap.data() };
  }

  return null;
};

export async function createVideo(values) {
  try {
    const docRef = await addDoc(collection(db, "videos"), {
      ...values,
      createdAt: new Date(),
    });

    console.log("Видео успешно добавлена с ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении видео:", error);
    throw error;
  }
}

export const getPaginatedVideos = async (pageSize = 10, lastDoc = null) => {
  const videosRef = collection(db, "videos");

  let q = query(videosRef, orderBy("createdAt", "desc"), limit(pageSize));

  if (lastDoc) {
    q = query(
      videosRef,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);

  const videos = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { videos, lastVisible };
};
