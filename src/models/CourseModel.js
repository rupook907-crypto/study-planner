import { db } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';

export class CourseModel {
  // Create new course
  static async create(courseData) {
    return await addDoc(collection(db, "courses"), courseData);
  }

  // Delete course
  static async delete(courseId) {
    return await deleteDoc(doc(db, "courses", courseId));
  }

  // Listen to courses changes (real-time updates)
  static listenToCourses(callback) {
    return onSnapshot(collection(db, "courses"), (snapshot) => {
      const courses = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(courses);
    });
  }

  // Get all courses (one-time read)
  static async getAllCourses() {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  }
}