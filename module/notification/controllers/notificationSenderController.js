// const express = require("express");
// const OneSignal = require("onesignal-node");

// const app = express();
// app.use(express.json()); // Ensure the body is parsed as JSON

// // Initialize OneSignal Client with REST API Key and App ID (App ID is set in the client initialization only)
// const client = new OneSignal.Client({
//   userAuthKey: 'os_v2_app_3o4236rdcfgodnv4tftqyxzznpnp5ne5ri7uyyfbv6sg3gzmmsgpm44xoy4yxgxnjugiqpkj6zdl6gu3iuecenfszpnlxzre66kfocq', // Replace with your REST API Key
//   app: { appId: 'dbb9adfa-2311-4ce1-b6bc-99670c5f396b' } // Your OneSignal App ID (do not put this in the notification payload)
// });

// // API to Send Notification to All Users
// exports.sendNotification = async (req, res) => {
//   try {
//     // Log incoming request to inspect the body
//     console.log("Incoming request body:", req.body);

//     const  message  = req.body;

//     // Ensure the message is provided
//     if (!message) {
//       return res.status(400).send({
//         statusCode: 400,
//         success: false,
//         message: "Notification message is required.",
//         result: {}
//       });
//     }

//     // Correct notification payload (do not include app_id here)
//     const notification = {
//       contents: { en: message }, // Set the content of the notification
//       included_segments: ["Subscribed Users"], // Send to all subscribed users
//     };

//     // Log the notification payload to be sent to OneSignal
//     console.log("Notification payload:", notification);

//     // Send notification through OneSignal
//     const response = await client.createNotification(notification);
    
//     // Return the response
//     return res.status(200).send({
//       statusCode: 200,
//       success: true,
//       message: "Notification sent successfully",
//       result: response // Send the response from OneSignal API
//     });

//   } catch (err) {
//     // Handle any errors that occur while sending the notification
//     console.error("Error in sending notification:", err.message);
//     return res.status(500).send({
//       statusCode: 500,
//       success: false,
//       message: `Error in sending notification: ${err.message}`,
//       result: {}
//     });
//   }
// };

// // Start the Express Server (optional for testing)
// // app.listen(3000, () => console.log("🚀 Server running on port 3000"));


// const express = require("express");
// const OneSignal = require("onesignal-node");

// const app = express();
// app.use(express.json());

// // ✅ Correct OneSignal Client Initialization
// const client = new OneSignal.Client(
//   "dbb9adfa-2311-4ce1-b6bc-99670c5f396b", // ✅ App ID
//   "np5ne5ri7uyyfbv6sg3gzmmsg" // ✅ REST API Key
// );

// exports.sendNotification = async (req, res) => {
//   try {
//     console.log("Incoming request body:", req.body); // Debugging ke liye

//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         statusCode: 400,
//         success: false,
//         message: "Notification message is required.",
//         result: {},
//       });
//     }

//     // ✅ Correct Notification Payload
//     const notification = {
//       app_id: "dbb9adfa-2311-4ce1-b6bc-99670c5f396b", // ✅ Must be included here
//       contents: { en: message },
//       included_segments: ["Subscribed Users"],
//     };

//     console.log("Sending Notification Payload:", notification);

//     // ✅ Send notification
//     const response = await client.createNotification(notification);

//     return res.status(200).json({
//       statusCode: 200,
//       success: true,
//       message: "Notification sent successfully",
//       result: response,
//     });

//   } catch (err) {
//     console.error("Error in sending notification:", err.message);
//     return res.status(500).json({
//       statusCode: 500,
//       success: false,
//       message: `Error in sending notification: ${err.message}`,
//       result: {},
//     });
//   }
// };

// ✅ Server Start (For Testing)
// app.listen(3000, () => console.log("🚀 Server running on port 3000"));

const axios = require("axios");

const ONESIGNAL_APP_ID = "a534e2ff-eb24-417a-bf94-5ed1d9e8d6af"; // Your OneSignal App ID
const ONESIGNAL_REST_API_KEY = "os_v2_app_uu2of77leraxvp4ul3i5t2gwv7oc2annioyexzmhithcaqhucgrtntwvi4ptwyjzq373azldoj7ldfsupjnuk7isv4tlm5o2h2n2gpi"; // Your OneSignal REST API Key

exports.sendNotification = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required.",
      });
    }

    const notificationData = {
      app_id: ONESIGNAL_APP_ID,
      contents: { en: message },
      included_segments: ["Subscribed Users"], // Send to all subscribed users
    };

    const headers = {
      "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post("https://onesignal.com/api/v1/notifications", notificationData, { headers });

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      result: response.data,
    });

  } catch (err) {
    console.error("Error in sending notification:", err);  // Log the full error object

    // Handle error response with proper error details
    return res.status(500).json({
      success: false,
      message: `Error in sending notification: ${err.response ? JSON.stringify(err.response.data) : err.message}`,
    });
  }
};
