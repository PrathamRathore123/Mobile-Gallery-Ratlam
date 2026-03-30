import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { env, hasFirebaseEnv } from "@/lib/constants/env"

if (!hasFirebaseEnv) {
  throw new Error(
    "Firebase configuration is missing. Set NEXT_PUBLIC_FIREBASE_* variables in .env.local (or .env) and restart Next.js."
  )
}

if (env.firebase.apiKey === "demo-api-key") {
  throw new Error(
    "Invalid Firebase API key detected (demo-api-key). Check your env files and restart Next.js."
  )
}

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId,
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const keyPrefix = env.firebase.apiKey.slice(0, 8)
  console.info(
    `[Firebase] projectId=${env.firebase.projectId} authDomain=${env.firebase.authDomain} apiKeyPrefix=${keyPrefix}`
  )
}
