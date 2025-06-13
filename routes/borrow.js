const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  borrowBook,
  returnBook,
  viewHistory,
  mostBorrowedBooks,
  activeMembers,
  bookAvailability
} = require('../controllers/borrowController');

router.post('/borrow/:bookId', auth, borrowBook);
router.post('/return/:bookId', auth, returnBook);
router.get('/history', auth, viewHistory);

router.get('/report/most-borrowed', auth, mostBorrowedBooks);
router.get('/report/active-members', auth, activeMembers);
router.get('/report/book-availability', auth, bookAvailability);

module.exports = router;
