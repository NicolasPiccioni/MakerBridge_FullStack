from django.urls import path

from . import views

urlpatterns = [
    path("perfil/", views.perfil, name="perfil"),
    path("perfil/password/", views.cambiar_password, name="perfil_password"),
]