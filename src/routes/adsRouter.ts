import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { AdsObjType } from '../helpers/types.js';

const adsRouter = express.Router();

// const fields = [
//   'id', 'title', 'main_image_url','description', 'price', 'phone', 'type', 'town_id', 'user_id', 'category_id', 'created_at', 'is_published',
// ]

// GET - /api/skelbimai 'gauname visus skelbimus'
adsRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = "SELECT id, title, main_image_url, description, price, phone, TYPE, town_id, user_id, category_id, created_at, is_published FROM skelbimai";

  const [row, error] = await dbQueryWithData(sql) as [AdsObjType[], Error];

  if (error) {
    console.warn('error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  console.log('row ===', row[0]);

  // gauti visus skelbimus objektų masyvo pavidalu
  res.json(row);
});

export default adsRouter;
