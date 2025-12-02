import { createContext, useState, useEffect } from "react";
import { USE_MOCK_API } from "../config/apiConfig";
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "../config/firebaseConfig";
import {
  mockAuth,
  mockSignInWithEmailAndPassword,
  mockSignOut,
  mockOnAuthStateChanged,
} from "../mocks/mockAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Initializing auth...", { USE_MOCK_API, hasAuth: !!auth });
    
    // Use mock auth if in mock mode OR if Firebase auth is not available
    if (USE_MOCK_API || !auth) {
      console.log("[AuthProvider] Using mock auth");
      const unsubscribe = mockOnAuthStateChanged(mockAuth, (user) => {
        console.log("[AuthProvider] Mock auth state changed:", user);
        setCurrentUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Use real Firebase auth
      console.log("[AuthProvider] Using real Firebase auth");
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("[AuthProvider] Firebase auth state changed:", user);
          setCurrentUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("[AuthProvider] Firebase auth error, falling back to mock:", error);
        // Fallback to mock auth if Firebase fails
        const unsubscribe = mockOnAuthStateChanged(mockAuth, (user) => {
          setCurrentUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      }
    }
  }, []);

  const login = async (email, password) => {
    console.log("[AuthProvider] Login attempt:", { email, USE_MOCK_API, hasAuth: !!auth });
    
    // Use mock auth if in mock mode OR if Firebase auth is not available
    if (USE_MOCK_API || !auth) {
      const result = await mockSignInWithEmailAndPassword(mockAuth, email, password);
      setCurrentUser(result.user);
      return result;
    }
    
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("[AuthProvider] Firebase login error, falling back to mock:", error);
      // Fallback to mock auth if Firebase fails
      const result = await mockSignInWithEmailAndPassword(mockAuth, email, password);
      setCurrentUser(result.user);
      return result;
    }
  };

  const logout = async () => {
    console.log("[AuthProvider] Logout");
    
    // Use mock auth if in mock mode OR if Firebase auth is not available
    if (USE_MOCK_API || !auth) {
      await mockSignOut(mockAuth);
      setCurrentUser(null);
      return;
    }
    
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("[AuthProvider] Firebase logout error, using mock:", error);
      await mockSignOut(mockAuth);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
