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
        
        articleDiv.innerHTML = `
            <div class="post-header">
                <span class="post-date">${fecha}</span>
            </div>
            <h2>${post.titulo}</h2>
            <p>${post.contenido}</p>
        `;
        mainContainer.appendChild(articleDiv);
    });
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

initialize();