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
  switch(type) {
    case "percent_price":
      if(window.includes("1 minutes")) {
        sendPrepumpPrice(currency, message);
      } else {
        sendPercentPrice(currency, message);
      }
      res.status(200).end();
      break;
    case "new_coin":
      sendNewCoin(currency, message);
      res.status(200).end();
      break;
    case "periodic_price":
      sendPeriodicPrice(message);
      res.status(200).end();
      break;
    default:
      res.status(200).end();
      break;
  }
});

module.exports = app;
