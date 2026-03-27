function readEnv(name: string): string {
  return process.env[name] ?? ""
}

export const env = {
  firebase: {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  cloudinary: {
    cloudName: readEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
    uploadPreset: readEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"),
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "mobile-gallery",
  },
}

export const hasFirebaseEnv =
  Boolean(env.firebase.apiKey) &&
  Boolean(env.firebase.authDomain) &&
  Boolean(env.firebase.projectId) &&
  Boolean(env.firebase.storageBucket) &&
  Boolean(env.firebase.messagingSenderId) &&
  Boolean(env.firebase.appId)
