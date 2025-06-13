const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const {
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  NotFoundError
} = require('../utils/errors');

module.exports = {
  register: async ({ input }) => {
    try {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new ValidationError("User already exists");

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await User.create({ ...input, password: hashedPassword });

      return { token: generateToken(user) };
    } catch (error) {
      console.error('Register error:', error.message);
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new UnauthorizedError("Invalid credentials");

      return { token: generateToken(user) };
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  me: async (args, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();
      return await User.findById(context.user.id);
    } catch (error) {
      console.error('Me query error:', error.message);
      throw error;
    }
  },

  books: async ({ genre, author }) => {
    try {
      const filter = {};
      if (genre) filter.genre = genre;
      if (author) filter.author = author;
      return await Book.find(filter);
    } catch (error) {
      console.error('Books query error:', error.message);
      throw error;
    }
  },

  addBook: async ({ input }, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();
      if (context.user.role !== 'Admin') throw new ForbiddenError();
      return await Book.create(input);
    } catch (error) {
      console.error('Add book error:', error.message);
      throw error;
    }
  },

  updateBook: async ({ id, input }, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();
      if (context.user.role !== 'Admin') throw new ForbiddenError();

      const updated = await Book.findByIdAndUpdate(id, input, { new: true });
      if (!updated) throw new NotFoundError("Book not found");
      return updated;
    } catch (error) {
      console.error('Update book error:', error.message);
      throw error;
    }
  },

  deleteBook: async ({ id }, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();
      if (context.user.role !== 'Admin') throw new ForbiddenError();

      const deleted = await Book.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundError("Book not found");
      return "Book deleted successfully";
    } catch (error) {
      console.error('Delete book error:', error.message);
      throw error;
    }
  },

  borrowBook: async ({ bookId }, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();

      const book = await Book.findById(bookId);
      if (!book) throw new NotFoundError("Book not found");
      if (book.copies < 1) throw new ValidationError("No copies available");

      book.copies -= 1;
      await book.save();

      const borrow = await Borrow.create({
        userId: context.user.id,
        bookId: book._id
      });

      return borrow;
    } catch (error) {
      console.error('Borrow book error:', error.message);
      throw error;
    }
  },

  returnBook: async ({ bookId }, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();

      const borrow = await Borrow.findOne({
        userId: context.user.id,
        bookId,
        returnDate: null
      });
      if (!borrow) throw new NotFoundError("No active borrow record found");

      borrow.returnDate = new Date();
      await borrow.save();

      const book = await Book.findById(bookId);
      if (book) {
        book.copies += 1;
        await book.save();
      }

      return "Book returned successfully";
    } catch (error) {
      console.error('Return book error:', error.message);
      throw error;
    }
  },

  borrowHistory: async (args, context) => {
    try {
      if (!context.user) throw new UnauthorizedError();
      return await Borrow.find({ userId: context.user.id }).populate('bookId');
    } catch (error) {
      console.error('Borrow history error:', error.message);
      throw error;
    }
  },

  mostBorrowedBooks: async () => {
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
            as: 'book'
          }
        },
        { $unwind: '$book' },
        { $replaceRoot: { newRoot: '$book' } }
      ]);
      return result;
    } catch (error) {
      console.error('Most borrowed books error:', error.message);
      throw error;
    }
  },

  activeMembers: async () => {
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
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $replaceRoot: { newRoot: '$user' } }
      ]);
      return result;
    } catch (error) {
      console.error('Active members error:', error.message);
      throw error;
    }
  },

  bookAvailability: async () => {
    try {
      const books = await Book.find();
      const totalUniqueBooks = books.length;
      const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);

      const borrowed = await Borrow.aggregate([
        { $match: { returnDate: null } },
        { $group: { _id: "$bookId", count: { $sum: 1 } } }
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
        const id = book._id.toString();
        const borrowedCount = borrowedMap[id] || 0;
        const availableCount = book.copies - borrowedCount;

        borrowedBooks += borrowedCount;
        availableBooks += availableCount;

        if (borrowedCount > 0) borrowedUniqueBooks++;
        if (availableCount > 0) availableUniqueBooks++;
      });

      return {
        totalUniqueBooks,
        borrowedUniqueBooks,
        availableUniqueBooks,
        totalBooks,
        borrowedBooks,
        availableBooks
      };
    } catch (error) {
      console.error('Book availability error:', error.message);
      throw error;
    }
  }
};
