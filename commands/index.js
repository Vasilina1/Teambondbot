const startBot = require('./start');
const handleCallbacks = require('../handlers/handleCallbacks');
const sendMessage = require('../handlers/sendMessage');

const registerCommands = (bot) => {
    bot.command('start', (ctx) => startBot(ctx))
    bot.on('callback_query',(ctx) => handleCallbacks(ctx))
    // bot.command('contacts',(ctx) => contacts(ctx))
    // bot.action('contacts',(ctx) => contacts(ctx))
    bot.on('message', (ctx) => sendMessage(ctx))
    // bot.on('mes', (ctx) => {
    //     let chat = ctx.channelPost.chat
    //     console.log(ctx);
    //     // ctx.telegram.forwardMessage(`@${chat.username}`, '@example', MESSAGE_ID)
    // })
}

module.exports = registerCommands