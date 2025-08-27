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

export class AssignmentModel {
  // Create new assignment
  static async create(assignmentData) {
    return await addDoc(collection(db, "assignments"), assignmentData);
  }

  // Delete assignment
  static async delete(assignmentId) {
    return await deleteDoc(doc(db, "assignments", assignmentId));
  }

  // Update assignment (for toggle complete)
  static async update(assignmentId, updateData) {
    return await updateDoc(doc(db, "assignments", assignmentId), updateData);
  }

  // Listen to assignments changes (real-time updates)
  static listenToAssignments(callback) {
    return onSnapshot(collection(db, "assignments"), (snapshot) => {
      const assignments = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        dueDate: doc.data().dueDate ? new Date(doc.data().dueDate.seconds * 1000) : null
      }));
      callback(assignments);
    });
  }

  // Get all assignments (one-time read)
  static async getAllAssignments() {
    const snapshot = await getDocs(collection(db, "assignments"));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      dueDate: doc.data().dueDate ? new Date(doc.data().dueDate.seconds * 1000) : null
    }));
  }

  // Get assignments by course
  static async getAssignmentsByCourse(courseId) {
    const snapshot = await getDocs(collection(db, "assignments"));
    return snapshot.docs
      .map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        dueDate: doc.data().dueDate ? new Date(doc.data().dueDate.seconds * 1000) : null
      }))
      .filter(assignment => assignment.courseId === courseId);
  }
}