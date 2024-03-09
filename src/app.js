const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const booksRoutes = require('./routes/book.routes')

// we use express for middlewares
const app = express()
app.use(bodyParser.json()) 

//here we will connect the database
const port = process.env.PORT || 3090

mongoose.connect(process.env.MONGO_URL, { dbName :process.env.MONGO_DB_NAME})

const db = mongoose.connection;

app.use('/books', booksRoutes)

app.listen(port,()=>{

    console.log("listening in the port ", port )
    
})