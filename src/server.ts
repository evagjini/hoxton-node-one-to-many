import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'



const db = Database('./db/data.db', {verbose:console.log})
const app = express()
app.use(cors())
app.use(express.json())

const port = 5666;

const getMuseums = db.prepare(`
SELECT * FROM museums 
`)

 const getWorksForMuseums = db.prepare(`
 SELECT * FROM works WHERE museumId = @museumId
 `)
 const getMuseumById = db.prepare(`
 SELECT * FROM museums WHERE Id = @id
 
 `)

 const getWorks = db.prepare(`
 SELECT * FROM works`)

 const getWorkById = db.prepare(`
 SELECT * FROM works WHERE id= @id`)

 const createMuseum = db.prepare(`
 INSERT INTO museums (name, city) VALUES (@name,@city);
 `);

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (@name, @picture, @museumId)`)

const deleteAMuseum = db.prepare(`
DELETE FROM museums WHERE id= @id
`)

app.get('/', (req, res) =>{
    res.send(`
    <h1> Welcome to Museums and Works from all over the World !! </h1>
    <ul>
    <li> <a href="/museums"> Museums </a> </li>
    <li> <a href="/works"> Works </a> </li>

    </ul>
 `)
})

app.get('/museums', (req,res)=>{
const museums = getMuseums.all()


for(let museum of museums){
    const works = getWorksForMuseums.all({museumId: museum.id})
    museum.works = works
}
res.send(museums)
})

app.get('/museums/:id', (req,res)=>{
    const museum = getMuseumById.get(req.params)
    if(museum){
        const works = getWorksForMuseums.get({museumId: museum.id})
        museum.work = works
        res.send(museum)
    } else{
        res.status(404).send ({error:"Museum Not Found!"})
    }
    res.send(museum)

})
app.post ('/museums', (req,res) => {
    let errors:  string[] = []
    if(typeof req.body.name !== "string"){
        errors.push('Name missing, or it is not a string!')

    }
    if(typeof req.body.city !== "string"){
        errors.push('City is  missing, or it is not a string!')

    }
     if(errors.length === 0){
        const info = createMuseum.run(req.body)
        const museum = getMuseumById.get({id: info.lastInsertRowid})
        const works = getWorksForMuseums.all({museumId: museum.id})
        museum.works = works
        res.send(museum)
     } else{
        res.status(404).send({errors})
     }
   
})

app.delete('/museums/:id', (req, res) =>{
    const info = deleteAMuseum.run(req.params)

    if (info.changes){
     res.send({message: "Museum DELETED!"})

    }else{
     res.status(404).send({error: "Try Again!"})
    }
    res.send(info)
})

app.get('/works', (req,res)=>{
 const works = getWorks.all()
for( let work of works){
    const museum = getMuseumById.get({id: work.museumId})
    work.museum = museum

}
res.send(works)

 }

)

app.get('/works/:id', (req,res)=>{
    const work = getWorkById.get(req.params)
    if(work){
        const museum = getMuseumById.get({id: work.museumId})
        work.museum = museum
        res.send(museum)
    } else{
        res.status(404).send ({error:"Work  Not Found!"})
    }
   
})

app.post('/works ', (req, res) => {
    let errors:  string[] = []
    if(typeof req.body.name !== "string"){
        errors.push('Name missing, or it is not a string!')

    }
    if(typeof req.body.picture !== "string"){
        errors.push('City is  missing, or it is not a string!')
        
    }
    
        if(typeof req.body.museumId !== "number"){
            errors.push('MuseumId is  missing, or it is not a number!')
        } 
    

     if(errors.length === 0){
        const museum = getWorkById.get({id: req.body.museumId})
     
        if(museum){
            const info = createWork.run(req.body)
            const work = getWorkById.get({id: info.lastInsertRowid})
            
            work.museum = museum
            res.send(work)
        } else{
          res.status(404).send ({ error:'You are creating a work that does not exist!'})
        }
          
     } else {
        res.status(400).send({errors})
    }
    })

app.listen(port, ()=>{
    console.log(`Yayy: http://localhost:${port}`)
})