import express from 'express';
import bcrypt from 'bcrypt';
import dbQueryWithData from '../helpers/helper.js';
import { QueryError, ResultSetHeader} from 'mysql2';

import { UpdateUserObjType, UserObjType } from '../helpers/types.js';

const authRouter = express.Router();

// POST /api/auth/register - registruoja nauja vartotoja
authRouter.post('/register', async (req, res) => {
  const { NAME, email, PASSWORD, avatar_url } = req.body;

  const insertSql = `INSERT INTO vartotojai (NAME, email, PASSWORD, avatar_url)
  VALUES (?, ?, ?, ?)`;
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const [result, insertError] = (await dbQueryWithData<ResultSetHeader>(insertSql, [
    NAME,
    email,
    passwordHash,
    avatar_url
  ]));

  if (insertError) {
    const msqlErr = insertError as QueryError;
    console.warn('insertError ===', insertError);
    console.warn('error ===', insertError.message);

    if (msqlErr.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    return res.status(400).json({ error: 'something went wrong' });
  }
  if (result.affectedRows === 0) {
    return res.status(400).json({ error: 'user was not created' });
  }
 
  res.json({ success: true, email, NAME, id: result.insertId });
});

authRouter.post('/login', async (req, res) => {
  const { email,  PASSWORD: plainPassword } = req.body;

  const selectSql = `SELECT * FROM vartotojai WHERE email=?`;
  const [users, selectError] = await dbQueryWithData<UserObjType[]>(selectSql, [email]);

  if (selectError) {
    console.log('select user error ===', selectError);
    return res.status(400).json({ error: 'something went wrong' });
  }

  if (users.length === 0) {
    return res.status(400).json({ error: 'User does not exist' });
  }
  const userObj = users[0];
  const isMatch = await bcrypt.compare(plainPassword, userObj.PASSWORD);
  console.log('isMatch ===', isMatch);

  if (!isMatch) {
    return res.status(400).json({ error: 'Email or password is incorrect (p)' });
  }

  res.json({ success: true, email: userObj.email, name: userObj.NAME, id: userObj.id });

});

authRouter.put('/user/update/:userId', async (req, res) => {
  // pasiimiti user id
  const { userId } = req.params;
  // pasiimti password ir currentPassword is req body
  const { email, PASSWORD: newPassword, NAME, currentPassword } = req.body as UpdateUserObjType;
  console.log('req.body ===', req.body);

  // step1 - login
  // surasti user pgl id
  const selectSql = `SELECT * FROM vartotojai WHERE id = ?`;
  const [users, selectError] = await dbQueryWithData<UserObjType[]>(selectSql, [userId]);

  if (selectError) {
    console.warn('password/user update ===', selectError);
    return res.status(500).json({ error: 'something went wrong' });
  }

  if (users.length === 0) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  // 3. jei yra. jau turim gave userObj ziurim ar sutampa slaptazodziai?
  const userObj = users[0];
  console.log('userObj ===', userObj);
  // patikrinti slaptazodziai
  // lyginam req.body.currentPassword(plain) su userObj.password(hash)
  const arSutampaSlaptazodziai = await bcrypt.compare(currentPassword.toString(), userObj.PASSWORD);
  if (!arSutampaSlaptazodziai) {
    return res
      .status(400)
      .json({ code: 'pass', error: 'Email or password is incorrect (p current pass)' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  //nustato user su id userId slaptazodi i passwordHash
  const sql = `UPDATE vartotojai SET password = ? WHERE id = ?`;
  const [result, insertError] = await dbQueryWithData<ResultSetHeader>(sql, [passwordHash, userId]);
  // jei sutampa register logic
  if (insertError) {
    console.warn('password/user update ===', insertError);
    return res.status(500).json({ error: 'something went wrong' });
  }

  if (result.affectedRows === 0) {
    return res.status(400).json('Nothing changed');
  }

  res.json({ success: true });
});



export default authRouter;