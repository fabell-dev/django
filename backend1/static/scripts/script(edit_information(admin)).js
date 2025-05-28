document.addEventListener('DOMContentLoaded', function() {
    loadNews();

    // Manejador para añadir noticias
    document.getElementById('addNewsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        try {
            const response = await fetch('/api/blogpost/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (response.ok) {
                alert('Noticia añadida correctamente');
                loadNews();
                this.reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Manejador para editar noticias
    document.getElementById('editNewsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const id = formData.get('id');
        try {
            const response = await fetch(`/api/blogpost/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    titulo: formData.get('title'),
                    contenido: formData.get('content')
                })
            });
            if (response.ok) {
                alert('Noticia actualizada correctamente');
                loadNews();
                this.reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Manejador para eliminar noticias
    document.getElementById('deleteNewsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = this.elements['id'].value;
        if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
            try {
                const response = await fetch(`/api/blogpost/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (response.ok) {
                    alert('Noticia eliminada correctamente');
                    loadNews();
                    this.reset();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});

// Función para cargar las noticias existentes
async function loadNews() {
    try {
        const response = await fetch('/api/blogpost/');
        const news = await response.json();
        const newsListDiv = document.getElementById('newsList');
        newsListDiv.innerHTML = news.map(item => `
            <div class="news-item">
                <h3>ID: ${item.id} - ${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
