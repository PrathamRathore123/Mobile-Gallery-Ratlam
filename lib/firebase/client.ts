import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { env } from "@/lib/constants/env"

const firebaseConfig = {
  apiKey: env.firebase.apiKey || "demo-api-key",
  authDomain: env.firebase.authDomain || "demo.firebaseapp.com",
  projectId: env.firebase.projectId || "demo-mobile-gallery",
  storageBucket: env.firebase.storageBucket || "demo-mobile-gallery.appspot.com",
  messagingSenderId: env.firebase.messagingSenderId || "000000000000",
  appId: env.firebase.appId || "1:000000000000:web:demo",
  measurementId: env.firebase.measurementId,
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
