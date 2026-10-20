from django.urls import path

from . import views

urlpatterns = [
    path("pedidos/", views.listar_pedidos, name="maker_listar_pedidos"),
]