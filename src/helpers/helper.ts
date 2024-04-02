//
import mysql from 'mysql2'
import { dbConfig } from '../config.js';

export default async function dbQueryWithData(sql: string, argArr: (string | number)[]= []) {
  let conn;
  try {
      // prisijungti prie duomenu bazes
      conn = await mysql.createConnection(dbConfig)
      const [rows, fields] =  await conn.execute(sql, argArr)
      console.log('fields ===', fields);
      // grazinti duomenis
      return [rows, null]
  } catch (error) {
      console.error('Klaida vykdant duomenų bazės užklausą:', error);
      return [null, error]
  } finally {
      // atsijungia nuo duomenu bazes
      if(conn) conn.end()
  }
}

