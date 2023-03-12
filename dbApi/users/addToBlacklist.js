const addToBlacklist = (client, telegramId) => {
  const update = {
    text: 'UPDATE public.users ' + 
          `SET is_blacklisted = true ` + 
          'WHERE telegram_id = $1;',
    values: [telegramId],
  };
  return client.query(update);
}

module.exports = addToBlacklist;
