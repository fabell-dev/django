async function fetchBlogPosts() {
    try {
        const response = await fetch('blogpost');
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function checkAdminStatus() {
    try {
        const response = await fetch('/user_info');
        if (!response.ok) {
            throw new Error('Error al obtener información del usuario');
        }
        const userData = await response.json();
        return {
            isAdmin: userData.status_staff || userData.status_superuser
        };
    } catch (error) {
        console.error('Error:', error);
        return { isAdmin: false };
    }
}

async function displayBlogPosts(posts) {
    const mainContainer = document.querySelector('main');
    const { isStaff, isSuperuser } = await checkAdminStatus();
    const isAdmin = isStaff || isSuperuser;
    
    mainContainer.innerHTML = ''; // Limpiar contenedor
    
    posts.forEach((post) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'blog-post';
        
        // Format the date
        const fecha = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Añadir botones de admin si el usuario es staff o superuser
        const adminButtons = isAdmin ? `
            <div class="admin-controls">
                <button class="edit-button" onclick="editPost(${post.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="delete-button" onclick="deletePost(${post.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        ` : '';
        
        articleDiv.innerHTML = `
            <div class="post-header">
                <span class="post-date">${fecha}</span>
                ${adminButtons}
            </div>
            <h2>${post.titulo}</h2>
            <p>${post.contenido}</p>
        `;
        mainContainer.appendChild(articleDiv);
    });
}


//Administrativo

const deploy_add = document.getElementById('form__add__despoy');
const formContainer = document.getElementById('form-container');
const newscontainer = document.querySelector('main');


async function checkAdminStatus() {
    try {
        const response = await fetch('/user_info');
        if (!response.ok) {
            throw new Error('Error al obtener información del usuario');
        }
        const userData = await response.json();
        return {
            isStaff: userData.status_staff,
            isSuperuser: userData.status_superuser
        };
    } catch (error) {
        console.error('Error:', error);
        return { isStaff: false, isSuperuser: false };
    }
}


deploy_add.addEventListener('click', function() {
    deploy_add.innerHTML = deploy_add.innerHTML === 'Cerrar formulario' ? 'Añadir noticia' : 'Cerrar formulario';
    formContainer.style.display = formContainer.style.display === 'flex' ? 'none' : 'flex';
    newscontainer.style.display = formContainer.style.display === 'none' ? 'flex' : 'none';
});

// Funciones para manejar  Creacion Edición y Eliminación

// Crear Noticia
const crearForm = document.getElementById('crear-producto-form');
crearForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        titulo: document.getElementById('crear-titulo').value,
        contenido: document.getElementById('crear-contenido').value
    };
    
    fetch('/blogpost/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        crearForm.reset();
        // Restablecer los displays a sus valores predeterminados
        formContainer.style.display = 'none';
        newscontainer.style.display = 'flex';
        alert('Noticia creada exitosamente');
        // Recargar posts
        initialize();
    })
    .catch(error => alert('Error al crear la noticia'));
});


//Editar Noticia 
async function editPost(id) {
    const editarForm = document.getElementById('editar-noticia-form');
    const formContainer = editarForm.closest('.form-container');
    const newscontainer = document.querySelector('main');
    
    try {
        // Obtener datos del post
        const response = await fetch(`/blogpost/${id}/`);
        const post = await response.json();
        
        // Rellenar el formulario con los datos existentes
        document.getElementById('editar-titulo').value = post.titulo;
        document.getElementById('editar-contenido').value = post.contenido;
        
        // Mostrar formulario de edición y ocultar noticias
        form__add__despoy.style.display = 'none';
        formContainer.style.display = 'flex';
        newscontainer.style.display = 'none';
        
        // Actualizar el manejador del formulario
        editarForm.onsubmit = async function(e) {
            e.preventDefault();
            
            const data = {
                titulo: document.getElementById('editar-titulo').value,
                contenido: document.getElementById('editar-contenido').value
            };
            
            try {
                const response = await fetch(`/blogpost/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Ocultar formulario y mostrar noticias
                    form__add__despoy.style.display = 'block';
                    formContainer.style.display = 'none';
                    newscontainer.style.display = 'flex';
                    
                    // Recargar posts
                    const posts = await fetchBlogPosts();
                    await displayBlogPosts(posts);
                    
                    alert('Noticia actualizada exitosamente');
                    editarForm.reset();
                } else {
                    throw new Error('Error al actualizar la noticia');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            }
        };
        
    } catch (error) {
        console.error('Error al cargar el post:', error);
        alert('Error al cargar la noticia');
    }
}

// Cancelar Edición en Editar Noticia
const cancelarEdicionBtn = document.getElementById('cancelar-crear-noticia');
cancelarEdicionBtn.addEventListener('click', function() {
    const editarForm = document.getElementById('editar-noticia-form');
    const formContainer = editarForm.closest('.form-container');
    
    // Ocultar formulario y mostrar noticias
    form__add__despoy.style.display = 'block';
    formContainer.style.display = 'none';
    newscontainer.style.display = 'flex';
    
    // Limpiar formulario
    editarForm.reset();
});

// Eliminar Noticia
async function deletePost(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
        try {
            const response = await fetch(`/blogpost/${id}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });
            
            if (response.ok) {
                // Recargar posts después de eliminar
                const posts = await fetchBlogPosts();
                await displayBlogPosts(posts);
                alert('Noticia eliminada exitosamente');
            }
        } catch (error) {
            console.error('Error al eliminar el post:', error);
            alert('Error al eliminar la noticia');
        }
    }
}

// Initialize when page loads
async function initialize(){
    const posts = await fetchBlogPosts();
    await displayBlogPosts(posts);

     // Verificar permisos de administrador
    const { isStaff, isSuperuser } = await checkAdminStatus();
    const asideElement = document.querySelector('aside');
    if (asideElement) {
        // Mostrar aside si el usuario es staff o superusuario
        asideElement.style.display = (isStaff || isSuperuser) ? 'flex' : 'none';
    }

}

initialize();