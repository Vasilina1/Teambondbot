const express = require("express");
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf')

const config = process.env.NODE_ENV === 'production' 
        ? require('./configProd.json') : require('./configDev.json')

require('dotenv-safe').config();

const registerCommands = require('./commands/index')

// Load bot token
const token = config.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

// Define bot
const bot = new Telegraf(token)

// Define bot commands
registerCommands(bot);

// Launch bot
bot.launch()

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb'
  })
);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

app.get('/test', (req, res) => {
  // тест для проверки открытых портов на сервере
  res.json('200 OK')
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

process.on('uncaughtException', function (err) {
  console.log("FATAL: NOTIFY ADMIN!!!");
  console.error(err);
});

process.on('unhandledRejection', function (err) {
  console.log("FATAL: NOTIFY ADMIN!!!");
  console.error(err);
});