import { USE_MOCK_API } from "./apiConfig";

// Check if Firebase env vars are available
const hasFirebaseConfig =
  import.meta.env.VITE_API_KEY &&
  import.meta.env.VITE_AUTH_DOMAIN &&
  import.meta.env.VITE_STORAGE_BUCKET &&
  import.meta.env.VITE_MESSAGING_SENDER_ID &&
  import.meta.env.VITE_APP_ID;

// Initialize Firebase only if NOT in mock mode AND config is available
let auth = null;
let db = null;
let storage = null;

// Mock functions that do nothing (for mock mode)
const noop = () => {};
const noopAsync = async () => {};

let createUserWithEmailAndPassword = noopAsync;
let signInWithEmailAndPassword = noopAsync;
let signOut = noopAsync;
let sendPasswordResetEmail = noopAsync;
let onAuthStateChanged = noop;
let updateProfile = noopAsync;
let setDoc = noopAsync;
let doc = noop;
let ref = noop;
let uploadBytes = noopAsync;
let getDownloadURL = noopAsync;

if (!USE_MOCK_API && hasFirebaseConfig) {
  try {
    // Import Firebase modules
    const { initializeApp } = await import("firebase/app");
    const {
      getAuth,
      createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
      signInWithEmailAndPassword: _signInWithEmailAndPassword,
      updateProfile: _updateProfile,
      sendPasswordResetEmail: _sendPasswordResetEmail,
      signOut: _signOut,
      onAuthStateChanged: _onAuthStateChanged,
    } = await import("firebase/auth");
    const {
      getFirestore,
      doc: _doc,
      setDoc: _setDoc,
    } = await import("firebase/firestore");
    const {
      getStorage,
      ref: _ref,
      uploadBytes: _uploadBytes,
      getDownloadURL: _getDownloadURL,
    } = await import("firebase/storage");

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: "portfolio-445d8",
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
      measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Assign real Firebase functions
    createUserWithEmailAndPassword = _createUserWithEmailAndPassword;
    signInWithEmailAndPassword = _signInWithEmailAndPassword;
    signOut = _signOut;
    sendPasswordResetEmail = _sendPasswordResetEmail;
    onAuthStateChanged = _onAuthStateChanged;
    updateProfile = _updateProfile;
    setDoc = _setDoc;
    doc = _doc;
    ref = _ref;
    uploadBytes = _uploadBytes;
    getDownloadURL = _getDownloadURL;

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error.message);
  }
} else {
  if (USE_MOCK_API) {
    console.log("🔧 Mock mode: Skipping Firebase initialization");
  } else {
    console.warn("⚠️ Firebase env vars not found, using mock auth");
  }
}

// Export Firebase instances and functions
export {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  setDoc,
  doc,
  ref,
  uploadBytes,
  getDownloadURL,
};
