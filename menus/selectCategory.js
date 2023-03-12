const { Markup } = require('telegraf');

const selectCategory = (ctx, userRole) => {
  // Всего есть 3 типа видимости (true - прятать, false - не прятать)
  // v0 - видно всем
  // v1 - видно исполнителям и админам
  // v2 - видно только админам
  const v0 = false;
  const v1 = (userRole === 'dispatcher') || (userRole === 'admin') ? false : true;
  const v2 = userRole === 'admin' ? false : true;

  ctx.reply(
      'Выберите категорию для обращения:',
      Markup.inlineKeyboard([
          [ Markup.button.callback('Заказы/Возвраты/Мульти поставщик страхования', `Заказы__${userRole}`, v1) ],
          [ Markup.button.callback('Маркетплейсы/Goods/Сбер/Tmall/DPD/PickPoint', `Маркет__${userRole}`, v0) ],
          [ Markup.button.callback('Склад', 'Склад', v0) , Markup.button.callback('Лояльность', `Лояльность__${userRole}`, v0) , Markup.button.callback('Гарантия', `Гарантия__${userRole}`, v0) ],
          [ Markup.button.callback('Доставка/TMS (Антор)/Подряд ТК', `Доставка__${userRole}`, v0) ],
          [ Markup.button.callback('Закупки/Внешние поставщики/Вельвика/АЦО', `Закупки__${userRole}`, v0) ],
          [ Markup.button.callback('ЭДО/Корректировочные счет-фактуры', `ЭДО__${userRole}`, v0) ],
          [ Markup.button.callback('Финансы/Бухгалтерия/Кассы/Холдирование', `Финансы__${userRole}`, v0) ],
          [ Markup.button.callback('Права доступа', `Права__${userRole}`, v0) , Markup.button.callback('Маркировка', `Маркировка__${userRole}`, v0) ],
          [ Markup.button.callback('Зависание/Планировщик/Печать документов', `Зависание__${userRole}`, v0) ],
          [ Markup.button.callback('Открытие новых ТТ/складов', `Открытия__${userRole}`, v1) ],
          [ Markup.button.callback('Супервизоры', `Супервизоры__${userRole}`, v1) , Markup.button.callback('Консультанты', `Консультанты__${userRole}`, v1) ],
          [ Markup.button.callback('Диспетчеры', `Диспетчеры__${userRole}`, v1) , Markup.button.callback('Веб', `Веб__${userRole}`, v2) ]
      ])
  );
}

module.exports = selectCategory;