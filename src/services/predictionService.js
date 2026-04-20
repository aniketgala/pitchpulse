import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';

const PREDICTIONS_COLLECTION = 'predictions';

export const addPrediction = async (userId, userEmail, predictionData) => {
  try {
    const docRef = await addDoc(collection(db, PREDICTIONS_COLLECTION), {
      userId,
      userEmail,
      ...predictionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0
    });
    return { id: docRef.id, ...predictionData };
  } catch (error) {
    console.error("Firestore Add Error:", error);
    throw new Error("Could not save prediction. Check Firestore rules.");
  }
};

export const getPredictions = async () => {
  try {
    const q = query(collection(db, PREDICTIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Firestore Get Error:", error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
};

export const deletePrediction = async (id) => {
  try {
    await deleteDoc(doc(db, PREDICTIONS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting prediction: ", error);
    return false;
  }
};

export const updatePrediction = async (id, updateData) => {
  try {
    const docRef = doc(db, PREDICTIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating prediction: ", error);
    return false;
  }
};

// --- Commenting Features ---

export const addComment = async (predictionId, userId, userEmail, commentText) => {
  try {
    const commentsRef = collection(db, PREDICTIONS_COLLECTION, predictionId, 'comments');
    const docRef = await addDoc(commentsRef, {
      userId,
      userEmail,
      text: commentText,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, text: commentText, userEmail };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not post comment.");
  }
};

export const getComments = async (predictionId) => {
  try {
    const commentsRef = collection(db, PREDICTIONS_COLLECTION, predictionId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
