// Модуль получения ответа от AI
// Выполняется в рантайме сервера, при запросе от пользователя

const Model = require('./model.json');

const getCompletion = async (openai, prompt) => {
  try {
    const completionData = await openai.createCompletion({
      model: Model.fine_tuned_model,
      prompt,
      max_tokens: 1000,
      temperature: 0,
      presence_penalty: 2
    });
    console.log(completionData?.data?.choices)
    const completion = completionData?.data?.choices[0]?.text || '';
    return completion;
  } catch (err) {
    console.log(err);
    return 'Произошла ошибка. Пожалуйста, попробуйте позже.'
  }
};

module.exports = getCompletion;