const removeUserFromBlacklist = (client, telegramId) => {
  const update = {
    text: 'UPDATE public.users ' + 
          `SET is_blacklisted = false ` + 
          'WHERE telegram_id = $1;',
    values: [telegramId],
  };
  return client.query(update);
}

module.exports = removeUserFromBlacklist;
