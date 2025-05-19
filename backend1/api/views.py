from django.shortcuts import render, redirect
#se usa para ver en una web los resultados de la comunicacion con el framework
from rest_framework import generics
#obviamente hay que importar los modelos
from .models import BlogPost
#importar el serializador para trabajar en la web
from .serializers import BlogPostSerializer
from .models import Productos
from .serializers import ProductosSerializer
from django.http import HttpResponse
from . forms import CreateUserForm, LoginForm, ChangePasswordForm
from django.contrib.auth.models import auth, User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
import secrets, string, json
from django.http import HttpResponse

# Create your views here.
#se usa con el generico de retornar lista
class BlogPostListCreate(generics.ListCreateAPIView):
    #obtener todos los objetos de BlogPost
    queryset = BlogPost.objects.all()
    #especificar el serializador a usar cuando se retorna los datos
    serializer_class = BlogPostSerializer

#lo mismo de arriba pero para el REST
class BlogPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    #este argumento hace que se busque por la llave, en este caso id
    lookup_field = "pk"
    
class ProductosListCreate(generics.ListCreateAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    
class ProductosRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    lookup_field = "identificador"
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
            #chequeo de auntentificacion
            user = authenticate(request, username=username, password=password)
            #si el usuario es existente logear
            if user is not None:
                auth.login(request, user)
                return redirect("dashboard")
            
    context = {'loginform':form}
    
    
    return render(request, 'api/login.html', context=context)


#establece que es necesario login para entrar y redirecciona a la pagina del login
@login_required(login_url="login")
def dashboard(request):
    return render(request, 'api/dashboard.html')

#logout
def user_logout(request):
    auth.logout(request)
    #redirecciona al index
    return redirect("")

#cambio de password
@login_required(login_url="login")
def password_change(request):
    form = ChangePasswordForm()
    if request.method == "POST":
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            #se obtienen los valores del formulario/request para hacer las comparaciones
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            #se obtiene el usuario actualmente loggeado
            user = request.user
            #chequeo para cambiar la password
            if new_password == confirm_password and new_password != old_password and user.check_password(old_password) == 1:
                user.set_password(new_password)
                user.save()
                redirect("login")
                print("login")
            else:
                print("error")
                redirect("login")

    
    
    
    
    
    
    context = {'ChangePasswordForm' : form}
    return render(request, 'api/password_change.html',context=context)

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
        
        data = {
        'nombre': first_name,
      	'nombre_completo': full_name,
        'usuario': username,
        'email' : email,
        'login_reciente' : last_login, 
        'fecha_registro' : date_joined
    }
    response = HttpResponse(json.dumps(data, indent=4, sort_keys=True, default=str), content_type='application/json')
    return response
        
@login_required    
def perfil(request):
    return render(request, 'api/perfil.html')

