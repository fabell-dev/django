// -------- Funciones principales para mostrar productos --------

// Obtener productos del servidor
async function fetchProductos() {
    try {
        const response = await fetch("productos");
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

// Mostrar productos en tarjetas
async function mostrarTarjetas(productos) {
    const container = document.getElementById("tarjetas-grid");
    const { isStaff, isSuperuser } = await checkAdminStatus();
    const isAdmin = isStaff || isSuperuser;

    container.innerHTML = "";

    if (Array.isArray(productos)) {
        const nombresMostrados = new Set();
        productos.forEach((producto) => {
            if (!nombresMostrados.has(producto.nombre)) {
                nombresMostrados.add(producto.nombre);
                const card = document.createElement("div");
                card.className = "tarjeta";
                const disponibilidad = producto.cantidad > 0 ? "si" : "no";
                const imagenSrc = producto.imagen || `${STATIC_URL}default.png`;
                
                // Botones de administrador
                const adminButtons = isAdmin
                    ? `
                    <div class="admin-controls">
                        <button class="edit-button" onclick="editProduct(${producto.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        </button>
                        <button class="delete-button" onclick="deleteProduct(${producto.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                        </button>
                    </div>`
                    : "";

                card.innerHTML = `
                    <img src="${imagenSrc}" alt="${producto.nombre}" class="fruta-imagen">
                    <h2>${producto.nombre}</h2>
                    <p><strong>Precio:</strong> ${producto.precio} cup</p>
                    <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
                    ${adminButtons}
                `;
                container.appendChild(card);
            }
        });
    } else {
        container.innerHTML = "<p>No hay productos para mostrar.</p>";
    }
}

// Ordenar productos según criterio
function ordenarProductos(productos, tipoOrden) {
    const productosOrdenados = [...productos];
    switch (tipoOrden) {
        case "menorMayor":
            productosOrdenados.sort((a, b) => a.precio - b.precio);
            break;
        case "mayorMenor":
            productosOrdenados.sort((a, b) => b.precio - a.precio);
            break;
        case "alfabetico":
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
    }
    return productosOrdenados;
}

// Cargar y mostrar productos with ordenamiento
async function cargarYMostrarProductos() {
    //Cambiar Link dinamicamente
    const link = document.getElementById("link")
    const { isStaff, isSuperuser } = await checkAdminStatus();
    if(isStaff == true || isSuperuser ==true){
        link.innerHTML='Comentarios'
        link.style.right='20%'
        document.getElementById('link').href = 'edit_coments';
    }
    else{
        link.innerHTML='Perfil'
        document.getElementById('link').href = 'user_show';
    }

    const productos = await fetchProductos();
    let productosOrdenados = ordenarProductos(productos, "alfabetico");
    mostrarTarjetas(productosOrdenados);

    // Evento de ordenamiento
    document.getElementById("orderSelector").addEventListener("change", (e) => {
        productosOrdenados = ordenarProductos(productos, e.target.value);
        mostrarTarjetas(productosOrdenados);
    });

    // Verificar permisos de administrador
    const asideElement = document.querySelector("aside");
    if (asideElement) {
        asideElement.style.display = isStaff || isSuperuser ? "flex" : "none";
    }
}

// -------- Funciones de Administrador --------

// Verificar estado de administrador
async function checkAdminStatus() {
    try {
        const response = await fetch("/user_info");
        if (!response.ok) throw new Error("Error al obtener información del usuario");
        const userData = await response.json();
        return {
            isStaff: userData.status_staff,
            isSuperuser: userData.status_superuser,
        };
    } catch (error) {
        console.error("Error:", error);
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
const cancel__create = document.getElementById('cancelar-crear-producto');
const cancel__edit = document.getElementById('cancelar-editar-producto');


const h2 = document.getElementById('h2_change');

deploy_add.addEventListener('click', function() {

    aside_comtainer.style.height='100dvh'
    footer_comtainer.style.display='none'
    navbar_comtainer.style.display='none'

    deploy_add.style.display = 'none';
    formContainer.style.display = 'flex'
    newscontainer.style.display = 'none'
    h2.innerHTML = 'Crear Nueva Producto';
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
// Crear Producto
const crearForm = document.getElementById("crear-noticia-form");
crearForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData();

    // Obtener los valores de los campos
    const nombre = document.getElementById("crear-nombre").value.trim();
    const cantidad = document.getElementById("crear-cantidad").value;
    const precio = document.getElementById("crear-precio").value;
    const imagen = document.getElementById("crear-imagen").files[0];

    if (!nombre || !cantidad || !precio || !imagen) {
        alert("Todos los campos son requeridos");
        return;
    }

    // Agregar datos al FormData
    formData.append("nombre", nombre);
    formData.append("cantidad", cantidad);
    formData.append("precio", precio);
    formData.append("imagen", imagen);

    fetch("/productos/", {
        method: "POST",
        headers: {
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
        },
        body: formData, // Enviar FormData en lugar de JSON
    })
    .then((response) => {
        if (!response.ok) throw new Error("Error al crear el producto");
        return response.json();
    })
    .then(async () => {
        crearForm.reset();
        // Restablecer los displays a sus valores predeterminados

        aside_comtainer.style.height='auto'
        footer_comtainer.style.display='flex'
        navbar_comtainer.style.display='flex'
        deploy_add.style.display = 'block';
        formContainer.style.display = 'none';
        newscontainer.style.display = 'flex';
        h2.innerHTML = "Panel Administrativo";
        // Recargar productos
        await cargarYMostrarProductos();
        alert("Producto creado exitosamente");
    })
    .catch((error) => alert(error.message));
});

// Editar Producto
async function editProduct(id) {
    const editarForm = document.getElementById("editar-noticia-form");
    const formContainer = editarForm.closest(".form-container");
    const newscontainer = document.querySelector("main");

    try {
        // Obtener datos del producto
        const response = await fetch(`/productos/${id}/`);
        const producto = await response.json();

        // Rellenar el formulario con los datos existentes
        document.getElementById("editar-nombre").value = producto.nombre;
        document.getElementById("editar-cantidad").value = producto.cantidad;
        document.getElementById("editar-precio").value = producto.precio;

        // Mostrar formulario de edición y ocultar productos
        
        aside_comtainer.style.height='100dvh'
        footer_comtainer.style.display='none'
        navbar_comtainer.style.display='none'
        form__add__despoy.style.display = "none";
        formContainer.style.display = "flex";
        newscontainer.style.display = "none";
        h2.innerHTML = "Editar Producto";
        

        // Actualizar el manejador del formulario
        editarForm.onsubmit = async function(e) {
            e.preventDefault();
            const formData = new FormData();

            formData.append("nombre", document.getElementById("editar-nombre").value);
            formData.append("cantidad", document.getElementById("editar-cantidad").value);
            formData.append("precio", document.getElementById("editar-precio").value);

            // Añadir imagen solo si se seleccionó una nueva
            const nuevaImagen = document.getElementById("editar-imagen").files[0];
            if (nuevaImagen) {
                formData.append("imagen", nuevaImagen);
            }

            try {
                const response = await fetch(`/productos/${id}/`, {
                    method: "PUT",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                    },
                    body: formData
                });

                if (response.ok) {
                    // Ocultar formulario y mostrar productos
                    aside_comtainer.style.height='auto'
                    footer_comtainer.style.display='flex'
                    navbar_comtainer.style.display='flex'
                    form__add__despoy.style.display = "block";
                    formContainer.style.display = "none";
                    newscontainer.style.display = "flex";
                    h2.innerHTML = "Panel Administrativo";

                    // Recargar productos
                    await cargarYMostrarProductos();
                    alert("Producto actualizado exitosamente");
                    editarForm.reset();
                } else {
                    throw new Error("Error al actualizar el producto");
                }
            } catch (error) {
                console.error("Error:", error);
                alert(error.message);
            }
        };
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        alert("Error al cargar el producto");
    }
}

// Eliminar Producto
async function deleteProduct(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`/productos/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            });

            if (response.ok) {
                // Recargar productos después de eliminar
                await cargarYMostrarProductos();
                alert("Producto eliminado exitosamente");
            } else {
                throw new Error("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert(error.message);
        }
    }
}

// Cancelar Edición
const cancelarEdicionBtn = document.getElementById("cancelar-editar-producto");
cancelarEdicionBtn.addEventListener("click", function () {
    const editarForm = document.getElementById("editar-noticia-form");
    const formContainer = editarForm.closest(".form-container");
    form__add__despoy.style.display = "block";
    formContainer.style.display = "none";
    newscontainer.style.display = "flex";
    editarForm.reset();
});

// Inicializar la página
cargarYMostrarProductos();
