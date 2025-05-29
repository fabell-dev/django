document.addEventListener('DOMContentLoaded', function() {
            const crearForm = document.getElementById('crear-producto-form');
            const editarForm = document.getElementById('editar-producto-form');
            const eliminarForm = document.getElementById('eliminar-producto-form');
            let editMode = false;



            // Crear producto
            crearForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData();
                
                // Obtener los valores de los campos
                const identificador = document.getElementById('crear-identificador').value;
                const nombre = document.getElementById('crear-nombre').value.trim();
                const cantidad = document.getElementById('crear-cantidad').value;
                const precio = document.getElementById('crear-precio').value;
                const imagen = document.getElementById('crear-imagen').files[0];

                // Validar campos requeridos
                if (!nombre || !cantidad || !precio || !imagen || !identificador) {
                    alert('Todos los campos son requeridos');
                    return;
                }

                // Agregar datos al FormData
                formData.append('identificador', identificador);
                formData.append('nombre', nombre);
                formData.append('cantidad', cantidad);
                formData.append('precio', precio);
                formData.append('imagen', imagen);

                fetch('/productos/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: formData // Enviar FormData en lugar de JSON
                })
                .then(response => {
                    if (!response.ok) throw new Error('Error al crear el producto');
                    return response.json();
                })
                .then(() => {
                    crearForm.reset();
                    alert('Producto creado exitosamente');
                })
                .catch(error => alert(error.message));
            });



            // Cargar datos del producto al introducir identificador
            document.getElementById('editar-identificador').addEventListener('change', function() {
                const identificador = this.value;
                if(identificador) {
                    fetch(`/productos/${identificador}/`)
                        .then(response => {
                            if (!response.ok) throw new Error('Producto no encontrado');
                            return response.json();
                        })
                        .then(producto => {
                            document.getElementById('editar-nombre').value = producto.nombre;
                            document.getElementById('editar-nombre').value = producto.nombre;
                            document.getElementById('editar-cantidad').value = producto.cantidad;
                            document.getElementById('editar-precio').value = producto.precio;
                        })
                        .catch(error => {
                            alert(error.message);
                            document.getElementById('editar-nombre').value = '';
                            document.getElementById('editar-cantidad').value = '';
                            document.getElementById('editar-precio').value = '';
                        });
                }
            });



            // Editar producto
            editarForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData();

                // Obtener los valores de los campos
                const identificador = document.getElementById('editar-identificador').value;
                formData.append('identificador', document.getElementById('editar-identificador').value);
                formData.append('nombre', document.getElementById('editar-nombre').value);
                formData.append('cantidad', document.getElementById('editar-cantidad').value);
                formData.append('precio', document.getElementById('editar-precio').value);
                
                const imageFile = document.getElementById('editar-imagen').files[0];
                if (imageFile) {
                    formData.append('imagen', imageFile);
                }

                fetch(`/productos/${identificador}/`, {
                    method: 'PUT',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: formData
                })
                .then(response => {
                    if (!response.ok) throw new Error('Producto no encontrado');
                    return response.json();
                })
                .then(() => {
                    editarForm.reset();
                    alert('Producto actualizado exitosamente');
                })
                .catch(error => alert(error.message));
            });
            



            // Eliminar producto
            eliminarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const identificador = document.getElementById('eliminar-identificador').value;

        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            fetch(`/productos/${identificador}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Producto no encontrado');
                eliminarForm.reset();
                alert('Producto eliminado exitosamente');
            })
            .catch(error => alert(error.message));
        }
    });
        });