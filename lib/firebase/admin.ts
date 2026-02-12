import { initializeApp, getApps, cert, applicationDefault, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount
  : undefined;

// Use Application Default Credentials if no service account key is provided
// This works in Cloud Run (uses attached service account) and locally (uses gcloud auth)
const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export default adminApp;
