import express from 'express';
import bcrypt from 'bcrypt';
import dbQueryWithData from '../helpers/helper.js';
import { QueryError, ResultSetHeader} from 'mysql2';

import { UserObjType } from '../helpers/types.js';

const userRouter = express.Router();

// POST /api/auth/register - registruoja nauja vartotoja
userRouter.post('/register', async (req, res) => {
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

userRouter.post('/login', async (req, res) => {
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

export default userRouter;
