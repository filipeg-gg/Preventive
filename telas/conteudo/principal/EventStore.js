import { db, auth } from "../../../firebaseConfig";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export const addEvent = async (event) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  await addDoc(collection(db, "users", user.uid, "events"), {
    ...event,
    createdAt: new Date().toISOString()
  });
};

export const getEvents = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(collection(db, "users", user.uid, "events"));
  const querySnapshot = await getDocs(q);

  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });

  return events;
};