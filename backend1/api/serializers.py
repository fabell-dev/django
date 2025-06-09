#encargado de convertir a json
from rest_framework import serializers
from .models import BlogPost, Productos, Comentarios

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        #los campos a retornar, se pueden omitir algunos si no hace falta
        #id es un campo que siempre se annadira a los modelos, no hay necesidad de especificarse cuando se crea en el
        #modelo pero si en el serializador
        fields = ["id", "titulo", "contenido", "fecha_publicacion"]
        
class ProductosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productos
        fields = ["id", "nombre", "cantidad", "precio", "ultima_modificacion", "imagen"]
        extra_kwargs = {
            'imagen': {'required': False}  # Hace que el campo imagen sea opcional
        }
        
class ComentariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentarios
        fields = ["id","comentario","fecha_creacion"]