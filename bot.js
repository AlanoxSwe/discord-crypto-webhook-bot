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

// Notices

const sendPercent = async (currency, msg, percent, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`+${percent}%`)
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0x00ff00)
    .setDescription(msg);
  channel.send(embed);
};

const sendPrepump = async (currency, msg, percent, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${percent}%`)
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0xff0000)
    .setDescription(msg);
  channel.send(embed);
};

const sendNewCoin = async (currency, msg, group) => {
  const logo = `https://icons.bitbot.tools/api/${currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("Newly listed!")
    .setAuthor(currency, logo, `https://www.binance.com/en/trade/${currency}_BTC`)
    .setColor(0xffff00)
    .setFooter("Upgrade to Senior to receive a notification when this happens")
    .setDescription(msg);
  channel.send(embed);
};

const sendPeriodicPrice = (msg, group) => {
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
  .setTitle(msg)
  .setColor(0xff9900);
  channel.send(embed);
};

// Alerts

const sendNewCoinAlert = async (currency, msg, group) => {
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

const sendPrepumpAlert = async (currency, msg, percent, group) => {
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

// Upgrade Reminders

const sendNewCoinReminder = async (group) => {
  const logo = `https://image.flaticon.com/icons/png/512/179/179386.png`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("New coin listing detected!")
    .setAuthor("Hidden alert", logo)
    .setColor(0xff5757)
    .setDescription("Upgrade to Sophomore to see new coin listing.");
  channel.send(embed);
};

const sendPrepumpReminder = async (group) => {
  const logo = `https://image.flaticon.com/icons/png/512/179/179386.png`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("New possible pre-pump detected!")
    .setAuthor("Hidden alert", logo)
    .setColor(0xff5757)
    .setDescription("Upgrade to Junior to see the pre-pumped coin.");
  channel.send(embed);
};

const sendRoutineCommands = async (group) => {
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  channel.send('!d bump');
  channel.send('!refreshRanks all');
};

module.exports = {
  client,
  sendNewCoin,
  sendNewCoinAlert,
  sendNewCoinReminder,
  sendPercent,
  sendPeriodicPrice,
  sendPrepump,
  sendPrepumpAlert,
  sendPrepumpReminder,
  sendRoutineCommands
};