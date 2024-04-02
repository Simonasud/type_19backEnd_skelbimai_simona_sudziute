import express from "express";

const skelbimuRouter = express.Router()

// GET - /skelbimai 'gauname visus skelbimus'
skelbimuRouter.get('/', async (_req, res) => {
  res.json('gauname visus skelbimus')
})


export default skelbimuRouter