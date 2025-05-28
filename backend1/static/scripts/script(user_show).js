let user = {};

async function loadUser() {
    try {
        const response = await fetch('user_info');
        const data = await response.json();
        user = data;
        
        // Format the date
        const fecha = new Date(user.fecha_registro).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Si el usuario no tiene nombre completo, muestra comillas vacías
        document.getElementById('nombre').textContent = user.nombre_completo ? user.nombre_completo : ' "...." ';
        document.getElementById('usuario').textContent = user.usuario;
        document.getElementById('email').textContent = user.email;
        document.getElementById('fecha_registro').textContent = fecha;
    } catch (error) {
        console.error('Error:', error);
    }
}

loadUser();