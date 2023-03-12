const { Markup } = require('telegraf');

const adminMenu = (ctx, userRole) => {
  ctx.reply(
      'Выберите действие:',
      Markup.inlineKeyboard([
          [ Markup.button.callback('Статистика', `Статистика__${userRole}`) ],
          [ Markup.button.callback('Отправить запрос', `Отправить запрос__${userRole}`) ],
          [ Markup.button.callback('Черный список', `Черный список__${userRole}`) ],
      ])
  );
}

module.exports = adminMenu;