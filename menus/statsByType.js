const { Markup } = require('telegraf');

const statsByType = (ctx, userRole, period) => {
  ctx.reply(
      'Выберите тип статистики:',
      Markup.inlineKeyboard([
        [ 
          Markup.button.callback('Сообщения', `statsByType__${period}__messages__${userRole}`) ,
          Markup.button.callback('Категории', `statsByType__${period}__categories__${userRole}`) ,
          Markup.button.callback('Заявки', `statsByType__${period}__orders__${userRole}`)
        ],
        [ Markup.button.callback('Назад', `backToStatsByPeriod__${userRole}`) ],
      ])
  );
}

module.exports = statsByType;