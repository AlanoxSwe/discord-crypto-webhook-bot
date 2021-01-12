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

app.post(`/${WEBHOOK_URL}`, (req, res) => {
  const { type, currency, message, window } = req.body;
  if(!(currency.includes("DOWN") || currency.includes("UP"))) {
    switch(type) {
      case "percent_price":
        if(window.includes("1 minutes")) {
          sendPrepumpPrice(currency, message);
        } else {
          sendPercentPrice(currency, message);
        }
        break;
      case "new_coin":
        sendNewCoin(currency, message);
        break;
      case "periodic_price":
        sendPeriodicPrice(message);
        break;
      default:
        break;
    }
    return res.status(200).end();
  }
  return res.status(200).end();
});

module.exports = app;
