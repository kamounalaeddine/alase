import mysql from 'mysql2/promise';

export async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'userdb',
      port: 3306  // Ajoutez le port explicitement
    });
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}