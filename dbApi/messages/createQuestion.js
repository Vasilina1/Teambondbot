const createQuestion = (client, telegramId, category, content) => {
  const insert = {
    text: 'INSERT INTO public.messages ' + 
          '(user_id, category, content) ' + 
          'VALUES($1, $2, $3)',
    values: [ 
      telegramId,
      category,
      content
    ],
  };
  return client.query(insert);
}

module.exports = createQuestion;
