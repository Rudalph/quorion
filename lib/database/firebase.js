import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7lTSlutGQPqENKyddSIM-BI1f8CLIoXM",
  authDomain: "quantumseal-beba1.firebaseapp.com",
  projectId: "quantumseal-beba1",
  storageBucket: "quantumseal-beba1.firebasestorage.app",
  messagingSenderId: "964622173909",
  appId: "1:964622173909:web:861e617cfe8694ebddc45c",
  measurementId: "G-ZHYBQV93CG"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);