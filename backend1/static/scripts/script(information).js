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

function displayBlogPosts(posts) {
    const mainContainer = document.querySelector('main');
    
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
    displayBlogPosts(posts);
}

initialize();