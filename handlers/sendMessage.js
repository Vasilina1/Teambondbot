const readUser = require('../dbApi/users/read');
const updateUserCategory = require('../dbApi/users/updateCategory');
const selectCategory = require('../menus/selectCategory');
const adminMenu = require('../menus/adminMenu');
const addToBlacklist = require('../dbApi/users/addToBlacklist');
const blacklistMenu = require('../menus/blacklistMenu');

const groups = require('../const/groups.json');

const { Pool } = require('pg');
const createQuestion = require('../dbApi/messages/createQuestion');
const pool = new Pool();

const sendMessage = async (ctx) => {
  const client = await pool.connect();
  try {
    const messageContext = ctx.update.message;
    const userContext = messageContext.from;
    const userName = userContext.first_name;
    const telegramId = userContext.id;
    
    const userRes = await readUser(client, telegramId);
    const user = userRes.rows[0];
    const isBlacklisted = user.is_blacklisted;
    // В случае, если пользователь в ч/с
    if (isBlacklisted) {
      ctx.reply('Вы попали в черный список. Для разблокировки обратитесь к администратору');
      return;
    }
    const category = user.category;
    
    if (category === 'Добавление в ЧС') {
      // Если мы в меню добавления в ЧС
      const blacklistCandidateData = await readUser(client, messageContext?.text);
      const blacklistCandidate = blacklistCandidateData.rows[0];
      if (!blacklistCandidate) {
        // Если кандидат в чс не найден в базе
        ctx.reply('Пользователь не найден в базе. Введите другой id.');
        return;
      }
      if (blacklistCandidate.user_role === 'admin') {
        // Если админ добавляет админа в чс
        ctx.reply('Вы не можете добавить администратора в черный список. Введите другой id.');
        return;
      }
      if (blacklistCandidate.is_blacklisted === true) {
        // Если добавляем в ЧС пользователя, который уже в ЧС
        ctx.reply('Пользователь уже в черном списке. Введите другой id.');
        return;
      }
      await addToBlacklist(client, messageContext?.text);
      await updateUserCategory(client, telegramId, 0);
      blacklistMenu(ctx, user.user_role);
      return;
    }
    
    if (!groups[category]) {
      // Если оказались в ситуации, когда сообщение уже отправлено,
      // А пользователь продолжает спамить в бот (категория уже 0)
      selectCategory(ctx, user.user_role);
      return;
    }

    const symbol = user.user_role === 'admin' ? '&' : 
                  (user.user_role === 'dispatcher' ? '\\*' : '');

    ctx.telegram.sendMessage(groups[category],
                            `${messageContext?.text} | от ${symbol}[${userName}](${'tg://user?id=' + telegramId})`, {parse_mode: "Markdown"});
    
    await createQuestion(client, telegramId, category, messageContext?.text);
    // После отправки сообщения возвращаем категорию пользователя в 0,
    // уведомляем об успехе и возвращаем в меню,
    // админа возвращаем в стартовое меню
    await updateUserCategory(client, telegramId, 0);
    ctx.reply('Ваше сообщение принято на обработку. Вы можете составить новое обращение.')
    setTimeout(() => {
      // пауза, чтобы сообщение об успехе не пришло раньше
      if (user.user_role === 'admin') {
        adminMenu(ctx, user.user_role);
      } else {
        selectCategory(ctx, user.user_role);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

module.exports = sendMessage;