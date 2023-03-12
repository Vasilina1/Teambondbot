const { Markup } = require('telegraf');

const statsByType = (ctx, userRole, period) => {
  ctx.reply(
      'Выберите тип статистики:',
      Markup.inlineKeyboard([
        [ 
          Markup.button.callback('Сообщения', `statsByType__${period}__messages`) ,
          Markup.button.callback('Категории', `statsByType__${period}__categories`) ,
          Markup.button.callback('Заявки', `statsByType__${period}__orders`)
        ],
        [ Markup.button.callback('Назад', `backToStatsByPeriod__${userRole}`) ],
      ])
  );
}

module.exports = statsByType;