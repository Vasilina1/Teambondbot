DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  telegram_id INTEGER NOT NULL PRIMARY KEY,
  user_role TEXT DEFAULT 'user' COLLATE pg_catalog."default",
  is_blacklisted BOOLEAN DEFAULT FALSE,
  category TEXT COLLATE pg_catalog."default",
  last_msg INTEGER
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  category TEXT COLLATE pg_catalog."default",
  content TEXT COLLATE pg_catalog."default",
  answer TEXT
);