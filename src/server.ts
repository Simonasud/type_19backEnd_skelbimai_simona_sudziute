import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// import mysql from 'mysql2'
import skelbimuRouter from './routes/skelbimuRoute.js'
import { PORT, dbConfig } from './config.js'

const app = express()

const port = PORT || 5000;

console.log('dbConfig ===', dbConfig);



// Middleware
app.use(morgan('dev'))
app.use(cors())

app.get('/', (_req, res) => {
  res.json({msg: 'server is running'})
})

// Routes
app.use('/skelbimai', skelbimuRouter)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


