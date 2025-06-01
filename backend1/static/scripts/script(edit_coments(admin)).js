document.addEventListener('DOMContentLoaded', function() {
    const commentsList = document.getElementById('comments-list');

    // Hacer Fetch de todos los comentarios
        async function fetchComents() {
            try {
                const response = await fetch('comentario');
                const coments = await response.json();
                return coments;}
            catch (error) {
                console.error('Error:', error);
                return [];
            }
}

    // Mostrar Trajetas con los Datos
        function displayComents(coments){
            commentsList.innerHTML = '';
            coments.forEach(coment => {
            // Format the date
            const fecha = new Date(coment.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour:'2-digit',
            minute:'2-digit'
                });

            const commentEl = document.createElement('div');
            commentEl.className = 'comment-item';
            commentEl.innerHTML = `
                <p class="comment-fecha">${fecha}</p>
                <p class="comment-text">${coment.comentario}</p>
                `;
            commentsList.appendChild(commentEl);
                });
            }

    // Función para ordenar productos
        function  ordenarProductos(coments){
            const comentariosOrdenados = [...coments];
            comentariosOrdenados.sort((a, b) => b.id - a.id);
            return comentariosOrdenados;
            }


    // Función principal para cargar y mostrar comentarios
        async function loadComments() {
            const coments = await fetchComents();
            let comentariosOrdenados = ordenarProductos(coments);
            await displayComents(comentariosOrdenados);
        }

    // Cargar comentarios al iniciar
        loadComments();

    // Recargar comentarios cada 30 segundos
        setInterval(loadComments, 30000);
});