import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDFI783y_w-PJA6Y1hzjwn4aTwFnog5c94",
    authDomain: "agromarketapp-8344f.firebaseapp.com",
    projectId: "agromarketapp-8344f",
    storageBucket: "agromarketapp-8344f.firebasestorage.app",
    messagingSenderId: "620778540934",
    appId: "1:620778540934:web:c1d7a4545015fa51d9a607",
    measurementId: "G-RV36384C3P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);