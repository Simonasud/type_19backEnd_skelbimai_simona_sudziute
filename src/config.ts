// config.ts

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
port: parseInt(process.env.DB_PORT || '3309'), // Convert to number using parseInt
};

export const PORT = process.env.PORT;

console.log('dbConfig ===', dbConfig);