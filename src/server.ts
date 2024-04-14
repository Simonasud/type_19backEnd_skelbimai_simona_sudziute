import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// import mysql from 'mysql2'
import { PORT } from './config.js'
import testConnection from './helpers/msqTestRoute.js'
import adsRouter from './routes/adsRouter.js'
import townRouter from './routes/townRouter.js'
import userRouter from './routes/userRouter.js'
import categoryRouter from './routes/categoryRoute.js'
import authRouter from './routes/authRouter.js'

const app = express()

const port = PORT || 5000;

testConnection()

// Middleware
app.use(morgan('dev'))
app.use(cors())
// leisti gauti duomenis json formatu
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({msg: 'server is running'})
})

// Routes
app.use('/api/ads', adsRouter);
app.use('/api/town', townRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);


// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


