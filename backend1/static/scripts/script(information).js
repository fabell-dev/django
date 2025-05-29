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
    const { isAdmin } = await checkAdminStatus();
    
    mainContainer.innerHTML = ''; // Limpiar contenedor
    
    posts.forEach((post, index) => {
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
                ${isAdmin ? `<span class="post-id">ID: ${post.id}</span>` : ''}
                <span class="post-date">${fecha}</span>
            </div>
            <h2>${post.titulo}</h2>
            <p>${post.contenido}</p>
        `;
        
        mainContainer.appendChild(articleDiv);
    });
}

// Initialize when page loads
async function initialize() {
    const posts = await fetchBlogPosts();
    await displayBlogPosts(posts);
}

initialize();