import express from 'express';
import dbQueryWithData from '../helpers/helper.js';
import { UserObjType } from '../helpers/types.js';


const userRouter = express.Router();

userRouter.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  const sql = `SELECT name, avatar_url, email, created_at FROM vartotojai WHERE id = ?
  `

  const [userArr, msqlErr] = await dbQueryWithData<UserObjType[]>(sql, [userId])

  if(msqlErr) {
    console.warn('msqlErr ===', msqlErr);
    
    return res.status(500).json({
      message: 'Something went wrong'
    })
  }
  console.log('userArr ===', userArr);

  if(userArr.length === 0) {
    return res.status(404).json(`User with id ${userId} was not found`)
  }

  res.json(userArr[0])
})

export default userRouter;
