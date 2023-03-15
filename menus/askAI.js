const { Markup } = require('telegraf');

const composeTicket = (ctx, userRole) => {
  ctx.reply(
      `Задайте ваш вопрос нашему AI-помощнику:`,
      Markup.inlineKeyboard([
          [ Markup.button.callback('Назад', `backToCategories__${userRole}`) ]
      ])
  );
}

module.exports = composeTicket;