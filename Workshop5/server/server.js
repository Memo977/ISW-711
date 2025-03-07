require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'client')));

// Usar las rutas de usuarios
app.use('/api/users', userRoutes);

// Usar las rutas de libros (protegidas con autenticación)
app.use('/api/books', bookRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','client', 'login.html'));
});

// Ruta para la página de libros
app.get('/books', (req, res) => {
    res.sendFile(path.join(__dirname, '..','client', 'books.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});