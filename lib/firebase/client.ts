import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { env, hasFirebaseEnv } from "@/lib/constants/env"

const isBrowser = typeof window !== "undefined"

if (!hasFirebaseEnv && isBrowser) {
  throw new Error(
    "Firebase configuration is missing. Set NEXT_PUBLIC_FIREBASE_* variables in .env.local (or .env) and restart Next.js."
  )
}

if (hasFirebaseEnv && env.firebase.apiKey === "demo-api-key" && isBrowser) {
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

const shouldInitFirebase = hasFirebaseEnv

export const firebaseApp = shouldInitFirebase
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : (null as never)

export const auth = shouldInitFirebase ? getAuth(firebaseApp) : (null as never)
export const db = shouldInitFirebase ? getFirestore(firebaseApp) : (null as never)

if (process.env.NODE_ENV !== "production" && isBrowser && hasFirebaseEnv) {
  const keyPrefix = env.firebase.apiKey.slice(0, 8)
  console.info(
    `[Firebase] projectId=${env.firebase.projectId} authDomain=${env.firebase.authDomain} apiKeyPrefix=${keyPrefix}`
  )
}
