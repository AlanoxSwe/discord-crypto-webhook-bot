const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  client, sendNewCoin, sendPercentPrice, sendPeriodicPrice, sendPrepumpPrice
} = require('./bot');
require('dotenv').config();

const { DISCORD_KEY, WEBHOOK_URL } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

client.login(DISCORD_KEY);

/*

  🟫crypto-alerts:
    - 10%, 30 min
  🟨sophomore-alerts:
    - 10%, 20 min
  🟩junior-alerts:
    - 5%, 10 min
    - 10%, 10 min
    + prepump
  🟦senior-alerts:
    - 20%, 10 min
    + prepump

*/

const getPercentFromMessage = (msg) => {
  const regex = /[0-9]+(.[0-9])+/i;
  const match = msg.match(regex)[0];
  return match ? match : null;
};

const getMinutesFromWindow = (window) => {
  const regex = /\d+/;
  const match = window.match(regex)[0];
  return match ? match : null;
};


app.post(`/${WEBHOOK_URL}`, (req, res) => {
  const { type, currency, message, window, percent } = req.body;
  if(currency && !(currency.includes("DOWN") || currency.includes("UP"))) {
    switch(type) {
      case "percent_price":
        if(getMinutesFromWindow(window) === "30") {
          sendPercentPrice(
            currency,
            message,
            getPercentFromMessage(message),
            "🟫crypto-alerts"
          );
        } else if (getMinutesFromWindow(window) === "15") {
          sendPercentPrice(
            currency,
            message,
            getPercentFromMessage(message),
            "🟨sophomore-alerts"
          );
        } else if (getMinutesFromWindow(window) === "10") {
          if(percent < 11) {
            sendPercentPrice(
              currency,
              message,
              getPercentFromMessage(message),
              "🟩junior-alerts"
            );
          } else if(percent > 11) {
            sendPercentPrice(
              currency,
              message,
              getPercentFromMessage(message),
              "🟦senior-alerts"
            );
          }
        } else if (getMinutesFromWindow(window) === "1") {
          sendPrepumpPrice(
            currency,
            message,
            getPercentFromMessage(message),
            "🟩junior-alerts"
          );
          sendPrepumpPrice(
            currency,
            message,
            getPercentFromMessage(message),
            "🟦senior-alerts"
          );
        }
        break;
      case "new_coin":
        sendNewCoin(currency, message, "🟨sophomore-alerts");
        break;
      case "periodic_price":
        sendPeriodicPrice(message, "🟫crypto-alerts");
        break;
      default:
        break;
    }
    return res.status(200).end();
  }
  return res.status(200).end();
});

module.exports = app;
