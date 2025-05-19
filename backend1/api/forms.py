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
        fields = ['username', 'email','password1','password2']
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
    Contraseña_Antigua = forms.CharField(widget=PasswordInput())
    Nueva_Contraseña = forms.CharField(widget=PasswordInput())
    Confirmar_Contraseña = forms.CharField(widget=PasswordInput())