const readUser = require("../dbApi/users/read");
const updateUserCategory = require("../dbApi/users/updateCategory");
const composeTicket = require("../menus/composeTicket");
const askAI = require("../menus/askAI");
const selectCategory = require("../menus/selectCategory");
const adminMenu = require("../menus/adminMenu");
const blacklistMenu = require("../menus/blacklistMenu");
const removeUserFromBlacklist = require("../dbApi/users/removeFromBlacklist");
const addToBlacklistMenu = require("../menus/addToBlacklistMenu");
const statsByPeriod = require("../menus/statsByPeriod");
const statsByType = require("../menus/statsByType");
const getStats = require("./getStats");

const { Pool } = require('pg');
const pool = new Pool();

const handleCallbacks = async (ctx) => {
  const client = await pool.connect();
  try {
    const telegramId = ctx.update.callback_query.from.id;
    const userRes = await readUser(client, telegramId);
    const user = userRes.rows[0];
    const isBlacklisted = user.is_blacklisted;
    // В случае, если пользователь в ч/с
    if (isBlacklisted) {
      ctx.reply('Вы попали в черный список. Для разблокировки обратитесь к администратору');
      return;
    }

    // Получаем полный экшн (например, Заказы__dispatcher__923049238409)
    // Сделано для минимизации обращений к бд
    let callbackAction = ctx?.update?.callback_query?.data;
    let callbackDataArray = callbackAction.split('__');
    switch (callbackDataArray[0]) {
      case 'Заказы':
      case 'Маркет':
      case 'Склад':
      case 'Лояльность':
      case 'Гарантия':
      case 'Доставка':
      case 'Закупки':
      case 'ЭДО':
      case 'Финансы':
      case 'Права':
      case 'Маркировка':
      case 'Зависание':
      case 'Открытия':
      case 'Супервизоры':
      case 'Консультанты':
      case 'Диспетчеры':
      case 'Веб':
        await updateUserCategory(client, telegramId, callbackDataArray[0]);
        composeTicket(ctx, callbackDataArray[0], callbackDataArray[1]);
        break;
      case 'AI':
        await updateUserCategory(client, telegramId, callbackDataArray[0]);
        askAI(ctx, callbackDataArray[0]);
        break;
      case 'backToCategories':
        // ставим категорию 0, если возвращаемся обратно
        await updateUserCategory(client, telegramId, 0);
        selectCategory(ctx, callbackDataArray[1]);
        break;
      case 'Отправить запрос':
        selectCategory(ctx, callbackDataArray[1]);
        break;
      case 'Черный список':
      case 'backToBlacklist':
        if (callbackDataArray[1] === 'admin') {
          blacklistMenu(ctx, callbackDataArray[1]);
        }
        break;
      case 'backToAdmin':
        if (callbackDataArray[1] === 'admin') {
          adminMenu(ctx, callbackDataArray[1])
        }
        break;
      case 'addToBlacklist':
        if (callbackDataArray[1] === 'admin') {
          addToBlacklistMenu(ctx, callbackDataArray[1]);
        }
        break;
      case 'removeFromBlacklist':
        if (callbackDataArray[1] === 'admin') {
          await removeUserFromBlacklist(client, callbackDataArray[2]);
          blacklistMenu(ctx, callbackDataArray[1]);
        }
        break;
      case 'Статистика':
      case 'backToStatsByPeriod':
        if (callbackDataArray[1] === 'admin') {
          statsByPeriod(ctx, callbackDataArray[1]);
        };
        break;
      case 'statsByPeriod':
        if (callbackDataArray[1] === 'admin') {
          statsByType(ctx, callbackDataArray[1], callbackDataArray[2]);
        }
        break;
      case 'statsByType':
        if (callbackDataArray[3] === 'admin') {
          getStats(ctx, callbackDataArray[1], callbackDataArray[2]);
        }
        break;
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

module.exports = handleCallbacks;