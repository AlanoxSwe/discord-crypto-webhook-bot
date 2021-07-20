const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  client,
  sendNewCoin,
  sendNewCoinAlert,
  sendNewCoinReminder,
  sendPercent,
  sendPrepump, 
  sendPrepumpAlert,
  sendPrepumpReminder,
  sendSignal,
  sendHitSignal,
  sendDumpAlert,
  sendFuturesCreate,
} = require('./bot');
require('dotenv').config();

const { DISCORD_KEY, WEBHOOK_URL, SIGNAL_URL, FUTURES_URL } = process.env;

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

app.post(`/${SIGNAL_URL}`, (req, res) => {
  const { hit } = req.body;

  if (hit) {
    sendHitSignal(req.body, "🍻signal-bar");
  } else {
    sendSignal(req.body, "🍻signal-bar");
  }

  return res.status(200).end();
});

app.post(`/signal-bar-test`, (req, res) => {
  const { hit } = req.body;

  if (hit) {
    sendHitSignal(req.body, "💲chad-ching");
  } else {
    sendSignal(req.body, "💲chad-ching");
  }

  return res.status(200).end();
});

app.post(`/${WEBHOOK_URL}`, (req, res) => {
  const { type, window, window_unit, prepump } = req.body;
  if(type === "new_coin") {
    sendNewCoinReminder("🟫freshman-alerts");
    sendNewCoin(req.body, "🟨sophomore-alerts");
    sendNewCoin(req.body, "🟩junior-alerts");
    sendNewCoinAlert(req.body, "🟧senior-alerts");
  }else if(type === "BTC_DIP") {
    sendDumpAlert(req.body, "🔻btc-dump")
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
      } else if(window >= 4 && window <= 19) {
        sendPercent(req.body, "🟨sophomore-alerts");
        sendPercent(req.body, "🟩junior-alerts");
        sendPercent(req.body, "🟧senior-alerts");
      } else if(window >= 1 && window <= 3) {
        sendPercent(req.body, "🟩junior-alerts");
        sendPercent(req.body, "🟧senior-alerts");
      }
    } else if(window_unit === "s") {
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
  }
  return res.status(200).end();
});

app.post(`/${FUTURES_URL}`, (req, res) => {
  const { type } = req.body;
  if(type === "create") {
    sendFuturesCreate(req.body, "futures-bot-test");
  }else if(type === "cancel") {
    // sendDumpAlert(req.body, "🔻btc-dump")
  }else if(type === "hit") {
    // sendDumpAlert(req.body, "🔻btc-dump")
  }else if(type === "alert") {
    // sendDumpAlert(req.body, "🔻btc-dump")
  }
  return res.status(200).end();
});

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