const readUser = (client, telegramId) => {
  const query = {
      text: 'SELECT * FROM public.users WHERE telegram_id = $1',
      values: [telegramId]
  };
  return client.query(query);
}

module.exports = readUser;
