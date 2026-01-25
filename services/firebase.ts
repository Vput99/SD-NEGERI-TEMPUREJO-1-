
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase untuk SD Negeri Tempurejo 1
const firebaseConfig = {
  apiKey: "AIzaSyAWURfW_cpo7fTHZLvGjLDb0Cdeiegabvg",
  authDomain: "sd-negeri-tempurejo-1-a204d.firebaseapp.com",
  projectId: "sd-negeri-tempurejo-1-a204d",
  storageBucket: "sd-negeri-tempurejo-1-a204d.firebasestorage.app",
  messagingSenderId: "78798554581",
  appId: "1:78798554581:web:a8f6fe0b26c1e9b381695c",
  measurementId: "G-2GL06D6TWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
