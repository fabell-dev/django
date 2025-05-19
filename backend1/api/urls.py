from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
#enlazar con el ulrs.py de la otra carpeta
urlpatterns = [
    path("blogpost/" , views.BlogPostListCreate.as_view(), name="blogpost-view-create"),
    #se especifica la ruta
    path(
        "blogpost/<int:pk>/",
        views.BlogPostRetrieveUpdateDestroy.as_view(),
        name="REST",
         
         ),
    path ("productos/", views.ProductosListCreate.as_view(), name="Productos-view-create"),
    path (
          "productos/<str:identificador>/",
          views.ProductosRetrieveUpdateDestroy.as_view(),
          name="ProductosREST" 
        
        
    ),
    path('',views.homepage,name=""),
    
    path('register',views.register,name="register"),
    
    path('login',views.login,name="login"),
    
    path('dashboard',views.dashboard,name="dashboard"),
    
    path('user-logout', views.user_logout, name="user-logout"),
    
    path('password_change', views.password_change, name="password_change"),
    
    #test
    path("user_info" , views.user_info,name="user_info"),
    
    path('perfil', views.perfil, name="perfil"),
    
]
