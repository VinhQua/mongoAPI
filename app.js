const express = require('express')
//init app & middleware
const {connectToDB,getDB} = require('./db')
const { ObjectId } = require('mongodb')
const app = express()
app.use(express.json())
//DB connection
let db
connectToDB((err)=>{
    if (!err) {
        app.listen(3000, () => {
        console.log('server is running on port 3000')
        })
        db = getDB()
    }

})

//routes
app.get('/books', (req, res) => {
    //current page
    const page = req.query.page || 0
    const booksPerPage = 5
    
    let books = []

    db.collection('books')
    .find({})
    .sort({author:1})
    .skip(page*booksPerPage)
    .limit(booksPerPage)
    .forEach(book=>{
        books.push(book)
    })
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(err=>{
        res.status(500).json({err:'Could not fetch the document'})
    })

})


app.get('/books/:id',(req,res)=>{

    if (ObjectId.isValid(req.params.id)){

        const id = req.params.id
        
        db.collection('books').findOne({ _id: new ObjectId(id)})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not fetch the document'})
        })
        
    } else {
        res.status(500).json({err:'Invalid id'})
    }

})   
app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books').insertOne(book)
    .then(result=>{
        res.status(201).json(result)
    })
    .catch(err=>{
        res.status(500).json({err:'Could not insert the document'})
    })
})

app.delete('/books/:id',(req,res)=>{
    if (ObjectId.isValid(req.params.id)){
        db.collection('books').deleteOne({_id: new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not delete the document'})
        });
    } else {
        res.status(500).json({err:'Invalid id'})
    }
})

app.patch('/books/:id',(req,res)=>{
    const updates = req.body
    if (ObjectId.isValid(req.params.id)){
        db.collection('books').updateOne({_id: new ObjectId(req.params.id)},{$set:updates})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not update the document'})
        });

    } else{
        res.status(500).json({err:'Invalid id'})
    }
})