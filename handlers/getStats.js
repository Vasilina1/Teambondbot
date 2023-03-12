const getStatistics = require('../dbApi/messages/getStatistics');

const { Pool } = require('pg');
const pool = new Pool();

const getStats = async (ctx, statsPeriod, statsType) => {
  const client = await pool.connect();
  try {
    const statsData = await getStatistics(client, statsPeriod, statsType);
    console.log(statsData?.rows)
    const stats = statsData?.rows;

    let reply = '';
    if (statsType === 'messages') {
      reply = 'Отправлено сообщений: ' + stats[0].count;
    } else if (statsType === 'categories') {
      const categoryStats = stats.map(v => `${v.category} \\- ${v.count}`).join('\n');
      reply = 'Отправлено запросов:\n' + categoryStats;
    } else if (statsType === 'orders') {
      const userStats = stats.map(v => `[${v.user_id}](${'tg://user?id=' + v.user_id}) \\- ${v.count}`).join('\n');
      reply = 'Отправлено сообщений:\n' + userStats;
    }

    ctx.replyWithMarkdownV2(reply);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  };
};

module.exports = getStats;