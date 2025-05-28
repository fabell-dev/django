document.addEventListener('DOMContentLoaded', function() {
            const crearForm = document.getElementById('crear-noticia-form');
            const editarForm = document.getElementById('editar-noticia-form');
            const eliminarForm = document.getElementById('eliminar-noticia-form');
            const noticiasContainer = document.getElementById('noticias-list');
            const formTitle = document.getElementById('form-title');
            const submitBtn = document.getElementById('submit-btn');
            const cancelBtn = document.getElementById('cancel-btn');
            let editMode = false;

            // Cargar noticias existentes
            function loadNoticias() {
                fetch('/blogpost/')
                    .then(response => response.json())
                    .then(noticias => {
                        noticiasContainer.innerHTML = '';
                        noticias.forEach(noticia => {
                            const noticiaEl = document.createElement('div');
                            noticiaEl.className = 'noticia-item';
                            noticiaEl.innerHTML = `
                                <h3>${noticia.titulo}</h3>
                                <p>${noticia.contenido}</p>
                                <div class="noticia-actions">
                                    <button onclick="editNoticia(${noticia.id})">Editar</button>
                                    <button onclick="deleteNoticia(${noticia.id})">Eliminar</button>
                                </div>
                            `;
                            noticiasContainer.appendChild(noticiaEl);
                        });
                    });
            }

            // Crear noticia
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
                    alert('Noticia creada exitosamente');
                    loadNoticias();
                })
                .catch(error => alert('Error al crear la noticia'));
            });

            // Editar noticia
            editarForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = document.getElementById('editar-id').value;
                const data = {
                    titulo: document.getElementById('editar-titulo').value,
                    contenido: document.getElementById('editar-contenido').value
                };

                fetch(`/blogpost/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Noticia no encontrada');
                    return response.json();
                })
                .then(() => {
                    editarForm.reset();
                    alert('Noticia actualizada exitosamente');
                    loadNoticias();
                })
                .catch(error => alert(error.message));
            });

            // Función para editar
            window.editNoticia = function(id) {
                fetch(`/blogpost/${id}/`)
                    .then(response => response.json())
                    .then(noticia => {
                        document.getElementById('editar-id').value = noticia.id;
                        document.getElementById('editar-titulo').value = noticia.titulo;
                        document.getElementById('editar-contenido').value = noticia.contenido;
                        formTitle.textContent = 'Editar Noticia';
                        submitBtn.textContent = 'Actualizar';
                        cancelBtn.style.display = 'inline-block';
                        editMode = true;
                    });
            };

            // Eliminar noticia
            eliminarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('eliminar-id').value;

        if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
            fetch(`/blogpost/${id}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Noticia no encontrada');
                eliminarForm.reset();
                alert('Noticia eliminada exitosamente');
                loadNoticias();
            })
            .catch(error => alert(error.message));
        }
    });

            // Resetear formulario
            function resetForm() {
                crearForm.reset();
                editarForm.reset();
                eliminarForm.reset();
                formTitle.textContent = 'Crear Nueva Noticia';
                submitBtn.textContent = 'Crear Noticia';
                cancelBtn.style.display = 'none';
                editMode = false;
            }

            // Botón cancelar
            cancelBtn.addEventListener('click', resetForm);

            // Cargar noticias al inicio
            loadNoticias();
        });