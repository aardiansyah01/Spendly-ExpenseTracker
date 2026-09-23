import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAMGNXcOdHdDdtvDwJqeGbZ-TnVb6tDbJE",
    authDomain: "spendly-5da0e.firebaseapp.com",
    databaseURL:
        "https://spendly-5da0e-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "spendly-5da0e",
    storageBucket: "spendly-5da0e.firebasestorage.app",
    messagingSenderId: "446167493232",
    appId: "1:446167493232:web:6178dea504025a2d4162b5",
    measurementId: "G-K3NZMQV88G",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getDatabase(app);

export default app;
