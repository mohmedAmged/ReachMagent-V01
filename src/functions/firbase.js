// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
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
export const messaging = getMessaging(app);

// export const requestFCMToken = async () => {
//   return Notification.requestPermission()
//   .then((permission) => {
//     if (permission === 'granted') {
//       return getToken(messaging, { vapidKey })
//     }else{
//       throw new Error('Notification not granted');
//     }
//   })
//   .catch((err) => {
//     console.error('error getting FCM token', err);
//     throw err;
//   })
// }

// export const requestFCMToken = async () => {
//   if (Notification.permission === 'default') {
//     return Notification.requestPermission()
//       .then(async (permission) => {
//         if (permission === 'granted') {
//           return getToken(messaging, { vapidKey });
//         } else {
//           alert("Please enable notifications to proceed.");
//           throw new Error('Notification not granted');
//         }
//       })
//       .catch((err) => {
//         console.error('Error getting FCM token', err);
//         throw err;
//       });
//   } else if (Notification.permission === 'granted') {
//     return getToken(messaging, { vapidKey });
//   } else {
//     alert("Notifications are required to log in. Please enable them.");
//     throw new Error('Notification not granted');
//   }
// };
const getBrowserSettingsLink = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("chrome")) {
    return "chrome://settings/content/notifications";
  } else if (userAgent.includes("edg")) {
    return "edge://settings/content/notifications";
  } else if (userAgent.includes("firefox")) {
    return "about:preferences#privacy";
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return "Open Safari > Preferences > Websites > Notifications";
  }
  return null; // Other browsers or unsupported
};
// export const requestFCMToken = async () => {
//   if (!("Notification" in window)) {
//     alert("This browser does not support notifications. Please use a compatible browser.");
//     throw new Error("Notifications not supported");
//   }

//   if (Notification.permission === 'default') {
//     // Trigger the browser permission dialog
//     return Notification.requestPermission()
//       .then(async (permission) => {
//         if (permission === 'granted') {
//           return getToken(messaging, { vapidKey });
//         } else {
//           alert("Please enable notifications in your browser settings to proceed.");
//           throw new Error("Notification permission denied");
//         }
//       })
//       .catch((err) => {
//         console.error('Error requesting FCM token', err);
//         throw err;
//       });
//   } else if (Notification.permission === 'granted') {
//     // If already granted, just get the token
//     return getToken(messaging, { vapidKey });
//   } else {
//     alert("Notifications are required for login. Please enable them in your browser settings.");
//     throw new Error("Notification permission denied");
//   }
// };

export const requestFCMToken = async () => {
  if (Notification.permission === 'default') {
    return Notification.requestPermission()
      .then(async (permission) => {
        if (permission === 'granted') {
          return getToken(messaging, { vapidKey });
        } else {
          const settingsLink = getBrowserSettingsLink();
          const instructions = settingsLink
            ? `Please enable notifications in your browser settings. Click the link below to go to the settings page:\n${settingsLink}`
            : "Please enable notifications in your browser settings.";
          alert(instructions);
          throw new Error("Notification permission denied");
        }
      })
      .catch((err) => {
        console.error("Error requesting FCM token", err);
        throw err;
      });
  } else if (Notification.permission === "granted") {
    return getToken(messaging, { vapidKey });
  } else {
    const settingsLink = getBrowserSettingsLink();
    const instructions = settingsLink
      ? `Notifications are required for login. Enable them in settings here:\n${settingsLink}`
      : "Please enable notifications in your browser settings.";
    alert(instructions);
    throw new Error("Notification permission denied");
  }
};

export const useFCMNotifications = () => {
  useEffect(() => {
    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground notification:', payload);
    });

    return () => unsubscribe();
  }, []);
};


