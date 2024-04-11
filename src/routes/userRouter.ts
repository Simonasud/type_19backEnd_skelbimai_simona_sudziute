import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { ResultSetHeader } from 'mysql2';
import bcrypt from "bcrypt";
import { UserObjType } from '../helpers/types.js';

const userRouter = express.Router();

// POST /api/auth/register - registruoja nauja vartotoja
userRouter.post('/register', async (req, res) => {
  const { NAME, email, PASSWORD, avatar_url } = req.body;


  const insertSql = `INSERT INTO vartotojai (NAME, email, PASSWORD, avatar_url)
  VALUES (?, ?, ?, ?)`;

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(PASSWORD, salt);
  const [result, insertError] = (await dbQueryWithData(insertSql, [
    NAME,
    email,
    passwordHash,
    avatar_url
  ])) as [ResultSetHeader, Error];

  if (insertError) {
    console.warn('insertError ===', insertError);
    console.warn('error ===', insertError.message);

    if (insertError?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Vartotojas su tokiu el. paštu jau egzistuoja' });
    }
    return res.status(400).json({ error: 'something went wrong' });
  }
  if (result.affectedRows === 0) {
    return res.status(400).json({ error: 'user was not created' });
  }
  res.json({ success: true, email });
});

// POST /api/auth/login - prisijungia vartotoja Slaptazodziai turetu buti saugomi hashuotu formatu. Brcypt arba kitu biblioteku pagalba.
userRouter.post('/login', async (req, res) => {
  const {email, password: passwordHash} = req.body
  const selectSql = `SELECT * FROM vartotojai WHERE email=?`;
  const [ users, selectError ] = (await dbQueryWithData(selectSql, [email])) as [
    UserObjType[],
    Error,
  ];
  if(selectError) {
    console.log('select user error ===', selectError)
    return res.status(400).json({error: 'something went wrong'})
  }

  if (users.length === 0) {
    return res.status(400).json({ error: 'tokio vartotojo nera' })
  }

  const userObj = users[0]

  if(userObj.password !== passwordHash){
    return res.status(400).json({ error: 'Email or password is incorect'})
  }
  res.json({success: true, email: userObj.email, name: userObj.name})
});

export default userRouter;
