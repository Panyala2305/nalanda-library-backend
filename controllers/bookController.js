const Book = require('../models/Book');

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
};

const addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
};

const listBooks = async (req, res) => {
  try {
    const { genre, author, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.json(books);
  } catch (error) {
    handleServerError(res, error);
  }
};


module.exports = {
  addBook,
  updateBook,
  deleteBook,
  listBooks,
};
