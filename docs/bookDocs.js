/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */

/**
 * @swagger
 * /api/books/addbook:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - ISBN
 *               - publicationDate
 *               - genre
 *               - copies
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Gatsby
 *               author:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               ISBN:
 *                 type: string
 *                 example: 978-3-16-148410-0
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: 1925-04-10
 *               genre:
 *                 type: string
 *                 example: Fiction
 *               copies:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Book added successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/books/updatebook/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               copies:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/books/deletebook/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/books/listbooks:
 *   get:
 *     summary: Get a list of books (with optional filters)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter books by genre
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter books by author
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books returned successfully
 *       500:
 *         description: Server error
 */
