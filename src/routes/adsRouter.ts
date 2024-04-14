import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { AdsObjType, AdsObjTypeNoId } from '../helpers/types.js';
import { checkAdsBody } from '../middleware/middleware.js';
import { ResultSetHeader } from 'mysql2';

const adsRouter = express.Router();

// const fields = [
//   'id', 'title', 'main_image_url','description', 'price', 'phone', 'type', 'town_id', 'user_id', 'category_id', 'created_at', 'is_published',
// ]

const adsCols = 'id, title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, type, town_id, user_id, category_id, created_at'

// const adsColsWithEmail = 'skelbimai.id, skelbimai.title, skelbimai main_image_url, skelbimai.image_1, skelbimai.image_2, skelbimai.image_3,skelbimai.image_4, skelbimai.image_5, skelbimai.description, skelbimai.price,skelbimai.phone, skelbimai.type, skelbimai.town_id, skelbimai.user_id, skelbimai.category_id, skelbimai.created_at, vartotojai.email'

// GET - /api/skelbimai 'gauname visus skelbimus'
adsRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = `SELECT skelbimai.id, skelbimai.title, skelbimai.main_image_url, skelbimai.image_1,skelbimai.image_2, skelbimai.image_3, skelbimai.image_4, skelbimai.image_5, skelbimai.description, skelbimai.price, skelbimai.phone, skelbimai.type, skelbimai.town_id, 
  skelbimai.user_id, 
  skelbimai.category_id, 
  skelbimai.created_at, 
  vartotojai.email, 
  miestai.NAME AS town_name, 
  kategorijos.NAME AS category_name
FROM 
  skelbimai
LEFT JOIN 
  vartotojai ON skelbimai.user_id = vartotojai.id
LEFT JOIN 
  miestai ON skelbimai.town_id = miestai.id
LEFT JOIN 
  kategorijos ON skelbimai.category_id = kategorijos.id
WHERE 
  skelbimai.is_published = TRUE`;

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

