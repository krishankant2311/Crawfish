const OneSignal = require('onesignal-node');

const client = new OneSignal.Client({
  userAuthKey: 'np5ne5ri7uyyfbv6sg3gzmmsg', // Yahan apni REST API key dalein
  app: { appAuthKey: '!NdU6BR6RWmPV@n', appId: 'dbb9adfa-2311-4ce1-b6bc-99670c5f396b' },
});

// Ek notification send karne ka example
const notification = {
  contents: { en: "This is a test notification!" },
  included_segments: ["Subscribed Users"],
};

client.createNotification(notification)
  .then(response => console.log("Notification sent successfully!", response))
  .catch(err => console.error("Error sending notification:", err));
