// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
    apiKey: "AIzaSyCja9bfwBnSkuOJsVIWl3y8z2XX8zdZqXA",
    authDomain: "reachmagnet-c509a.firebaseapp.com",
    projectId: "reachmagnet-c509a",
    storageBucket: "reachmagnet-c509a.appspot.com",
    messagingSenderId: "296852710107",
    appId: "1:296852710107:web:895eaaf1df6f5ea97022fe",
    measurementId: "G-JN9Z6PKB2Q"
  };
const vapidKey ='BPlwZruw9aqfQoTLCrHyf6UuPORHBp7PZ8MbyJVavNzlGdIFUr677lTihKgX6tlW9woeSOMAhj8kWzcovliC7eo'
// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  return Notification.requestPermission()
  .then((permission) => {
    if (permission === 'granted') {
      return getToken(messaging, { vapidKey })
    }else{
      throw new Error('Notification not granted');
    }
  })
  .catch((err) => {
    console.error('error getting FCM token', err);
    throw err;
  })
}


