import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  updateDoc,
  getDocs 
} from 'firebase/firestore';

export class ExamModel {
  // Create new exam
  static async create(examData) {
    return await addDoc(collection(db, "exams"), examData);
  }

  // Delete exam
  static async delete(examId) {
    return await deleteDoc(doc(db, "exams", examId));
  }

  // Update exam (for toggle complete)
  static async update(examId, updateData) {
    return await updateDoc(doc(db, "exams", examId), updateData);
  }

  // Listen to exams changes (real-time updates)
  static listenToExams(callback) {
    return onSnapshot(collection(db, "exams"), (snapshot) => {
      const exams = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        examDate: doc.data().examDate ? new Date(doc.data().examDate.seconds * 1000) : null
      }));
      callback(exams);
    });
  }

  // Get all exams (one-time read)
  static async getAllExams() {
    const snapshot = await getDocs(collection(db, "exams"));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      examDate: doc.data().examDate ? new Date(doc.data().examDate.seconds * 1000) : null
    }));
  }

  // Get exams by course
  static async getExamsByCourse(courseId) {
    const snapshot = await getDocs(collection(db, "exams"));
    return snapshot.docs
      .map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        examDate: doc.data().examDate ? new Date(doc.data().examDate.seconds * 1000) : null
      }))
      .filter(exam => exam.courseId === courseId);
  }
}