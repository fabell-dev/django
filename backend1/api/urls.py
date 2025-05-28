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
    path ("comentario/", views.ComentarioPostListCreate.as_view(), name = "comentario"),
    
    path ("comentario/<int:id_comentario>/", views.ComentarioRetrieveUpdateDestroy.as_view(),name="Comentarios-view-create"),
    
    path('send_comentario',views.send_comentario, name="send_comentario"),
    
    path('index',views.homepage,name="index"),
    
    path('register',views.register,name="register"),
    
    path('login',views.login,name="login"),
    
    path('dashboard',views.dashboard,name="dashboard"),
    
    path('dashboard(admin)', views.admin_dashboard, name='admin_dashboard'),

    path('user-logout', views.user_logout, name="user-logout"),

    path('user_show',views.user_show,name="user_show"),
    
    path('password_change', views.password_change, name="password_change"),
    
    #test
    path("user_info" , views.user_info,name="user_info"),

    path('show_products',views.show_products ,name="show_products"),

    path('about_us',views.about_us ,name="about_us"),

    path('contact',views.contact ,name="contact"),

    path('information',views.information ,name="information"),

    path('edit_information',views.edit_information ,name="edit_information"),

    path('edit_products',views.edit_products ,name="edit_products")
    
    
]
