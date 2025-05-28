from django.db import models

# Create your models here.
#creacion del modelo para los post 
class BlogPost(models.Model):
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.titulo 
    
class Productos(models.Model):
    nombre = models.CharField(max_length=255)
    cantidad = models.IntegerField()
    precio = models.IntegerField()
    identificador = models.CharField(max_length=12)
    ultima_modificacion = models.DateTimeField(auto_now_add=True)
    imagen = models.ImageField(upload_to='Productos/', blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if self.imagen:
            # Get the file extension
            extension = self.imagen.name.split('.')[-1]
            # Set the image name to the product name without the additional Productos/ prefix
            self.imagen.name = f"{self.nombre}.{extension}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.nombre
    
class Comentarios(models.Model):
    id_comentario = models.IntegerField(primary_key=True, blank=False, null=False,unique=True)
    comentario = models.CharField(max_length=2048)
    
    def __str__(self):
        return self.comentario