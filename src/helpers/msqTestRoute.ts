import mysql from 'mysql2/promise';
import { dbConfig } from '../config.js';

// connect
export default async function testConnection() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query('SELECT 1');
    console.log('Succesfuly connected to mysql');
  } catch (error) {
    console.log('testConnection failed, did you start MAMP mate???');
    console.log(error);
  } finally {
    if (conn) conn.end();
  }
}