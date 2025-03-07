// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const authToken = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username');
    
    if (!authToken) {
        // Redirigir al login si no hay token
        window.location.href = '/';
        return;
    }
    
    // Mostrar nombre de usuario
    document.getElementById('username-display').textContent = `Usuario: ${username || 'Anónimo'}`;
    
    // Cargar lista de libros
    loadBooks();
});

// Manejar cierre de sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    window.location.href = '/';
});

// Cargar lista de libros desde la API
async function loadBooks() {
    try {
        const authToken = sessionStorage.getItem('authToken');
        
        const response = await fetch('/api/books', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (response.status === 401) {
            // Si no está autorizado, redirigir al login
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('username');
            window.location.href = '/';
            return;
        }
        
        if (!response.ok) {
            throw new Error('Error al cargar los libros');
        }
        
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// Mostrar libros en la tabla
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    
    if (books.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">No hay libros registrados</td>';
        bookList.appendChild(row);
        return;
    }
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.published ? 'Sí' : 'No'}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${book._id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${book._id}">Eliminar</button>
            </td>
        `;
        bookList.appendChild(row);
    });
    
    // Agregar event listeners para botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => editBook(e.target.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteBook(e.target.getAttribute('data-id')));
    });
}

// Manejar envío del formulario (crear o actualizar libro)
document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('book-id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const published = document.getElementById('published').checked;
    
    const bookData = {
        title,
        author,
        pages: parseInt(pages),
        published
    };
    
    try {
        const authToken = sessionStorage.getItem('authToken');
        
        let url = '/api/books';
        let method = 'POST';
        
        if (bookId) {
            // Si hay un ID, estamos actualizando un libro existente
            url = `/api/books/${bookId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authToken}`
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.status === 401) {
            // Si no está autorizado, redirigir al login
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('username');
            window.location.href = '/';
            return;
        }
        
        if (!response.ok) {
            throw new Error('Error al guardar el libro');
        }
        
        // Resetear formulario y cargar libros actualizados
        resetForm();
        loadBooks();
        
        // Mostrar mensaje de éxito
        showMessage(bookId ? 'Libro actualizado correctamente' : 'Libro agregado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
});

// Cargar datos de un libro para editar
async function editBook(id) {
    try {
        const authToken = sessionStorage.getItem('authToken');
        
        const response = await fetch(`/api/books/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos del libro');
        }
        
        const book = await response.json();
        
        // Llenar formulario con datos del libro
        document.getElementById('book-id').value = book._id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('pages').value = book.pages;
        document.getElementById('published').checked = book.published;
        
        // Cambiar título del formulario y mostrar botón de cancelar
        document.getElementById('form-title').textContent = 'Editar Libro';
        document.getElementById('submit-btn').textContent = 'Actualizar';
        document.getElementById('cancel-btn').classList.remove('hidden');
        
        // Desplazarse al formulario
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// Eliminar un libro
async function deleteBook(id) {
    if (!confirm('¿Está seguro de que desea eliminar este libro?')) {
        return;
    }
    
    try {
        const authToken = sessionStorage.getItem('authToken');
        
        const response = await fetch(`/api/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el libro');
        }
        
        // Recargar lista de libros
        loadBooks();
        
        // Mostrar mensaje de éxito
        showMessage('Libro eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// Resetear formulario
function resetForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Nuevo Libro';
    document.getElementById('submit-btn').textContent = 'Guardar';
    document.getElementById('cancel-btn').classList.add('hidden');
}

// Botón de cancelar edición
document.getElementById('cancel-btn').addEventListener('click', resetForm);

// Mostrar mensajes
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 3000);
}