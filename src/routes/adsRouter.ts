import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { AdsObjType } from '../helpers/types.js';

const adsRouter = express.Router();

// const fields = [
//   'id', 'title', 'main_image_url','description', 'price', 'phone', 'type', 'town_id', 'user_id', 'category_id', 'created_at', 'is_published',
// ]

const adsCols = 'id, title, main_image_url, description, price, phone, TYPE, town_id, user_id, category_id, created_at'

// GET - /api/skelbimai 'gauname visus skelbimus'
adsRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = `SELECT ${adsCols} FROM skelbimai WHERE is_published = TRUE`;

  const [row, error] = await dbQueryWithData(sql) as [AdsObjType[], Error];

  if (error) {
    console.warn('grazina visus skelbimus error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  console.log('row ===', row[0]);

  // gauti visus skelbimus objektų masyvo pavidalu
  res.json(row);
});


// GET /api/ads/:id - grazina viena skelbima
adsRouter.get('/:addId', async (req, res) => {
  const currentId = req.params.addId;

  const sql = `SELECT ${adsCols} FROM skelbimai WHERE is_published = TRUE AND id=?`;

  const [rows, error] = (await dbQueryWithData(sql, [currentId])) as [AdsObjType[], Error];

  if (error) {
    console.warn('grazinti viena irasa pagal id error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  if (rows.length === 0) {
    console.log('no rows');
    return res.status(404).json({ msg: `ad with id: '${currentId}' was not found` });
  }
  
  console.log('rows ===', rows);
  res.json(rows[0]);
});


export default adsRouter;
