import { connectorConfig } from '@sarah-rp-manager/default-connector'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

const dc = getDataConnect(app, connectorConfig)

const storage = getStorage(app)

if (import.meta.env.VITE_ENV === 'local') {
    connectDataConnectEmulator(dc, 'localhost', 9399)
}

export default function useFirebase() {
    const auth = getAuth(app)

    return {
        auth,
        dc,
        storage,
    }
}
