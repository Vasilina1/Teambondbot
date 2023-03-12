const createUser = (client, telegramId) => {
  const insert = {
    text: 'INSERT INTO public.users ' + 
          '(telegram_id) ' + 
          'VALUES($1) ' +
          'ON CONFLICT DO NOTHING ' +
          'RETURNING telegram_id, user_role, is_blacklisted;',
    values: [ telegramId ],
  };
  return client.query(insert);
}

module.exports = createUser;
