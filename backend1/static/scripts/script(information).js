// -------- Funciones principales para mostrar noticias --------

// Obtener noticias del servidor
async function fetchBlogPosts() {
    try {
        const response = await fetch('blogpost');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Mostrar noticias en el contenedor principal
async function displayBlogPosts(posts) {
    const mainContainer = document.querySelector('main');
    const { isStaff, isSuperuser } = await checkAdminStatus();
    const isAdmin = isStaff || isSuperuser;
    
    
    posts.forEach((post) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'blog-post';
        
        // Formatear fecha
        const fecha = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Botones de administrador
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

// Inicializar la página
async function initialize() {

    //Haciendo links dinamicos
    const link = document.getElementById("link")
    const footer = document.querySelector("footer");
    const { isStaff, isSuperuser } = await checkAdminStatus();
    if(isStaff == true || isSuperuser ==true){
        link.innerHTML='Comentarios'
        link.style.right='20%'
        document.getElementById('link').href = 'edit_coments';
        footer.style.display ='none'
    }
    else{
        link.innerHTML='Perfil'
        document.getElementById('link').href = 'user_show';
    }

    //Fetch
    const posts = await fetchBlogPosts();
    await displayBlogPosts(posts);
    
    // Verificar permisos de administrador
    const asideElement = document.querySelector('aside');
    if (asideElement) {
        asideElement.style.display = isStaff || isSuperuser ? "flex" : "none";
    }
}

// -------- Funciones de Administrador --------

// Verificar estado de administrador
async function checkAdminStatus() {
    try {
        const response = await fetch('/user_info');
        if (!response.ok) throw new Error('Error al obtener información del usuario');
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

// Control del formulario
const deploy_add = document.getElementById('form__add__despoy');
const formContainer = document.getElementById('form-container');
const newscontainer = document.querySelector('main');
const navbar_comtainer = document.querySelector('nav');
const footer_comtainer = document.querySelector('footer');
const aside_comtainer = document.querySelector('aside');
const cancel__create = document.getElementById('cancelar-crear-noticia');
const cancel__edit = document.getElementById('cancelar-editar-noticia');

const h2 = document.getElementById('h2_change');

deploy_add.addEventListener('click', function() {
    aside_comtainer.style.height='100dvh'
    footer_comtainer.style.display='none'
    navbar_comtainer.style.display='none'
    deploy_add.style.display = 'none';
    formContainer.style.display = 'flex'
    newscontainer.style.display = 'none'
    h2.innerHTML = 'Crear Nueva Noticia';
});

cancel__create.addEventListener('click', function() {
    aside_comtainer.style.height='auto'
    footer_comtainer.style.display='flex'
    navbar_comtainer.style.display='flex'
    deploy_add.style.display = 'block';
    formContainer.style.display = 'none';
    newscontainer.style.display = 'flex';
    h2.innerHTML = 'Panel Administrativo';
});

cancel__edit.addEventListener('click', function() {
    aside_comtainer.style.height='auto'
    footer_comtainer.style.display='flex'
    navbar_comtainer.style.display='flex'
    deploy_add.style.display = 'block';
    formContainer.style.display = 'none';
    newscontainer.style.display = 'flex';
    h2.innerHTML = 'Panel Administrativo';
});

// Crear Noticia
const crearForm = document.getElementById('crear-noticia-form');
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
        aside_comtainer.style.height='auto'
        footer_comtainer.style.display='flex'
        navbar_comtainer.style.display='flex'
        formContainer.style.display = 'none';
        newscontainer.style.display = 'flex';
        deploy_add.style.display = 'block';
        h2.innerHTML = 'Panel Administrativo';

        alert('Noticia creada exitosamente');
        initialize();
    })
    .catch(error => alert('Error al crear la noticia'));
});

// Editar Noticia
async function editPost(id) {
    const editarForm = document.getElementById('editar-noticia-form');
    const formContainer = editarForm.closest('.form-container');
    
    try {
        const response = await fetch(`/blogpost/${id}/`);
        const post = await response.json();
        
        document.getElementById('editar-titulo').value = post.titulo;
        document.getElementById('editar-contenido').value = post.contenido;
        
        aside_comtainer.style.height='100dvh'
        footer_comtainer.style.display='none'
        navbar_comtainer.style.display='none'
        deploy_add.style.display = 'none';
        formContainer.style.display = 'flex';
        newscontainer.style.display = 'none';
        h2.innerHTML = 'Editar Noticia';
        
        editarForm.onsubmit = async function(e) {
            e.preventDefault();
            try {
                const response = await fetch(`/blogpost/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify({
                        titulo: document.getElementById('editar-titulo').value,
                        contenido: document.getElementById('editar-contenido').value
                    })
                });
                
                if (response.ok) {

                    aside_comtainer.style.height='auto'
                    footer_comtainer.style.display='flex'
                    navbar_comtainer.style.display='flex'
                    form__add__despoy.style.display = 'block';
                    formContainer.style.display = 'none';
                    newscontainer.style.display = 'flex';
                    h2.innerHTML = 'Panel Administrativo';
                    await initialize();
                    alert('Noticia actualizada exitosamente');
                    editarForm.reset();
                }
            } catch (error) {
                alert('Error al actualizar la noticia');
            }
        };
    } catch (error) {
        alert('Error al cargar la noticia');
    }
}

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
                await initialize();
                alert('Noticia eliminada exitosamente');
            }
        } catch (error) {
            alert('Error al eliminar la noticia');
        }
    }
}

// Cancelar Edición
const cancelarEdicionBtn = document.getElementById('cancelar-editar-noticia');
cancelarEdicionBtn.addEventListener('click', function() {
    const editarForm = document.getElementById('editar-noticia-form');
    const formContainer = editarForm.closest('.form-container');
    
    form__add__despoy.style.display = 'block';
    formContainer.style.display = 'none';
    newscontainer.style.display = 'flex';
    editarForm.reset();
});

// Inicializar la página
initialize();