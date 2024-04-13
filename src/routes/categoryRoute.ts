import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { CategoryType } from '../helpers/types.js';

const categoryRouter = express.Router();

//GET /api/towns - grazina visus miestus
categoryRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = `SELECT * FROM kategorijos`;

  const [row, error] = await dbQueryWithData<CategoryType[]>(sql) 

  if (error) {
    console.warn('grazina visus miestu error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  console.log('row ===', row[0]);

  // gauti visus skelbimus objektų masyvo pavidalu
  res.json(row);
});

export default categoryRouter;
