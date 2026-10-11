from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.register_user, name="register_user"),
    path("auth/login/", views.login_user, name="login_user"),
    path("auth/me/", views.me, name="me"),
    path("cliente/panel/", views.panel_cliente, name="panel_cliente"),
    path("maker/panel/", views.panel_maker, name="panel_maker"),
    path("admin/panel/", views.panel_admin, name="panel_admin"),
]