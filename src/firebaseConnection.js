import { initializeApp } from "firebase/app";
//import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBhsqMR-NxfaoEUJ_bp5lQO-frmdmADMQQ",
  authDomain: "tarefas-31908.firebaseapp.com",
  projectId: "tarefas-31908",
  storageBucket: "tarefas-31908.appspot.com",
  messagingSenderId: "18301344696",
  appId: "1:18301344696:web:38a1c850e3faaf80ea0d4d",
  measurementId: "G-Q6XT0RFXB1"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

  export { db, auth };