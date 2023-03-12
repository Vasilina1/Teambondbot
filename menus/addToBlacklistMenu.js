const { Markup } = require('telegraf');

const { Pool } = require('pg');
const updateUserCategory = require('../dbApi/users/updateCategory');
const pool = new Pool();

const addToBlacklistMenu = async (ctx, userRole) => {
  const client = await pool.connect();
  try {
    // выставляем админу, что он в статусе добавления в чс
    // категория "Добавление в ЧС"
    const telegramId = ctx.update.callback_query.from.id;
    await updateUserCategory(client, telegramId, 'Добавление в ЧС');
    ctx.reply(
      'Введите id для добавления в черный список.',
      Markup.inlineKeyboard([
          [ Markup.button.callback('Назад', `backToBlacklist__${userRole}`) ],
      ])
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
}

module.exports = addToBlacklistMenu;