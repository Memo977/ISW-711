const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de libros
router.use(authMiddleware);

// Rutas para los libros (ahora protegidas)
router.get('/', bookController.getBooks);
router.post('/', bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;