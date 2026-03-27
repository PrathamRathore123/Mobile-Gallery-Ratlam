# Mobile Gallery - Firebase + Cloudinary Setup

## 1) Firebase project setup
1. Create a Firebase project.
2. Enable Authentication -> Email/Password.
3. Create Firestore database in production mode.
4. In Project Settings -> Web Apps, create a web app and copy config values.

## 2) Environment variables
1. Copy `.env.example` to `.env.local`.
2. Fill all `NEXT_PUBLIC_FIREBASE_*` values from Firebase web app config.
3. Add Cloudinary values:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## 3) Firestore rules + indexes
Use Firebase CLI in this project root:

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Rules file: `firestore.rules`
Indexes file: `firestore.indexes.json`

## 4) Seed first admin user
Because writes are admin-protected by rules, create first admin directly in Firebase Console:

1. Create an auth user in Authentication (Email/Password).
2. Copy that user UID.
3. In Firestore, create document:
   - Collection: `admins`
   - Document ID: `<auth-uid>`
   - Fields:
     - `uid` (string)
     - `email` (string)
     - `role` (string, `owner` or `manager`)
     - `active` (boolean, true)
     - `createdAt` (timestamp)

After this, login at `/admin/login` with that auth account.

## 5) Settings seed (recommended)
Create `settings/main` document:
- `businessName`
- `whatsappNumber`
- `instagramUrl`
- `heroTitle`
- `heroSubtitle`
- `supportText`
- `updatedAt` (timestamp)

## 6) Cloudinary setup
1. Create an unsigned upload preset in Cloudinary.
2. Restrict allowed formats and size in Cloudinary dashboard.
3. Use that preset name in `.env.local`.

## 7) Local run + validation
```bash
npm install
npm run lint
npm run dev
```

## 8) Deploy to Vercel
1. Import project to Vercel.
2. Add all `.env.local` variables in Vercel Project Settings -> Environment Variables.
3. Deploy.
