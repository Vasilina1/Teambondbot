const { Markup } = require('telegraf');

const statsByPeriod = (ctx, userRole) => {
  ctx.reply(
      'Выберите тип статистики:',
      Markup.inlineKeyboard([
        [ 
          Markup.button.callback('За сегодня', `statsByPeriod__${userRole}__today`) ,
          Markup.button.callback('Всё время', `statsByPeriod__${userRole}__allTime`) 
        ],
        [ Markup.button.callback('Назад', `backToAdmin__${userRole}`) ],
      ])
  );
}

module.exports = statsByPeriod;