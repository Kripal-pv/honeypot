import sqlite3
import time
import json

DB_NAME = "honeypot.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS logs
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  timestamp TEXT,
                  ip TEXT,
                  port INTEGER,
                  payload TEXT)''')
    conn.commit()
    conn.close()

def add_log(ip, port, payload):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    c.execute("INSERT INTO logs (timestamp, ip, port, payload) VALUES (?, ?, ?, ?)",
              (timestamp, ip, port, payload))
    conn.commit()
    conn.close()

def get_logs(limit=50):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
