const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const {
  addBook,
  updateBook,
  deleteBook,
  listBooks
} = require('../controllers/bookController');

router.post('/', auth, authorize('Admin'), addBook);
router.put('/updatebook/:id', auth, authorize('Admin'), updateBook);
router.delete('/deletebook/:id', auth, authorize('Admin'), deleteBook);
router.get('/listbooks', auth, listBooks);

module.exports = router;
