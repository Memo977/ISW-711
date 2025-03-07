const User = require('../models/User');

// Registro de usuario
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        
        // Crear nuevo usuario
        const user = new User({
            username,
            password
        });
        
        await user.save();
        
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            userId: user._id 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login de usuario (verificación básica)
exports.loginUser = async (req, res) => {
    try {
        // Extraer credenciales del encabezado de autorización
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Autenticación requerida' });
        }
        
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
        
        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        // Autenticación exitosa
        res.status(200).json({ 
            message: 'Autenticación exitosa',
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ruta protegida de ejemplo para probar autenticación
exports.getUserProfile = async (req, res) => {
    try {
        // req.user es establecido por el middleware de autenticación
        res.json({ 
            message: 'Perfil obtenido exitosamente',
            user: req.user 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};