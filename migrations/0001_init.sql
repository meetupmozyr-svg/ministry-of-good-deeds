CREATE TABLE IF NOT EXISTS users (
  telegram_id TEXT PRIMARY KEY,
  first_name TEXT,
  username TEXT,
  display_name TEXT,
  rank TEXT DEFAULT 'Новичок',
  points INTEGER NOT NULL DEFAULT 0,
  photo_data TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress (
  telegram_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (telegram_id, task_id),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS saved_materials (
  telegram_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (telegram_id, material_id),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);
