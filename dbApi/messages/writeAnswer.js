// const writeAnswer = (client, telegramId, category) => {
//   const update = {
//     text: 'UPDATE public.users ' + 
//           `SET category = $2 ` + 
//           'WHERE telegram_id = $1;',
//     values: [
//       telegramId,
//       category
//     ],
//   };
//   return client.query(update);
// }

// module.exports = writeAnswer;
