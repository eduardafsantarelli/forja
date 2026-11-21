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
const authApi = {
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
