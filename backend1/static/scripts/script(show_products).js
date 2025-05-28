// Función para obtener el JSON de productos y retornarlo
        async function fetchProductos() {
            try {
                const response = await fetch('productos');
                const productos = await response.json();
                return productos; // Retorna el arreglo de productos
            } catch (error) {
                console.error('Error al obtener productos:', error);
                return [];
            }
        }

        // Función para poblar la página con las tarjetas dentro del grid
        function mostrarTarjetas(productos) {
            const container = document.getElementById('tarjetas-grid');
            container.innerHTML = '';
            if (Array.isArray(productos)) {
                const nombresMostrados = new Set();
                productos.forEach(producto => {
                    if (!nombresMostrados.has(producto.nombre)) {
                        nombresMostrados.add(producto.nombre);
                        const card = document.createElement('div');
                        card.className = 'tarjeta';
                        const disponibilidad = producto.cantidad > 0 ? 'si' : 'no';
                        // Use default image only if no image is provided
                        const imagenSrc = producto.imagen || `${STATIC_URL}default.png`;
                        card.innerHTML = `
                            <img src="${imagenSrc}" alt="${producto.nombre}" class="fruta-imagen">
                            <h2 style="text-decoration: underline;">${producto.nombre}</h2>
                            <p><strong>Precio:</strong> ${producto.precio} cup</p>
                            <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
                        `;
                        container.appendChild(card);
                    }
                });
            } else {
                container.innerHTML = '<p>No hay productos para mostrar.</p>';
            }
        }


        // Función para ordenar productos
        function ordenarProductos(productos, tipoOrden) {
            const productosOrdenados = [...productos];
            
            switch(tipoOrden) {
                case 'menorMayor':
                    productosOrdenados.sort((a, b) => a.precio - b.precio);
                    break;
                case 'mayorMenor':
                    productosOrdenados.sort((a, b) => b.precio - a.precio);
                    break;
                case 'alfabetico':
                    productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    break;
            }

            return productosOrdenados;
        }

        // Función principal para cargar y mostrar productos
        async function cargarYMostrarProductos() {
            const productos = await fetchProductos();
            let productosOrdenados = ordenarProductos(productos, 'alfabetico');
            mostrarTarjetas(productosOrdenados);

            // Añadir evento al selector
            document.getElementById('orderSelector').addEventListener('change', (e) => {
                productosOrdenados = ordenarProductos(productos, e.target.value);
                mostrarTarjetas(productosOrdenados);
            });
        }

        cargarYMostrarProductos();