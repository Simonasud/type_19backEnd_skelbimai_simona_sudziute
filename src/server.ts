import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// import mysql from 'mysql2'
import { PORT } from './config.js'
import testConnection from './helpers/msqTestRoute.js'
import adsRouter from './routes/adsRouter.js'

const app = express()

const port = PORT || 5000;

testConnection()

// Middleware
app.use(morgan('dev'))
app.use(cors())

app.get('/', (_req, res) => {
  res.json({msg: 'server is running'})
})

// Routes
app.use('/api/ads', adsRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


