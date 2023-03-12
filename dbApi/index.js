const { Client } = require('pg');

const initPgConnection = () => {
  const client = new Client({
    connectionString: process.env.HEROKU_POSTGRESQL_CHARCOAL_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  return client;
};

module.exports = initPgConnection;
