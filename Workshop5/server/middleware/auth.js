const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // Verificar si existe el encabezado de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            message: 'No se proporcionó token de autenticación',
            authenticationRequired: true
        });
    }

    // Verificar formato correcto (Basic base64)
    if (!authHeader.startsWith('Basic ')) {
        return res.status(401).json({ 
            message: 'Formato de autenticación inválido' 
        });
    }

    try {
        // Decodificar credenciales
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }

        // Si todo está bien, añadir usuario a la solicitud
        req.user = {
            id: user._id,
            username: user.username
        };
        
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ 
            message: 'Error en el servidor durante la autenticación' 
        });
    }
};

module.exports = authMiddleware;