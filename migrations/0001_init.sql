CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bike_compensation_per_km REAL NOT NULL DEFAULT 0.23,
  one_way_distance_km REAL NOT NULL DEFAULT 15.0,
  car_cost_per_km REAL NOT NULL DEFAULT 0.45,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commute_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT DEFAULT 'anonymous',
  date TEXT NOT NULL,
  transport_type TEXT NOT NULL CHECK (transport_type IN ('bicycle','car','sick','vacation')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_commute_user_date ON commute_days(user_id, date);
CREATE INDEX IF NOT EXISTS idx_commute_date ON commute_days(date);
