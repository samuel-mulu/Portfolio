// Mock Firebase Auth for development
// Provides mock authentication functions when in mock mode

import { USE_MOCK_API } from "../config/apiConfig";
import { delay } from "./mockData";

// Mock user object
const mockUser = {
  uid: "mock-user-123",
  email: "admin@example.com",
  displayName: "Admin User",
  emailVerified: true,
};

// Mock auth object
export const mockAuth = {
  currentUser: USE_MOCK_API ? mockUser : null,
};

// Mock signInWithEmailAndPassword
export const mockSignInWithEmailAndPassword = async (auth, email, password) => {
  await delay(500);
  if (USE_MOCK_API) {
    // Accept any credentials in mock mode
    return {
      user: mockUser,
    };
  }
  throw new Error("Mock auth disabled");
};

// Mock signOut
export const mockSignOut = async (auth) => {
  await delay(200);
  if (USE_MOCK_API) {
    return Promise.resolve();
  }
  throw new Error("Mock auth disabled");
};

// Mock onAuthStateChanged
export const mockOnAuthStateChanged = (auth, callback) => {
  if (USE_MOCK_API) {
    // Immediately call callback with mock user
    setTimeout(() => {
      callback(mockUser);
    }, 100);
    // Return unsubscribe function
    return () => {};
  }
  throw new Error("Mock auth disabled");
};

