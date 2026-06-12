importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD0fO9DE-VYOSW-Prb0WMvhj_l6HmMilUw',
  authDomain: 'vendor-00.firebaseapp.com',
  projectId: 'vendor-00',
  storageBucket: 'vendor-00.firebasestorage.app',
  messagingSenderId: '180469717992',
  appId: '1:180469717992:web:3b09010dbbbdeb58f8625d',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Nouvelle actualité', {
    body: body || '',
    icon: icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
