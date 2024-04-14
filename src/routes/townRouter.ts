import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import {  TownType, TownTypeNoId } from '../helpers/types.js';
import { ResultSetHeader } from 'mysql2';
import { checkTownBody } from '../middleware/middleware.js';


const townRouter = express.Router();

const townCols = 'id, name, population, area'

//GET /api/towns - grazina visus miestus
townRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  const sql = `SELECT ${townCols} FROM miestai`;

  const [row, error] = await dbQueryWithData<TownType[]>(sql) 

  if (error) {
    console.warn('grazina visus miestu error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  console.log('row ===', row[0]);

  // gauti visus skelbimus objektų masyvo pavidalu
  res.json(row);
});

// GET /api/ads/town/klaipeda - grazinti visus skelbimus kurie priklauso tam


// GET /api/towns/:id - grazina viena miesta
townRouter.get('/:twonId', async (req, res) => {
  const currentTownId = req.params.twonId;

  const sql = `SELECT ${townCols} FROM miestai WHERE id=?`;

  const [rows, error] = (await dbQueryWithData<TownType[]>(sql, [currentTownId])) 

  if (error) {
    console.warn('grazinti viena miesta pagal id error ===', error);
    console.log('error ===', error.message);
    return res.status(400).json({ error: 'kazkas atsitiko' });
  }

  if (rows.length === 0) {
    console.log('no rows');
    return res.status(404).json({ msg: `town with id: '${currentTownId}' was not found` });
  }
  
  console.log('rows ===', rows);
  res.json(rows[0]);
});



// POST /api/towns - sukuria nauja miesta
townRouter.post('/', checkTownBody, async (req, res) => {
  const { name, population, area } = req.body as TownTypeNoId;

  const argArr = [ name, population, area ];

  const sql = `INSERT INTO miestai (name, population, area) VALUES (?, ?, ?)`;

  try {
    const [result] = await dbQueryWithData(sql, argArr);
    if (result && typeof result === 'object' && 'insertId' in result) {
      const insertedId = result.insertId;
      res.json({ id: insertedId, ...req.body } as TownType);
    } else {
      throw new Error('Įvyko klaida kuriant naują miesta');
    }
  } catch (error) {
    console.error('Sukurti naują skelbimą klaida:', error);
    res.status(400).json({ error: 'Įvyko klaida kuriant naują miesta' });
  }
});


// DELETE /api/towns/:id - istrina miesta
townRouter.delete('/:id', async (req, res) => {
  const currentTownId = req.params.id;

  const sql = `DELETE FROM miestai WHERE id = ?`;

  try {
    const [result, error] = await dbQueryWithData<ResultSetHeader>(sql, [currentTownId])

    if (error) {
      console.warn('Istrinti irasa pagal id klaida:', error);
      return res.status(400).json({ error: 'Kazkas atsitiko' });
    }

    if (result.affectedRows === 0) {
      console.log('Nerasta eiluciu');
      return res.status(404).json({ msg: `Miestas su id: '${currentTownId}' nerastas` });
    }

    console.log('Istrintas miestas:', currentTownId);
    res.json({ msg: `Miestas su id: '${currentTownId}' istrintas` });
  } catch (error) {
    console.error('Istrinti miesta pagal id klaida:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
});


export default townRouter;
