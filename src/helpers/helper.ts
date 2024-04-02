import mysql from 'mysql2/promise'; // Importuojame mysql2 biblioteką su pažadais
import { dbConfig } from '../config.js';

export default async function dbQueryWithData(sql: string, argArr: (string | number)[] = []) {
  let conn;
  try {
    // Prisijungiame prie duomenų bazės
    conn = await mysql.createConnection(dbConfig);
    const [rows, _fields] = await conn.execute(sql, argArr);
    // Graziname duomenis
    return [rows, null];
  } catch (error) {
    console.error('Klaida vykdant duomenų bazės užklausą:', error);
    return [null, error];
  } finally {
    // Atsijungiame nuo duomenų bazės
    if (conn) conn.end();
  }
}
