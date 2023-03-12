const { Markup } = require('telegraf');
const createUser = require('../dbApi/users/create');
const readUser = require('../dbApi/users/read');
const selectCategory = require('../menus/selectCategory');
const adminMenu = require('../menus/adminMenu');

const { Pool } = require('pg');
const pool = new Pool();

const startBot = async (ctx) => {
  const client = await pool.connect();
  try {
    // При старте бота сначала создаём пользователя в бд, если его нет
    const messageContext = ctx.update.message;
    const userContext = messageContext.from;
    const telegramId = userContext.id;

    await createUser(client, telegramId);
    const user = await readUser(client, telegramId);
    const userRole = user?.rows[0].user_role;
    const isBlacklisted = user?.rows[0].is_blacklisted;

    // В случае, если пользователь в ч/с
    if (isBlacklisted) {
      ctx.reply('Вы попали в черный список. Для разблокировки обратитесь к администратору');
      return; 
    }

    // Далее вызываем меню категорий
    if (userRole === 'admin') {
      // Меню админа
      adminMenu(ctx, userRole);
    } else {
      selectCategory(ctx, userRole);
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

module.exports = startBot;