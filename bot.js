/* eslint-disable no-console */
const Discord = require('discord.js');
const Axios = require('axios');
require('dotenv').config();
const { CMC_KEY } = process.env;

const client = new Discord.Client();

// Helper Methods

const getLogo = async (currency) => {
  const { data } = await Axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY=${CMC_KEY}&symbol=${currency}`);
  if (data.data) return data.data[currency].logo;
  return null;
}

const getPercentFromMessage = (msg) => {
  const percentRegex = /[0-9]+(.[0-9])+/i;
  return msg.match(percentRegex)[0];
}

// Bot Methods

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const sendPercentPrice = async (currency, msg) => {
  const logo = (msg.includes("DOWN") || msg.includes("UP")) ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/5608.png' : await getLogo(currency);
  const channel = client.channels.cache.find((chnl) => chnl.name === "📢crypto-alerts");
  const embed = new Discord.MessageEmbed()
      .setTitle(`+${getPercentFromMessage(msg)}%`)
      .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
      .setColor(0x00ff00)
      .setDescription(msg);
  channel.send(embed);
};

const sendPrepumpPrice = async (currency, msg) => {
  if(!(msg.includes("DOWN") || msg.includes("UP"))) {
    const logo = await getLogo(currency);
    const channel = client.channels.cache.find((chnl) => chnl.name === "📢crypto-alerts");
    const embed = new Discord.MessageEmbed()
        .setTitle(`POSSIBLE PRE-PUMP: +${getPercentFromMessage(msg)}%`)
        .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
        .setColor(0xff0000)
        .setDescription(msg);
    channel.send("@here Possible pre-pump detected:");
    channel.send(embed);
  }
};

const sendNewCoin = async (currency, msg) => {
  const logo = await getLogo(currency);
  const channel = client.channels.cache.find((chnl) => chnl.name === "📢crypto-alerts");
  const embed = new Discord.MessageEmbed()
      .setTitle("Newly listed!")
      .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
      .setColor(0xffff00)
      .setDescription(msg);
  channel.send(embed);
};

const sendPeriodicPrice = (msg) => {
  const channel = client.channels.cache.find((chnl) => chnl.name === "📢crypto-alerts");
  const embed = new Discord.MessageEmbed()
      .setTitle(msg)
      .setColor(0xff9900)
  channel.send(embed);
};

module.exports = {
  client, sendNewCoin, sendPercentPrice, sendPeriodicPrice, sendPrepumpPrice
};