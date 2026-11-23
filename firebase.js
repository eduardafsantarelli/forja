import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'
import {
  getAnalytics,
  isSupported,
  logEvent,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDnZEt7S0l1nJJOYg-ejehTqVjGmu5xubU',
  authDomain: 'forja-forja.firebaseapp.com',
  projectId: 'forja-forja',
  storageBucket: 'forja-forja.firebasestorage.app',
  messagingSenderId: '288548500092',
  appId: '1:288548500092:web:90d1e8c8a2729db1910ff9',
  measurementId: 'G-VZ1SSDWF93',
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

// Cópia dos dados de cada conta em usuarios/{uid}. As regras em firestore.rules
// garantem que só a própria pessoa lê e grava o seu documento.
const cloud = {
  async load(uid) {
    const snapshot = await getDoc(doc(db, 'usuarios', uid))
    return snapshot.exists() ? snapshot.data() : null
  },
  save(uid, data) {
    return setDoc(doc(db, 'usuarios', uid), data)
  },
}

const authApi = {
  cloud,
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
}

window.forjaAuthReady = setPersistence(auth, browserLocalPersistence)
  .then(() => authApi)
  .catch((error) => {
    window.forjaAuthError = error
    return null
  })
window.dispatchEvent(new Event('forja-auth-ready'))

window.forjaAnalyticsQueue = Array.isArray(window.forjaAnalyticsQueue)
  ? window.forjaAnalyticsQueue
  : []

const analyticsReady = isSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch(() => null)

window.forjaFirebaseApp = firebaseApp
window.forjaFirebaseReady = analyticsReady
window.forjaTrackAnalytics = (eventName) => {
  if (window.forjaAnalytics) {
    logEvent(window.forjaAnalytics, eventName)
    return
  }
  window.forjaAnalyticsQueue.push(eventName)
}

analyticsReady.then((analytics) => {
  if (!analytics) {
    window.forjaAnalyticsQueue.length = 0
    return
  }

  window.forjaAnalytics = analytics
  window.forjaAnalyticsQueue.splice(0).forEach((eventName) => {
    logEvent(analytics, eventName)
  })
})
