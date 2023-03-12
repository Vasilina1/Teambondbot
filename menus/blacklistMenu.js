const { Markup } = require('telegraf');

const { Pool } = require('pg');
const getBlacklistedUsers = require('../dbApi/users/getBlacklisted');
const pool = new Pool();

const blacklistMenu = async (ctx, userRole) => {
  const client = await pool.connect();
  try {
    // Выбираем из бд пользователей в ЧС
    const blacklistedData = await getBlacklistedUsers(client);
    const blacklistedUsers = blacklistedData?.rows;
    const blacklistedIds = blacklistedUsers.map((v) => v.telegram_id);
    
    if (!blacklistedIds.length) {
      // Если ЧС пуст
      ctx.reply(
        'Черный список пуст.',
        Markup.inlineKeyboard([
            [ Markup.button.callback('Добавить', `addToBlacklist__${userRole}`) ],
            [ Markup.button.callback('Назад', `backToAdmin__${userRole}`) ],
        ])
      );
      return;
    }

    // По выбранным из бд id попавших в ЧС строим клавиатуру
    let keyboardArray = [[ Markup.button.callback('Добавить', `addToBlacklist__${userRole}`) ]];
    blacklistedIds.forEach(v => {
      keyboardArray.push([ Markup.button.callback(v, `removeFromBlacklist__${userRole}__${v}`) ]);
    })
    keyboardArray.push([ Markup.button.callback('Назад', `backToAdmin__${userRole}`) ]);

    ctx.reply(
      blacklistedIds.join(', '),
      Markup.inlineKeyboard(keyboardArray)
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
}

module.exports = blacklistMenu;