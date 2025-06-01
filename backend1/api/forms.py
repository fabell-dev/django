#convertir modelos a formularios, necesario para logins y registros
#default para usuarios
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django import forms

from django.forms.widgets import PasswordInput, TextInput


#campos a llenar para el formulario
class CreateUserForm(UserCreationForm):
    class Meta:
        
        model = User
        fields = ['username', 'email','password1','password2','first_name','last_name']
    #definicion de los pass default
   
        
#login del usuario
class LoginForm(AuthenticationForm):
    class Meta:
        #definicion de los campos del modelo que se va usar
        model = User
        #campos
        fields = {'username', 'password'}
        labels = {"username":"Usuario","password":"Contraseña",}
        #ojo, importante para cambiarle el nombre default al label
        widgets={"password": forms.PasswordInput(attrs={'class':'form-control', 'type':'password', "placeholder":"Contraseña"})}
        username = forms.CharField(widget=TextInput())
        password = forms.CharField(widget=PasswordInput())
    #llenado de los campos
    
    
    
#cambio de password
class ChangePasswordForm(forms.Form):
    #llenado de campos
    old_password = forms.CharField(widget=PasswordInput(),label="Contraseña Antigua")
    new_password = forms.CharField(widget=PasswordInput(),label="Contraseña Nueva")
    confirm_password = forms.CharField(widget=PasswordInput(),label="Confirmar Contraseña")
    
#Enviar comentario
class ComentarioForm(forms.Form):
    Comentario = forms.CharField(max_length=2048,label="Comentario",widget=TextInput())