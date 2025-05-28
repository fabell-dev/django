document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const titulo = document.querySelector('h1');

    if (form && titulo) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            titulo.textContent = "¡Gracias por su comentario!";
            titulo.classList.remove('fade-in'); // Remove if exists
            void titulo.offsetWidth; // Trigger reflow
            titulo.classList.add('fade-in');
            
            setTimeout(() => {
                form.submit();
            }, 1000);
        });
    }
});

