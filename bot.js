/* eslint-disable no-console */
const Discord = require('discord.js');
const Axios = require('axios');
require('dotenv').config();

const client = new Discord.Client();

// Bot Methods

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const unit = ({ window_unit }) => {
  if(window_unit === 'h') return 'hour';
  if(window_unit === 'm') return 'minutes';
  if(window_unit === 's') return 'seconds';
}

// Notices

const sendPercent = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.pair}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`+${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(data.pair, logo, `https://www.binance.com/en/trade/${data.pair}_BTC`)
    .setColor(0x00ff00)
    .setDescription(`**${data.pair}** went from **${data.previous_price} BTC** to **${data.price} BTC** within **${data.window} ${unit(data)}**
    Volume: **+${data.vol_chng}%**`);
  channel.send(embed);
};

const sendPrepump = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.pair}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(data.pair, logo, `https://www.binance.com/en/trade/${data.pair}_BTC`)
    .setColor(0xff0000)
    .setFooter("Upgrade to Senior to see who pre-pumped this coin")
    .setDescription(`**${data.pair}** went from **${data.previous_price} BTC** to **${data.price} BTC** within **${data.window} ${unit(data)}**
    Volume: **+${data.vol_chng}%**`);
  channel.send(embed);
};

const sendNewCoin = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("Newly listed!")
    .setAuthor(data.currency, logo, `https://www.binance.com/en/trade/${data.currency}_BTC`)
    .setColor(0xffff00)
    .setFooter("Upgrade to Senior to receive a notification when this happens")
    .setDescription(data.message);
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

const sendNewCoinAlert = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.currency}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle("Newly listed!")
    .setAuthor(data.currency, logo, `https://www.binance.com/en/trade/${data.currency}_BTC`)
    .setColor(0xffff00)
    .setDescription(data.message);
  channel.send("@here New coin listing:");
  channel.send(embed);
};

const sendPrepumpAlert = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.pair}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(data.pair, logo, `https://www.binance.com/en/trade/${data.pair}_BTC`)
    .setColor(0xff0000)
    .setFooter(data.prepumpName ? `Possibly pre-pumped by: ${data.prepumpName}`: '')
    .setDescription(`**${data.pair}** went from **${data.previous_price} BTC** to **${data.price} BTC** within **${data.window} ${unit(data)}**
    Volume: **+${data.vol_chng}%**`);
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

const sendPrepumpReminderJunior = async (window, group) => {
  const logo = `https://image.flaticon.com/icons/png/512/179/179386.png`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`New possible pre-pump within ${window} seconds detected!`)
    .setAuthor("Hidden alert", logo)
    .setColor(0xff5757)
    .setDescription("Upgrade to Senior to see the pre-pumped coin.");
  channel.send(embed);
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
  sendPrepumpReminderJunior,
};