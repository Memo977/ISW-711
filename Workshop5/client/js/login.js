// Cambiar entre formularios de login y registro
document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
});

document.getElementById('register-tab').addEventListener('click', () => {
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
});

// Manejar envío del formulario de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Crear Basic Auth token
        const token = btoa(`${username}:${password}`);
        
        // Intentar autenticar
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token en sessionStorage
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('username', username);
            
            // Mostrar mensaje de éxito
            const messageElement = document.getElementById('login-message');
            messageElement.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            messageElement.classList.remove('hidden');
            
            // Redirigir a la página de libros
            setTimeout(() => {
                window.location.href = '/books';
            }, 1500);
        } else {
            // Mostrar mensaje de error
            const messageElement = document.getElementById('login-message');
            messageElement.textContent = data.message || 'Error al iniciar sesión';
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            messageElement.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
        const messageElement = document.getElementById('login-message');
        messageElement.textContent = 'Error al conectar con el servidor';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
        messageElement.classList.remove('hidden');
    }
});

// Manejar envío del formulario de registro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        const messageElement = document.getElementById('register-message');
        messageElement.textContent = 'Las contraseñas no coinciden';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
        messageElement.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar mensaje de éxito
            const messageElement = document.getElementById('register-message');
            messageElement.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
            messageElement.classList.remove('error');
            messageElement.classList.add('success');
            messageElement.classList.remove('hidden');
            
            // Limpiar formulario
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
            
            // Cambiar a la pestaña de login después de un breve retraso
            setTimeout(() => {
                document.getElementById('login-tab').click();
            }, 2000);
        } else {
            // Mostrar mensaje de error
            const messageElement = document.getElementById('register-message');
            messageElement.textContent = data.message || 'Error al registrar usuario';
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
            messageElement.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
        const messageElement = document.getElementById('register-message');
        messageElement.textContent = 'Error al conectar con el servidor';
        messageElement.classList.remove('success');
        messageElement.classList.add('error');
        messageElement.classList.remove('hidden');
    }
});