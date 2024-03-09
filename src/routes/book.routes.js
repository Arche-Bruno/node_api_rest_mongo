const express = require("express");
const router = express.Router();
const Book = require("../models/book.models");

//MIDDLEWARE

const getBook = async(req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "The book id is not valid",
    });
  }

  try {
    book =await Book.findById(id)
    if(!book){
        return res.status(404).json({
           message: 'the books was not found'
        })
    }
    
  } catch (error) {

    return res.status(500).json({
        message:error.message
    })
    
  }
  res.book = book;
  next()

};

// get all books    [GET ALL]

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new book (resource)  [POST]

router.post("/", async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (!title || !author || !genre || !publication_date) {
    //400 because is a back request(la petición esta mal hecha)
    return res.status(400).json({
      message: "the data is required:  title,author,genre and date",
    });
  }

  const book = new Book({
    title,
    author,
    genre,
    publication_date,
  });

  try {
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
  

router.get('/:id', getBook, async(req,res)=>{
    res.json(res.book);
})

router.put('/:id', getBook, async(req,res)=>{
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
      const updatedBook = await book.save()
      res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})

router.patch('/:id', getBook, async(req,res)=>{
    if(!req.body.title && !req.body.author && !req.body.genre&& !req.body.publication_date ){
        res.status(400).json({
            message :'at least one of theses fields should be sent : title, author, genre , publication date'
        })
    }
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
      const updatedBook = await book.save()
      res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})


router.delete('/:id', getBook , async(req,res)=>{
    try {
        const book = res.book
         await book.deleteOne({
            _id:book._id
         });
         res.json({
            message:`The book ${book.title} was successfully deleted`
         })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    
    }
        
    })



module.exports = router