import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { AdsObjType, AdsObjTypeNoId } from '../helpers/types.js';
import { checkAdsBody } from '../middleware/middleware.js';
import { ResultSetHeader } from 'mysql2';

const adsRouter = express.Router();

// const fields = [
//   'id', 'title', 'main_image_url','description', 'price', 'phone', 'type', 'town_id', 'user_id', 'category_id', 'created_at', 'is_published',
// ]

const adsCols = 'id, title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, TYPE, town_id, user_id, category_id, created_at'

// GET - /api/skelbimai 'gauname visus skelbimus'
adsRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = `SELECT ${adsCols} FROM skelbimai WHERE is_published = TRUE`;

  const [row, error] = await dbQueryWithData<AdsObjType[]>(sql) ;

  if (error) {
    console.warn('grazina visus skelbimus error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  console.log('row ===', row[0]);

  // gauti visus skelbimus objektų masyvo pavidalu
  res.json(row);
});

//Filtravimas pagal miesta, kategorija, tipa, kaina

adsRouter.get('/town', async (_req, res) => {
  const sql = `SELECT skelbimai.*, miestai.name AS town FROM skelbimai LEFT JOIN miestai ON skelbimai.town_id = miestai.id WHERE skelbimai.is_published = TRUE`
  const [row, error] = await dbQueryWithData<AdsObjType[]>(sql)

  if(error) {
    console.warn('get all towns error ===', error)
    console.warn('error message ===', error.message)
    return res.status(400).json({ error: 'something went wrong'})
  }

  res.json(row)
})

adsRouter.get('/category', async (_req, res) => {
  const sql = `SELECT skelbimai.*, kategorijos.name AS category FROM skelbimai LEFT JOIN kategorijos ON skelbimai.category_id = category.id WHERE skelbimai.is_published = TRUE`
  const [row, error] = await dbQueryWithData<AdsObjType[]>(sql)

  if(error) {
    console.warn('get all categories error ===', error)
    console.warn('error message ===', error.message)
    return res.status(400).json({ error: 'something went wrong'})
  }

  res.json(row)
})

// GET /api/ads/filter?town=Vilnius
adsRouter.get('/filter', async (req, res) => {
  const townVal = req.query.town?.toString();

 
  const categoryVal = req.query.category?.toString();
  console.log('Received query parameters: town =', townVal, ', category =', categoryVal);
  const typeVal = req.query.type?.toString(); 
  const priceVal = req.query.price?.toString();

  // if (!townVal && !categoryVal && !typeVal && !priceVal) {
  //   return res.status(400).json({ error: 'No filter criteria provided' });
  // }

  let sql = `SELECT ${adsCols} FROM skelbimai s JOIN miestai m ON s.town_id = m.id WHERE s.is_published = TRUE`;

  const argArr = [];

  if (townVal) {
    sql += ` AND m.town = ?`;
    argArr.push(townVal);
  }
  if (categoryVal) {
    sql += ` AND k.name = ?`;
    argArr.push(categoryVal);
  }
  if (typeVal) {
    sql += ` AND s.TYPE = ?`;
    argArr.push(typeVal);
  }
  if (priceVal) {
    sql += ` AND s.price = ?`;
    argArr.push(priceVal);
  }

  try {
    const [row, error] = await await dbQueryWithData<AdsObjType[]>(sql)

    if (error) {
      console.warn('Error fetching filtered ads:', error);
      return res.status(400).json({ error: 'Something went wrong while fetching filtered ads' });
    }

    res.json(row);
  } catch (error) {
    console.error('Error fetching filtered ads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - /ads/user/id/1
adsRouter.get('/user/id/:userId', async (req, res) => {
  const userId = req.params.userId;

const sql = `SELECT ${adsCols} FROM skelbimai WHERE is_published=true AND user_id=?`

const [rows, error] = await dbQueryWithData<AdsObjType[]>(sql, [userId])

if ( error) {
  console.warn('get all ads error ===', error)
  console.warn('error ===', error.message)
  return res.status(400).json({ error: 'something went wrong'})}

  if (rows.length === 0) {
    console.log('no rows');
    return res.status(404).json({ msg: `ad with id: '${userId}' was not found` });
  }

console.log('rows ===', rows);
res.json(rows)
})


// GET /api/ads/:id - grazina viena skelbima
adsRouter.get('/:addId', async (req, res) => {
  const currentId = req.params.addId;

  const sql = `SELECT ${adsCols} FROM skelbimai WHERE is_published=TRUE AND id=?`;

  const [rows, error] = await dbQueryWithData<AdsObjType[]>(sql, [currentId])

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



// POST /api/ads - sukuria nauja skelbima
adsRouter.post('/', checkAdsBody, async (req, res) => {
  const { title, main_image_url, image_1 = '', image_2 = '', image_3 = '', image_4 = '', image_5 = '', description, price, phone, TYPE, town_id, user_id, category_id} = req.body as AdsObjTypeNoId;

  const sql = `INSERT INTO skelbimai ( title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, TYPE, town_id, user_id, category_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const [result, error] = await dbQueryWithData<ResultSetHeader>(sql, [title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, TYPE, town_id, user_id, category_id]);

  if(error){
    console.warn('error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({error: 'something went wrong'})
  }
 
  res.json({success: true, result})

});


// DELETE /api/ads/:id - istrina skelbima (is_published = false)
adsRouter.delete('/:adsId', async (req, res) => {
  const currentId = req.params.adsId; // Corrected the parameter name

  const sql = `UPDATE skelbimai SET is_published = False WHERE id = ?`

  try {
    const [rows, error] = await dbQueryWithData<ResultSetHeader>(sql, [currentId]) 

    if (error) {
      console.warn('Istrinti irasa pagal id klaida:', error);
      return res.status(400).json({ error: 'Kazkas atsitiko' });
    }

    if (rows.affectedRows === 0) {
      console.log('Nerasta eiluciu');
      return res.status(404).json({ msg: `Skelbimas su id: '${currentId}' nerastas` });
    }

    console.log('Istrintas irasas:', currentId);
    res.json({ msg: `Skelbimas su id: '${currentId}' istrintas` });
  } catch (error) {
    console.error('Istrinti irasa pagal id klaida:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
});


export default adsRouter;
