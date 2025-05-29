document.addEventListener('DOMContentLoaded', function() {
    const commentsList = document.getElementById('comments-list');

    function loadComments() {
        fetch('/comentario/')
            .then(response => response.json())
            .then(comments => {
                commentsList.innerHTML = '';
                comments.forEach(comment => {
                    const commentEl = document.createElement('div');
                    commentEl.className = 'comment-item';
                    commentEl.innerHTML = `
                        <p class="comment-id">ID: ${comment.id_comentario}</p>
                        <p class="comment-text">${comment.comentario}</p>
                    `;
                    commentsList.appendChild(commentEl);
                });
            })
            .catch(error => {
                console.error('Error cargando comentarios:', error);
                commentsList.innerHTML = '<p style="color: white; text-align: center;">Error al cargar los comentarios</p>';
            });
    }

    // Cargar comentarios al iniciar
    loadComments();

    // Recargar comentarios cada 30 segundos
    setInterval(loadComments, 30000);
});