import { AuthModel } from '../models/AuthModel';

export class AuthController {
  // Login with Email/Password
  static async login(email, password) {
    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    // Business logic
    return await AuthModel.loginWithEmail(email, password);
  }

  // Register with Email/Password
  static async register(email, password) {
    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    // Business logic
    return await AuthModel.registerWithEmail(email, password);
  }

  // Google Sign-In
  static async googleSignIn() {
    return await AuthModel.loginWithGoogle();
  }

  // Logout
  static async logout() {
    return await AuthModel.logout();
  }

  // Get Current User
  static getCurrentUser() {
    return AuthModel.getCurrentUser();
  }
}