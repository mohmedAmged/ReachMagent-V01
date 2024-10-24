// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCja9bfwBnSkuOJsVIWl3y8z2XX8zdZqXA",
  authDomain: "reachmagnet-c509a.firebaseapp.com",
  projectId: "reachmagnet-c509a",
  storageBucket: "reachmagnet-c509a.appspot.com",
  messagingSenderId: "296852710107",
  appId: "1:296852710107:web:895eaaf1df6f5ea97022fe"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background notification', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
