const writeAnswer = (client, messageId, category, answer) => {
  const update = {
    text: 'UPDATE public.messages ' + 
          `SET answer = $3 ` + 
          'WHERE message_id = $1 AND category = $2;',
    values: [
      messageId,
      category,
      answer
    ],
  };
  return client.query(update);
}

module.exports = writeAnswer;
