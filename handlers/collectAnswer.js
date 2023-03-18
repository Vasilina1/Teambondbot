const writeAnswer = require('../dbApi/messages/writeAnswer');

const { Pool } = require('pg');
const pool = new Pool();

const collectAnswer = async (ctx) => {
  const client = await pool.connect();
  try {
    const messageContext = ctx.update.message;
    if (messageContext.hasOwnProperty('reply_to_message') &&
        messageContext?.text.split(':')[0] === 'Ответ') {
      // записываем ответ, если сообщение - ответ на сообщение бота и содержит в себе "Ответ:"
      const replyReceiver = messageContext.reply_to_message.entities.find(v => v?.type === 'text_mention'); // id пользователя, которому отправим ответ;
      const replyReceiverId = replyReceiver.user.id;
      
      let question = messageContext.reply_to_message.text;

      const messageId = messageContext.reply_to_message.message_id;
      const chatContext = messageContext.reply_to_message.chat;
      const category = chatContext.title;
      const answer = messageContext.text.split(':').slice(1).join(':');
      await writeAnswer(client, messageId, category, answer);
      // для Диспетчеров escape-char для *, чтобы не было ошибки
      question = question.replace('\*', '\\*');
      await ctx.telegram.sendMessage(replyReceiverId,
        `${question} \n\nОтвет: ${answer}`, {parse_mode: "Markdown"});
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

module.exports = collectAnswer;