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
    identificador = models.CharField(max_length=12)
    ultima_modificacion= models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nombre