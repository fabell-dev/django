from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
#se usa para ver en una web los resultados de la comunicacion con el framework
from rest_framework import generics
#obviamente hay que importar los modelos
from .models import BlogPost
#importar el serializador para trabajar en la web
from .serializers import BlogPostSerializer
from .models import Productos, Comentarios
from .serializers import ProductosSerializer, ComentariosSerializer
from django.http import HttpResponse
from . forms import CreateUserForm, LoginForm, ChangePasswordForm, ComentarioForm
from django.contrib.auth.models import auth, User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
import secrets, string, json
from django.http import HttpResponse
import secrets, string, json, time
from django.core.exceptions import PermissionDenied
import os
from django.conf import settings

# Create your views here.
#se usa con el generico de retornar lista
class BlogPostListCreate(generics.ListCreateAPIView):
    #obtener todos los objetos de BlogPost
    queryset = BlogPost.objects.all()
    #especificar el serializador a usar cuando se retorna los datos
    serializer_class = BlogPostSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
        return super().post(request, *args, **kwargs)

#lo mismo de arriba pero para el REST
class BlogPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    #este argumento hace que se busque por la llave, en este caso id
    lookup_field = "pk"

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
        return super().delete(request, *args, **kwargs)

class ProductosListCreate(generics.ListCreateAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
        return super().post(request, *args, **kwargs)

# Modificar la clase ProductosRetrieveUpdateDestroy
class ProductosRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    lookup_field = "pk"

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
        
        # Get the existing product
        producto = self.get_object()
        
        # Check if we're replacing the image
        if request.FILES.get('imagen'):
            # Delete old image if it exists
            if producto.imagen:
                old_image_path = os.path.join(settings.MEDIA_ROOT, str(producto.imagen))
                if os.path.isfile(old_image_path):
                    os.remove(old_image_path)
        
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('not_pass')
            
        # Get the product before deleting to handle image cleanup
        producto = self.get_object()
        
        # Delete the associated image file if it exists
        if producto.imagen:
            image_path = os.path.join(settings.MEDIA_ROOT, str(producto.imagen))
            if os.path.isfile(image_path):
                os.remove(image_path)
                
        return super().delete(request, *args, **kwargs)

class ComentarioPostListCreate(generics.ListCreateAPIView):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    
class ComentarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    lookup_field = "pk"
#direccion a la pagina fisica dentro del server
#direccion a la pagina fisica dentro del server
def homepage(request):
    return render(request, 'api/index.html')


def register(request):
    form = CreateUserForm()
    #si se hace un post en register esto lo maneja
    
    if request.method == "POST":
        #se asigna el POST a CreateUserForm
        
        form = CreateUserForm(request.POST)
        #si es valido el formulario oficialmente se envia la solicitud    
        if form.is_valid():
            
            form.save()
            #se redirecciona a login
            return redirect("login")
            
    
    #se usa el formulario creado al principio, y se crea el contexto para su uso en el html
    context = {'registerform' : form}
    return render(request, 'api/register.html', context=context)


def login(request):
    form = LoginForm()
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth.login(request, user)
                # Check if user is admin/superuser
                if user.is_superuser:
                    return redirect("admin_dashboard")
                return redirect("dashboard")
            
    context = {'loginform':form}
    return render(request, 'api/login.html', context=context)


#establece que es necesario login para entrar y redirecciona a la pagina del login
@login_required(login_url="login")
def dashboard(request):
    if request.user.is_superuser:
        return redirect("admin_dashboard")
    return render(request, 'api/dashboard.html')

@login_required(login_url="login")
@user_passes_test(lambda u: u.is_superuser)
def admin_dashboard(request):
    return render(request, 'api/dashboard(admin).html')

#logout
def user_logout(request):
    auth.logout(request)
    #redirecciona al index
    return redirect("login")

#cambio de password
@login_required(login_url="login")
def password_change(request):
    form = ChangePasswordForm()
    if request.method == "POST":
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            user = request.user

            # Validaciones
            if not user.check_password(old_password):
                return render(request, 'api/password_change.html', {
                    'ChangePasswordForm': form,
                    'error': 'La contraseña actual es incorrecta'
                })

            if new_password != confirm_password:
                return render(request, 'api/password_change.html', {
                    'ChangePasswordForm': form,
                    'error': 'Las contraseñas nuevas no coinciden'
                })

            if new_password == old_password:
                return render(request, 'api/password_change.html', {
                    'ChangePasswordForm': form,
                    'error': 'La nueva contraseña debe ser diferente a la actual'
                })

            if len(new_password) < 8:
                return render(request, 'api/password_change.html', {
                    'ChangePasswordForm': form,
                    'error': 'La contraseña debe tener al menos 8 caracteres'
                })

            # Si pasa todas las validaciones
            try:
                user.set_password(new_password)
                user.save()
                auth.logout(request)  # Cerrar sesión actual
                # Agregar mensaje de éxito a la sesión
                request.session['password_changed'] = True
                return redirect("login")
            except Exception as e:
                return render(request, 'api/password_change.html', {
                    'ChangePasswordForm': form,
                    'error': 'Error al cambiar la contraseña: ' + str(e)
                })
    
    context = {'ChangePasswordForm': form}
    return render(request, 'api/password_change.html', context=context)

#retornar informacion del usuario actual
@login_required(login_url="login")
def user_info(request):
    if request.method == "GET":
        user = request.user
        username = user.get_username()
        full_name = user.get_full_name()
        first_name = user.get_short_name()
        email = user.email
        last_login = user.last_login
        date_joined = user.date_joined
        isstaff= user.is_staff
        issuperuser= user.is_superuser
        
        
        data = {
        'nombre': first_name,
      	'nombre_completo': full_name,
        'usuario': username,
        'email' : email,
        'login_reciente' : last_login, 
        'fecha_registro' : date_joined,
        'status_staff' : isstaff,
        'status_superuser' : issuperuser

        
    }
    response = HttpResponse(json.dumps(data, indent=4, sort_keys=True, default=str), content_type='application/json')
    return response
@login_required(login_url="login")
def send_comentario(request):
    form = ComentarioForm
    if request.method == "POST":
        form = ComentarioForm(request.POST)
        if form.is_valid():
            comentario_obj = request.POST.get('Comentario')
            print(request.POST.get('Comentario'))
            Comentarios.objects.create(comentario=comentario_obj)
            time.sleep(2)
            return redirect("dashboard")
            
            
    context = {'comentarioform':form}
    
    
    return render(request, 'api/send_comentario.html', context=context)

@login_required(login_url="login")  
def user_show(request):
    return render(request, 'api/user_show.html')



@login_required(login_url="login")
def show_products(request):
    return render(request, 'api/show_products.html')

@login_required(login_url="login")
def information(request):
    return render(request, 'api/information.html')



@login_required(login_url="login")
def about_us(request):
    return render(request, 'api/about_us.html')

@login_required(login_url="login")
def contact(request):
    return render(request, 'api/contact.html')


# Función para verificar si es admin
def is_admin(user):
    return user.is_superuser

@login_required(login_url="login")
@user_passes_test(is_admin, login_url="not_pass")
def edit_coments(request):
    return render(request, 'api/edit_coments(admin).html')

# Agregar la vista not_pass
def not_pass(request):
    return render(request, 'api/not_pass.html')



