/* eslint-disable no-console */
const Discord = require('discord.js');
const Axios = require('axios');
const Jimp = require("jimp");
const qs = require("qs");
require('dotenv').config();

const { IMGBB_KEY } = process.env;
const jreadAsync = Jimp.read;
const client = new Discord.Client();

// Bot Methods

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const unit = ({ window_unit }) => {
  if(window_unit === 'h') return 'hour';
  if(window_unit === 'm') return 'minutes';
  if(window_unit === 's') return 'seconds';
};

const makeBase64 = async (image) => {
  let data;
  await image.getBase64(Jimp.AUTO, (err, res) => data = res);
  return await data.split(',').pop();
};

const upload = async (image) => {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({'image': image}),
    url: `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`
  }
  try {
    const res = await Axios(options)
    return res.data.data.image.url
  } catch (err) {
    console.error(err)
  }
}

const mergeImages = async (coin1, coin2) => {
    try {
    const image1 = await jreadAsync(`https://icons.bitbot.tools/api/${coin1}/64x64`)
    const image2 = await jreadAsync(`https://icons.bitbot.tools/api/${coin2}/64x64`)

    image1.scan(0, 0, image1.bitmap.width, image1.bitmap.height, (x, y, idx) => {
      if ((image1.bitmap.width - x) > y) {
          return;
      }
      image1.setPixelColor(image2.getPixelColor(x, y), x, y);
    })
    return await upload(await makeBase64(image1))
  }catch (err) {
    return `https://icons.bitbot.tools/api/${coin2}/64x64`
  }
}

// Notices

const sendPercent = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.coin}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`+${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(`${data.coin}/${data.pair}`, logo, `https://www.binance.com/en/trade/${data.coin}_${data.pair}`)
    .setColor(0x00ff00)
    .setDescription(`**${data.coin}** went from **${data.previous_price} ${data.pair}** to **${data.price} ${data.pair}** within **${data.window} ${unit(data)}**
    Volume: **+${data.vol_chng}%**`);
  channel.send(embed);
};

const sendPrepump = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.coin}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(`${data.coin}/${data.pair}`, logo, `https://www.binance.com/en/trade/${data.coin}_${data.pair}`)
    .setColor(0xff0000)
    .setFooter("Upgrade to Senior to see who pre-pumped this coin")
    .setDescription(`**${data.coin}** went from **${data.previous_price} ${data.pair}** to **${data.price} ${data.pair}** within **${data.window} ${unit(data)}**
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
  channel.send("<@&820295659625906236> New coin listing:");
  channel.send(embed);
};

const sendPrepumpAlert = async (data, group) => {
  const logo = `https://icons.bitbot.tools/api/${data.coin}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`POSSIBLE PRE-PUMP: +${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(`${data.coin}/${data.pair}`, logo, `https://www.binance.com/en/trade/${data.coin}_${data.pair}`)
    .setColor(0xff0000)
    .setFooter(data.prepumpName ? `Possibly pre-pumped by: ${data.prepumpName}`: '')
    .setDescription(`**${data.coin}** went from **${data.previous_price} ${data.pair}** to **${data.price} ${data.pair}** within **${data.window} ${unit(data)}**
    Volume: **+${data.vol_chng}%**`);
  channel.send("<@&820295659625906236> Possible pre-pump detected:");
  channel.send(embed);
};

// {'type': 'BTC_DIP',
//  'pc_chng': '-2.08',
//  'price': '46000',
//  'price_previous': '48000',
//  'window': 2
//  'window_unit': 'm'}

const sendDumpAlert = async (data, group) => {
  const logo = `https://i.ibb.co/34jN1BC/btcdip.png`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`BTC dropped ${data.pc_chng}% in *${data.window} ${unit(data)}*`)
    .setAuthor(`Bitcoin Dump`, logo)
    .setColor(0xff0000)
    .setFooter("Read the pinned post how this dump can be useful for trades.")
    .setDescription(`**BTC** went from **${data.price_previous} USD** to **${data.price} USD** within **${data.window} ${unit(data)}**`);
  channel.send("<@&856499721705881621> BTC Dump detected:");
  channel.send(embed);
};

const sendFuturesCreate = async (data, group) => {
  const coinSplit = data.coin.split('/');
  const coin = coinSplit[0];
  const pair = coinSplit[1];

  const logo = `https://icons.bitbot.tools/api/${coin}/64x64`;
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`New Futures signal: ${coin}/${pair}`)
    .setAuthor(`${coin}/${pair}`, logo)
    .setColor(0x00ff00)
    .setFooter("⚠️ WARNING: Do your own research. We cannot guarantee anything and are not responsible for any losses.")
    .setDescription(`> **Method:** \`${data.method}\`\n
      > **Entry:** \`${data.entry}\`\n
      > **Target:** \`${data.target}\`\n
      > **Leverage:** \`${data.leverage}\`\n
      > **Stop Loss:** \`${data.stoploss}\`\n
      \n${data.notes_description}
    `);
  channel.send("<@&823279813945983046>");
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

// Signals

const sendSignal = async (data, group) => {
  const logo = await mergeImages(data.coin, data.pair);
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`New Signal for $${data.coin}`)
    .setAuthor(`${data.coin}/${data.pair}`, logo)
    .setColor(0xd5d5d5)
    .setFooter("⚠️ WARNING: Do your own research. We cannot guarantee anything and are not responsible for any losses.")
    .setDescription(`> **Buy Zone:** \`${data.buyZone}\`\n> **Sell Zone:** \`${data.sellZone}\`${data.stopLoss ? `\n> **Stop Loss:** \`${data.stopLoss}\`` : ''}${data.notes ? `\n\n${data.notes}`: ''}`);
  channel.send("<@&823279813945983046>");
  channel.send(embed);
};

const sendHitSignal = async (data, group) => {
  const logo = "https://i.ibb.co/tXQfNqp/iconmonstr-check-mark-4-240.png";
  const channel = client.channels.cache.find((chnl) => chnl.name === group);
  const embed = new Discord.MessageEmbed()
    .setTitle(`${data.coin} Signal Hit!`)
    .setAuthor(`${data.coin}/${data.pair}`, logo)
    .setColor(0x1ee331)
  channel.send("<@&823279813945983046>");
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
  sendSignal,
  sendHitSignal,
  sendDumpAlert,
  sendFuturesCreate,
};