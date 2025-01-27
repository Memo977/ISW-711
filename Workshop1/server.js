require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes'); // Importar las rutas
const app = express();

// PRIMERO: Middleware para parsear JSON
app.use(express.json());

// DESPUÉS: Usar las rutas de libros
app.use('/books', bookRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});