const startBot = require('./start');
const handleCallbacks = require('../handlers/handleCallbacks');
const sendMessage = require('../handlers/sendMessage');

const registerCommands = (bot) => {
    bot.command('start', (ctx) => startBot(ctx))
    bot.on('callback_query',(ctx) => handleCallbacks(ctx))
    // bot.command('contacts',(ctx) => contacts(ctx))
    // bot.action('contacts',(ctx) => contacts(ctx))
    bot.on('message', (ctx) => sendMessage(ctx))
}

module.exports = registerCommands