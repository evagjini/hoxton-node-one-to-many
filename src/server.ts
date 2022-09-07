import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'



const db = Database('/db/data.db', {verbose:console.log})
const app = express()
app.use(cors())
app.use(express.json())

const port = 5666

const getMuseums = db.prepare(`
SELECT * FROM museums
`)

app.get('/museums', (req,res)=>{
const museums = getMuseums.all()
res.send(museums)
})

app.get('/museums/:id', (req,res)=>{})

app.get('/works', (req,res)=>{})

app.get('/works/:id', (req,res)=>{})

app.listen(port, ()=>{
    console.log(`Yayy: http://localhost:${port}`)
})