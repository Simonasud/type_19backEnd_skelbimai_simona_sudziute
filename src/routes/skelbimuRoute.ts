import express from "express";

const skelbimuRouter = express.Router()

// GET - /skelbimai 'gauname visus skelbimus'
skelbimuRouter.get('/', async (_req, res) => {
  // panaudoti dbQueryWithData
  // gauti visus trips objektus masyvo pavidalu
  res.json('gauname visus skelbimus')
})


export default skelbimuRouter