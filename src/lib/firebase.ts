import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBomB9wJgiQcwB9TUpE-NobSUGPRysAneU",
    authDomain: "pip-metric.firebaseapp.com",
    projectId: "pip-metric",
    storageBucket: "pip-metric.firebasestorage.app",
    messagingSenderId: "16549216806",
    appId: "1:16549216806:web:ffd1bbe0d253eb6bc55ce7"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
