CREATE TABLE inquiries (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  organization TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL DEFAULT '',
  interest     TEXT NOT NULL DEFAULT '',
  message      TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  emailed      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX inquiries_created_at ON inquiries (created_at);
