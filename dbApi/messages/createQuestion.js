const createQuestion = (client, telegramId, messageId, category, content) => {
  const insert = {
    text: 'INSERT INTO public.messages ' + 
          '(user_id, message_id, category, content) ' + 
          'VALUES($1, $2, $3, $4)',
    values: [ 
      telegramId,
      messageId,
      category,
      content,
    ],
  };
  return client.query(insert);
}

module.exports = createQuestion;
