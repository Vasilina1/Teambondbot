DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  telegram_id BIGINT NOT NULL PRIMARY KEY,
  user_role TEXT DEFAULT 'user' COLLATE pg_catalog."default",
  is_blacklisted BOOLEAN DEFAULT FALSE,
  category TEXT COLLATE pg_catalog."default",
  last_msg BIGINT
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  message_id BIGINT,
  sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  category TEXT COLLATE pg_catalog."default",
  content TEXT COLLATE pg_catalog."default",
  answer TEXT
);