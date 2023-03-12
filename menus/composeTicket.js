const { Markup } = require('telegraf');

const composeTicket = (ctx, category, userRole) => {
  ctx.reply(
      `Введите номер обращения и текст (выбрана категория ${category}):`,
      Markup.inlineKeyboard([
          [ Markup.button.callback('Назад', `backToCategories__${userRole}`) ]
      ])
  );
}

module.exports = composeTicket;