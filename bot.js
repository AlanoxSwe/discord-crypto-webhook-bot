/* eslint-disable no-console */
const Discord = require('discord.js');
const Axios = require('axios');
const sharp = require("sharp")
require('dotenv').config();

const { NOMICS_KEY } = process.env;

const client = new Discord.Client();

// Bot Methods

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const sendPercentPrice = async (currency, msg, percent, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`+${percent}%`)
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0x00ff00)
    .setDescription(msg);
  channel.send(embed);
};

const sendPrepumpPrice = async (currency, msg, percent, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${percent}%`)
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0xff0000)
    .setDescription(msg);
  channel.send("@here Possible pre-pump detected:");
  channel.send(embed);
};

const sendNewCoin = async (currency, msg, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("Newly listed!")
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0xffff00)
    .setDescription(msg);
  channel.send("@here New coin listing:");
  channel.send(embed);
};

const sendPeriodicPrice = (msg, group) => {
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(msg)
    .setColor(0xff9900);
  channel.send(embed);
};

module.exports = {
  client, sendNewCoin, sendPercentPrice, sendPeriodicPrice, sendPrepumpPrice
};