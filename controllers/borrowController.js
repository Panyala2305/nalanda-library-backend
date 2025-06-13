const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.copies < 1) {
      return res.status(400).json({ message: 'No available copies of the book.' });
    }

    book.copies -= 1;
    await book.save();

    const borrow = await Borrow.create({ userId: req.user.id, bookId: book._id });

    return res.status(201).json({
      message: 'Book borrowed successfully.',
      borrow,
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    return res.status(500).json({ message: 'Failed to borrow book. Please try again later.' });
  }
};

const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findOne({
      userId: req.user.id,
      bookId: req.params.bookId,
      returnDate: null,
    });

    if (!borrow) {
      return res.status(404).json({ message: 'No active borrow record found for this book.' });
    }

    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findById(req.params.bookId);
    if (book) {
      book.copies += 1;
      await book.save();
    }

    return res.status(200).json({ message: 'Book returned successfully.' });
  } catch (error) {
    console.error('Return book error:', error);
    return res.status(500).json({ message: 'Failed to return book. Please try again later.' });
  }
};

const viewHistory = async (req, res) => {
  try {
    const history = await Borrow.find({ userId: req.user.id }).populate('bookId');
    return res.status(200).json(history);
  } catch (error) {
    console.error('View history error:', error);
    return res.status(500).json({ message: 'Failed to fetch borrowing history.' });
  }
};

const mostBorrowedBooks = async (req, res) => {
  try {
    const result = await Borrow.aggregate([
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Most borrowed books error:', error);
    return res.status(500).json({ message: 'Failed to fetch most borrowed books.' });
  }
};

const activeMembers = async (req, res) => {
  try {
    const result = await Borrow.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Active members error:', error);
    return res.status(500).json({ message: 'Failed to fetch active members.' });
  }
};

const bookAvailability = async (req, res) => {
  try {
    const books = await Book.find(); 
    const totalUniqueBooks = books.length;

    const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);

    const borrowed = await Borrow.aggregate([
      { $match: { returnDate: null } },
      {
        $group: {
          _id: "$bookId",
          count: { $sum: 1 }
        }
      }
    ]);

    const borrowedMap = {};
    borrowed.forEach(entry => {
      borrowedMap[entry._id.toString()] = entry.count;
    });

    let borrowedBooks = 0;
    let availableBooks = 0;
    let borrowedUniqueBooks = 0;
    let availableUniqueBooks = 0;

    books.forEach(book => {
      const bookIdStr = book._id.toString();
      const borrowedCount = borrowedMap[bookIdStr] || 0;
      const availableCount = book.copies - borrowedCount;

      borrowedBooks += borrowedCount;
      availableBooks += availableCount;

      if (borrowedCount > 0) borrowedUniqueBooks += 1;
      if (availableCount > 0) availableUniqueBooks += 1;
    });

    return res.status(200).json({
      totalUniqueBooks,
      borrowedUniqueBooks,
      availableUniqueBooks,
      totalBooks,
      borrowedBooks,
      availableBooks
    });

  } catch (error) {
    console.error('Book availability error:', error);
    return res.status(500).json({ message: 'Failed to fetch book availability.' });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  viewHistory,
  mostBorrowedBooks,
  activeMembers,
  bookAvailability,
};
