document.addEventListener('DOMContentLoaded', function() {
            const crearForm = document.getElementById('crear-producto-form');
            const editarForm = document.getElementById('editar-noticia-form');
            const eliminarForm = document.getElementById('eliminar-noticia-form');
            let editMode = false;



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
                })
                .catch(error => alert(error.message));
            });
            



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
            })
            .catch(error => alert(error.message));
        }
    });

            // Resetear formulario
            function resetForm() {
                crearForm.reset();
                editarForm.reset();
                eliminarForm.reset();
                editMode = false;}
    
        });



          // Cargar datos del producto al introducir identificador
            // document.getElementById('editar-identificador').addEventListener('change', function() {
            //     const identificador = this.value;
            //     if(identificador) {
            //         fetch(`/productos/${identificador}/`)
            //             .then(response => {
            //                 if (!response.ok) throw new Error('Producto no encontrado');
            //                 return response.json();
            //             })
            //             .then(producto => {
            //                 document.getElementById('editar-nombre').value = producto.nombre;
            //                 document.getElementById('editar-cantidad').value = producto.cantidad;
            //                 document.getElementById('editar-precio').value = producto.precio;
            //             })
            //             .catch(error => {
            //                 alert(error.message);
            //                 document.getElementById('editar-nombre').value = '';
            //                 document.getElementById('editar-cantidad').value = '';
            //                 document.getElementById('editar-precio').value = '';
            //             });
            //     }
            // }); 