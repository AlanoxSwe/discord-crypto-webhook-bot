const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  client,
  sendNewCoin,
  sendNewCoinAlert,
  sendNewCoinReminder,
  sendPercent,
  sendPeriodicPrice,
  sendPrepump, 
  sendPrepumpAlert,
  sendPrepumpReminder,
  sendPrepumpReminderJunior,
} = require('./bot');
require('dotenv').config();

const { DISCORD_KEY, WEBHOOK_URL } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

client.login(DISCORD_KEY);

/*

  🟫freshman-alerts:
    - 10%, 30 min
  🟨sophomore-alerts:
    - 10%, 15 min
  🟩junior-alerts:
    - 8%, 10 min
    - 10%, 10 min
    + prepump
  🟧senior-alerts:
    - 20%, 10 min
    + prepump

*/

// const getPercentFromMessage = (msg) => {
//   const regex = /[0-9]+(.[0-9])+/i;
//   const match = msg.match(regex)[0];
//   return match ? match : null;
// };

// const getMinutesFromWindow = (window) => {
//   const regex = /\d+/;
//   const match = window.match(regex)[0];
//   return match ? match : null;
// };

app.post(`/${WEBHOOK_URL}`, (req, res) => {
  const { type, window, window_unit, prepump } = req.body;
  console.log(req.body);
  if(type === "new_coin") {
    sendNewCoinReminder("🟫freshman-alerts");
    sendNewCoin(req.body, "🟨sophomore-alerts");
    sendNewCoin(req.body, "🟩junior-alerts");
    sendNewCoinAlert(req.body, "🟧senior-alerts");
  }else{
    if(window_unit === "h" && window === 1) {
      sendPercent(req.body, "🟫freshman-alerts");
      sendPercent(req.body, "🟨sophomore-alerts");
      sendPercent(req.body, "🟩junior-alerts");
      sendPercent(req.body, "🟧senior-alerts");
    } else if(window_unit === "m") {
      if(window >= 20 && window <= 40) {
        sendPercent(req.body, "🟫freshman-alerts");
        sendPercent(req.body, "🟨sophomore-alerts");
        sendPercent(req.body, "🟩junior-alerts");
        sendPercent(req.body, "🟧senior-alerts");
      } else if(window >= 4 && window <= 10) {
        sendPercent(req.body, "🟨sophomore-alerts");
        sendPercent(req.body, "🟩junior-alerts");
        sendPercent(req.body, "🟧senior-alerts");
      } else if(window >= 1 && window <= 3) {
        if(prepump) {
          sendPrepumpReminder("🟫freshman-alerts");
          sendPrepumpReminder("🟨sophomore-alerts");
          sendPrepump(req.body, "🟩junior-alerts");
          sendPrepumpAlert(req.body, "🟧senior-alerts");
        } else {
          sendPercent(req.body, "🟩junior-alerts");
          sendPercent(req.body, "🟧senior-alerts");
        }
      }
    } else if(window_unit === "s") {
      sendPrepumpReminder("🟫freshman-alerts");
      sendPrepumpReminder("🟨sophomore-alerts");
      sendPrepumpReminderJunior(req.body.window, "🟩junior-alerts");
      sendPrepumpAlert(req.body, "🟧senior-alerts");
    }
  }
  return res.status(200).end();
});


// app.post(`/${WEBHOOK_URL}1`, (req, res) => {
//   const { type, currency, message, window, percent } = req.body;
//   if(currency && !(currency.includes("DOWN") || currency.includes("UP"))) {
//     switch(type) {
//       case "percent_price":
//         if(getMinutesFromWindow(window) === "30") {
//           // Freshman level
//           sendPercent(currency, message, getPercentFromMessage(message), "🟫freshman-alerts");
//           sendPercent(currency, message, getPercentFromMessage(message), "🟨sophomore-alerts");
//           sendPercent(currency, message, getPercentFromMessage(message), "🟩junior-alerts");
//           sendPercent(currency, message, getPercentFromMessage(message), "🟧senior-alerts");
//         } else if (getMinutesFromWindow(window) === "15") {
//           // Sophomore level
//           sendPercent(currency, message, getPercentFromMessage(message), "🟨sophomore-alerts");
//           sendPercent(currency, message, getPercentFromMessage(message), "🟩junior-alerts");
//           sendPercent(currency, message, getPercentFromMessage(message), "🟧senior-alerts");
//         } else if (getMinutesFromWindow(window) === "10") {
//           if(percent < 11) {
//             // Junior level
//             sendPercent(currency, message, getPercentFromMessage(message), "🟩junior-alerts");
//             sendPercent(currency, message, getPercentFromMessage(message), "🟧senior-alerts");
//           } else if(percent > 11) {
//             // Senior level
//             sendPercent(currency, message, getPercentFromMessage(message), "🟧senior-alerts");
//           }
//         } else if (getMinutesFromWindow(window) === "1") {
//           // Junior level
//           // Senior alert
//           sendPrepumpReminder("🟫freshman-alerts");
//           sendPrepumpReminder("🟨sophomore-alerts");
//           sendPrepump(currency, message, getPercentFromMessage(message), "🟩junior-alerts");
//           sendPrepumpAlert(currency, message, getPercentFromMessage(message), "🟧senior-alerts");
//         }
//         break;
//       case "new_coin":
//         // Sophomore level
//         sendNewCoinReminder("🟫freshman-alerts");
//         sendNewCoin(currency, message, "🟨sophomore-alerts");
//         sendNewCoin(currency, message, "🟩junior-alerts");
//         sendNewCoinAlert(currency, message, "🟧senior-alerts");
//         break;
//       case "periodic_price":
//         // Freshman level
//         sendPeriodicPrice(message, "🟫freshman-alerts");
//         sendPeriodicPrice(message, "🟨sophomore-alerts");
//         sendPeriodicPrice(message, "🟩junior-alerts");
//         sendPeriodicPrice(message, "🟧senior-alerts");
//         break;
//       default:
//         break;
//     }
//     return res.status(200).end();
//   }
//   return res.status(200).end();
// });

module.exports = app;


// {
//   "pair": "UTK",
//   "price": 0.00000829,
//   "pc_chng": 8.37,
//   "vol_chng": 13.33,
//   "direction": "up",
//   "window": 20,
//   "window_unit": "m",
//   "prepump": false,
//   "prepumpName": null,
//   "previous_price": 0.0000076
// }