adsRouter.get('/town', async (req, res) => {
  const townName = req.query.town; // Gauname miesto pavadinimą iš užklausos

  if (typeof townName !== 'string') {
    return res.status(400).json({ error: 'Invalid town name' });
  }

  const sql = `SELECT
    skelbimai.id,
    skelbimai.title,
    skelbimai.main_image_url,
    skelbimai.image_1,
    skelbimai.image_2,
    skelbimai.image_3,
    skelbimai.image_4,
    skelbimai.image_5,
    skelbimai.description,
    skelbimai.price,
    skelbimai.phone,
    skelbimai.type,
    skelbimai.town_id,
    skelbimai.user_id,
    skelbimai.category_id,
    skelbimai.created_at,
    vartotojai.email,
    miestai.NAME AS town_name,
    kategorijos.NAME AS category_name
  FROM
    skelbimai
  LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
  LEFT JOIN miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE
    skelbimai.is_published = TRUE AND miestai.NAME = ?`; // Naudokite klausimo ženklą parametrui

  try {
    const [row, error] = await dbQueryWithData<AdsObjType[]>(sql, [townName]); // Pateikiame miesto pavadinimą kaip parametrą

    if (error) {
      console.warn('get all towns error ===', error);
      console.warn('error message ===', error.message);
      return res.status(400).json({ error: 'something went wrong' });
    }

    res.json(row);
  } catch (error) {
    console.error('get all towns error ===', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

adsRouter.get('/price', async (req, res) => {
  const priceName = req.query.price; // Gauname miesto pavadinimą iš užklausos

  if (typeof priceName !== 'string') {
    return res.status(400).json({ error: 'Incorect price' });
  }

  const sql = `SELECT
    skelbimai.id,
    skelbimai.title,
    skelbimai.main_image_url,
    skelbimai.image_1,
    skelbimai.image_2,
    skelbimai.image_3,
    skelbimai.image_4,
    skelbimai.image_5,
    skelbimai.description,
    skelbimai.price,
    skelbimai.phone,
    skelbimai.type,
    skelbimai.town_id,
    skelbimai.user_id,
    skelbimai.category_id,
    skelbimai.created_at,
    vartotojai.email,
    miestai.NAME AS town_name,
    kategorijos.NAME AS category_name
  FROM
    skelbimai
  LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
  LEFT JOIN miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE
    skelbimai.is_published = TRUE AND skelbimai.price = ?`; // Naudokite klausimo ženklą parametrui

  try {
    const [row, error] = await dbQueryWithData<AdsObjType[]>(sql, [priceName]); // Pateikiame miesto pavadinimą kaip parametrą

    if (error) {
      console.warn('get all prices error ===', error);
      console.warn('error message ===', error.message);
      return res.status(400).json({ error: 'something went wrong' });
    }

    res.json(row);
  } catch (error) {
    console.error('get all prices error ===', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

adsRouter.get('/type', async (req, res) => {
  const typeName = req.query.type; // Gauname miesto pavadinimą iš užklausos

  if (typeof typeName !== 'string') {
    return res.status(400).json({ error: 'Incorect price' });
  }

  const sql = `SELECT
    skelbimai.id,
    skelbimai.title,
    skelbimai.main_image_url,
    skelbimai.image_1,
    skelbimai.image_2,
    skelbimai.image_3,
    skelbimai.image_4,
    skelbimai.image_5,
    skelbimai.description,
    skelbimai.price,
    skelbimai.phone,
    skelbimai.type,
    skelbimai.town_id,
    skelbimai.user_id,
    skelbimai.category_id,
    skelbimai.created_at,
    vartotojai.email,
    miestai.NAME AS town_name,
    kategorijos.NAME AS category_name
  FROM
    skelbimai
  LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
  LEFT JOIN miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE
    skelbimai.is_published = TRUE AND skelbimai.type = ?`; // Naudokite klausimo ženklą parametrui

  try {
    const [row, error] = await dbQueryWithData<AdsObjType[]>(sql, [typeName]); // Pateikiame miesto pavadinimą kaip parametrą

    if (error) {
      console.warn('get all type error ===', error);
      console.warn('error message ===', error.message);
      return res.status(400).json({ error: 'something went wrong' });
    }

    res.json(row);
  } catch (error) {
    console.error('get all types error ===', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

adsRouter.get('/category', async (req, res) => {
  const categoryName = req.query.type; // Gauname miesto pavadinimą iš užklausos

  if (typeof categoryName !== 'string') {
    return res.status(400).json({ error: 'Incorect price' });
  }

  const sql = `SELECT
    skelbimai.id,
    skelbimai.title,
    skelbimai.main_image_url,
    skelbimai.image_1,
    skelbimai.image_2,
    skelbimai.image_3,
    skelbimai.image_4,
    skelbimai.image_5,
    skelbimai.description,
    skelbimai.price,
    skelbimai.phone,
    skelbimai.type,
    skelbimai.town_id,
    skelbimai.user_id,
    skelbimai.category_id,
    skelbimai.created_at,
    vartotojai.email,
    miestai.NAME AS town_name,
    kategorijos.NAME AS category_name
  FROM
    skelbimai
  LEFT JOIN vartotojai ON skelbimai.user_id = vartotojai.id
  LEFT JOIN miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE
    skelbimai.is_published = TRUE AND kategorijos.NAME = ?`; // Naudokite klausimo ženklą parametrui

  try {
    const [row, error] = await dbQueryWithData<AdsObjType[]>(sql, [categoryName]); // Pateikiame miesto pavadinimą kaip parametrą

    if (error) {
      console.warn('get all category error ===', error);
      console.warn('error message ===', error.message);
      return res.status(400).json({ error: 'something went wrong' });
    }

    res.json(row);
  } catch (error) {
    console.error('get all categories error ===', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ads/filter?town=Vilnius
adsRouter.get('/filter', async (req, res) => {
  // const { town, category, price, type } = req.query;
  const categoryVal = req.query.category?.toString();
  const townVal = req.query.town?.toString();
  const typeVal = req.query.type?.toString();
  const priceVal = req.query.price?.toString();

  let sql = `SELECT
    skelbimai.id,
    skelbimai.title,
    skelbimai.main_image_url,
    skelbimai.image_1,
    skelbimai.image_2,
    skelbimai.image_3,
    skelbimai.image_4,
    skelbimai.image_5,
    skelbimai.description,
    skelbimai.price,
    skelbimai.phone,
    skelbimai.type,
    skelbimai.town_id,
    skelbimai.user_id,
    skelbimai.category_id,
    skelbimai.created_at,
    vartotojai.email,
    miestai.NAME AS town_name,
    kategorijos.NAME AS category_name
  FROM 
    skelbimai
  LEFT JOIN 
    vartotojai ON skelbimai.user_id = vartotojai.id
  LEFT JOIN 
    miestai ON skelbimai.town_id = miestai.id
  LEFT JOIN 
    kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE 
    skelbimai.is_published = TRUE`;

  const valuesArr = [];

  if (townVal) {
    sql += ` AND miestai.NAME = ?`;
    valuesArr.push(townVal);
  }
  if (categoryVal) {
    sql += ` AND kategorijos.NAME = ?`;
    valuesArr.push(categoryVal);
  }
  if (priceVal) {
    sql += ` AND skelbimai.price <= ?`;
    valuesArr.push(priceVal);
  }
  if (typeVal) {
    sql += ` AND skelbimai.type = ?`;
    valuesArr.push(typeVal);
  }

  try {
    const [row, error] = await dbQueryWithData<AdsObjType[]>(sql, valuesArr);

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

  const sql = `SELECT skelbimai.id, skelbimai.title, skelbimai.main_image_url, skelbimai.image_1, skelbimai.image_2, skelbimai.image_3, skelbimai.image_4, skelbimai.image_5,skelbimai.description, skelbimai.price,
  skelbimai.phone,
  skelbimai.type,
  skelbimai.town_id,
  skelbimai.user_id,
  skelbimai.category_id,
  skelbimai.created_at,
  vartotojai.email,
  miestai.NAME AS town_name,
  kategorijos.NAME AS category_name
FROM 
  skelbimai
LEFT JOIN 
  vartotojai ON skelbimai.user_id = vartotojai.id
LEFT JOIN 
  miestai ON skelbimai.town_id = miestai.id
LEFT JOIN 
  kategorijos ON skelbimai.category_id = kategorijos.id
  WHERE 
  skelbimai.is_published = TRUE AND skelbimai.id = ?`;

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
  const { title, main_image_url, image_1 = '', image_2 = '', image_3 = '', image_4 = '', image_5 = '', description, price, phone, type, town_id, user_id, category_id} = req.body as AdsObjTypeNoId;

  const sql = `INSERT INTO skelbimai ( title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, type, town_id, user_id, category_id)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const [result, error] = await dbQueryWithData<ResultSetHeader>(sql, [title, main_image_url, image_1, image_2, image_3, image_4, image_5, description, price, phone, type, town_id, user_id, category_id]);

  if(error){
    console.warn('error ===', error);
    console.warn('error ===', error.message);
    return res.status(400).json({error: 'something went wrong'})
  }
 
  res.json({success: true, result})

});


// DELETE /api/ads/:id - istrina skelbima (is_published = false)
adsRouter.delete('/:adsId', async (req, res) => {
  const currentAddId = req.params.adsId; // Corrected the parameter name
  console.log('req.body ===', req.body);
  console.log('currentId ===', currentAddId);

 


  const sqll ='SELECT * FROM skelbimai WHERE id=?'
  const [adsArr, myEror] = await dbQueryWithData<AdsObjType[]>(sqll, [currentAddId])

  if(myEror) {
    console.log('myEror ===', myEror);
      return res.status(404).json({error: 'Skelbimas su tokiu id nerastas'})
  }
  console.log('adsArr ===', adsArr);
  const addUserId = adsArr[0].user_id;
  // return res.status(400).json(adsArr)


  if(req.body.userId !== addUserId){
    return res.status(401).json('Only owner can delete')
  }

  const sql = `UPDATE skelbimai SET is_published = False WHERE id = ?`
  
  
  // return

  try {
    const [rows, error] = await dbQueryWithData<ResultSetHeader>(sql, [currentAddId]) 

    if (error) {
      console.warn('Istrinti irasa pagal id klaida:', error);
      return res.status(400).json({ error: 'Kazkas atsitiko' });
    }

    if (rows.affectedRows === 0) {
      console.log('Nerasta eiluciu');
      return res.status(404).json({ msg: `Skelbimas su id: '${currentAddId}' nerastas` });
    }

    console.log('Istrintas irasas:', currentAddId);
    res.json({ msg: `Skelbimas su id: '${currentAddId}' istrintas` });
  } catch (error) {
    console.error('Istrinti irasa pagal id klaida:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
});


export default adsRouter;
