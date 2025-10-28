import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole } from '../constants/roles';
import { UserProfile } from '../types/user';

// User profile interface
export interface AuthUserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  teamId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication service
class AuthService {
  // Sign up with email and password
  async signUp(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<UserCredential> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name
      const displayName = `${firstName} ${lastName}`;
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: AuthUserProfile = {
        uid: user.uid,
        email: email,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        role: 'user', // Default role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<AuthUserProfile>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user authenticated');

    try {
      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      // Update auth profile if display name changed
      if (updates.displayName) {
        await updateProfile(user, { displayName: updates.displayName });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user email
  async updateUserEmail(newEmail: string, password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user authenticated');

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update email error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user password
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user authenticated');

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Update password error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<AuthUserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as AuthUserProfile;
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<AuthUserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return this.getUserProfile(user.uid);
  }

  // Update user role (admin only)
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update user role error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Delete user account
  async deleteUserAccount(password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user authenticated');

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user profile from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete user from Auth
      await user.delete();
    } catch (error) {
      console.error('Delete user account error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Check if user has admin role
  async isUserAdmin(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Check admin role error:', error);
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Error handler for Firebase Auth errors
  private handleAuthError(error: any): Error {
    let errorMessage = 'An unexpected error occurred';

    switch (error.code) {
      // Sign up errors
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;

      // Sign in errors
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;

      // Network errors
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;

      // Re-authentication errors
      case 'auth/requires-recent-login':
        errorMessage = 'Please sign in again to perform this action';
        break;

      // General errors
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credential';
        break;
      case 'auth/invalid-verification-code':
        errorMessage = 'Invalid verification code';
        break;
      case 'auth/invalid-verification-id':
        errorMessage = 'Invalid verification ID';
        break;

      default:
        errorMessage = error.message || errorMessage;
        break;
    }

    return new Error(errorMessage);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Default export
export default authService;