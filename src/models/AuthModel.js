import { auth, googleProvider } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';

export class AuthModel {
  // Email/Password Login
  static async loginWithEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  // Email/Password Registration
  static async registerWithEmail(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  // Google Sign-In
  static async loginWithGoogle() {
    return await signInWithPopup(auth, googleProvider);
  }

  // Logout
  static async logout() {
    return await signOut(auth);
  }

  // Get Current User
  static getCurrentUser() {
    return auth.currentUser;
  }
}