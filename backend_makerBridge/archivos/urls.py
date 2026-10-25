from django.urls import path

from . import views

urlpatterns = [
    path("archivos/", views.subir_archivo, name="subir_archivo"),
    path("pedidos/<int:id_pedido>/archivo/", views.archivo_de_pedido, name="archivo_de_pedido"),
]