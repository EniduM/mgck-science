import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVwx-HwLnD_rCnV0DKOOEQ19B5jO5_pdc",
  authDomain: "mgck-science.firebaseapp.com",
  projectId: "mgck-science",
  storageBucket: "mgck-science.firebasestorage.app",
  messagingSenderId: "1060382814769",
  appId: "1:1060382814769:web:ca3c9fde1c9dfeb7ff1b10",
};

// Avoid re-initializing on hot-reloads / SSR module re-evaluation
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Use persistent local cache (IndexedDB) when running in a real browser so
// reads work even when the network is briefly unavailable.  Fall back to the
// default in-memory cache during SSR / pre-rendering (no IndexedDB there).
let db: Firestore;
try {
  if (typeof window !== "undefined") {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } else {
    db = getFirestore(app);
  }
} catch {
  // initializeFirestore throws if called a second time on the same app
  // instance – fall back to getFirestore() which returns the existing instance.
  db = getFirestore(app);
}

export { db };
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
