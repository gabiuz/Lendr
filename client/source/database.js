// Connect Database to Client (MySQL) (1)

import mysql from 'mysql2/promise';


let pool;

function getPool() {
    if (pool) return pool;
    if (global._MYSQL_POOL) {
        pool = global._MYSQL_POOL;
        return pool;
    }

    if (process.env.MYSQL_DATABASE_URL) {
        pool = mysql.createPool(process.env.MYSQL_DATABASE_URL);
    } else {
        pool = mysql.createPool({
      host:'localhost',
      user:'root',
      password:'', // Add your own password here
      database: 'lendr',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    }

    if (process.env.NODE_ENV === 'development') {
    global._MYSQL_POOL = pool;
  }

  return pool;
}

export async function query({ query, values = [] }) {
  const pool = getPool();
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    // Re-throw a clear error for callers to handle/log.
    throw new Error(error.message || 'Database query error');
  }

}
