import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missingKeys.length > 0) {
  document.body.style.cssText = 'font-family:sans-serif;padding:2rem;background:#fef2f2'
  document.body.innerHTML = `
    <h2 style="color:#dc2626;margin-bottom:.5rem">Firebase configuration error</h2>
    <p style="color:#374151;margin-bottom:.5rem">The following config values are missing:</p>
    <ul style="color:#b91c1c">${missingKeys.map(k => `<li>${k}</li>`).join('')}</ul>
    <p style="color:#6b7280;margin-top:1rem;font-size:.875rem">
      If you see this on GitHub Pages, check that all <code>VITE_FIREBASE_*</code> secrets
      are set in your repository settings and re-run the deployment workflow.
    </p>`
  throw new Error(`Firebase config missing: ${missingKeys.join(', ')}`)
}

const app = initializeApp(firebaseConfig)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
