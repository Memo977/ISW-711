const Book = require('../models/Book');

// Obtener todos los libros
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear un nuevo libro
exports.createBook = async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        published: req.body.published
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Actualizar un libro
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Libro no encontrado' });

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.pages = req.body.pages || book.pages;
        book.published = req.body.published !== undefined ? req.body.published : book.published;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Libro no encontrado' });

        // Usar findByIdAndDelete en lugar de book.remove() que está obsoleto
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Libro eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};