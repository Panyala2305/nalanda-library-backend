/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Borrowing-related operations
 */

/**
 * @swagger
 * /api/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to borrow
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: No available copies
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/return/{bookId}:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to return
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: No active borrow record found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: View borrowing history of the current user
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrowing history returned
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/report/most-borrowed:
 *   get:
 *     summary: Get most borrowed books
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of most borrowed books
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/report/active-members:
 *   get:
 *     summary: Get active members who borrowed the most
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active members
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/report/book-availability:
 *   get:
 *     summary: Get overall book availability stats
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Availability stats returned
 *       500:
 *         description: Server error
 */
