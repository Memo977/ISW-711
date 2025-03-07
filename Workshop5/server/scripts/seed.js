require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
        process.exit(1);
    });

// Crear usuario admin
async function createAdminUser() {
    try {
        // Verificar si el usuario admin ya existe
        const existingUser = await User.findOne({ username: 'admin' });
        
        if (existingUser) {
            console.log('El usuario admin ya existe');
            return;
        }
        
        // Crear usuario admin
        const adminUser = new User({
            username: 'admin',
            password: 'admin123'
        });
        
        await adminUser.save();
        console.log('Usuario admin creado con éxito');
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
    } finally {
        // Cerrar conexión
        mongoose.connection.close();
    }
}

createAdminUser();