const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

// Rutas para los libros
router.get('/', bookController.getBooks);
router.post('/', bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;