import mysql from 'mysql2/promise';
import { dbConfig } from '../config.js';

type QueryResult<T> = [T, null] | [null, Error];

export default async function dbQueryWithData<T>(
  sql: string,
  argArr: (string | number)[] = [],
): Promise<QueryResult<T>> {
  let conn;
  try {
    // prisijungti prie DB
    conn = await mysql.createConnection(dbConfig);
    // atlikti veikma
    const [rows, _fields] = await conn.execute(sql, argArr);
    // console.log('fields ===', fields);
    // grazinti duomenis
    return [rows as T, null];
  } catch (error) {
    return [null, error as Error];
  } finally {
    // atsijungti nuo DB
    if (conn) conn.end();
  }
}