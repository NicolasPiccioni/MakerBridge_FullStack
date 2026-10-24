from django.urls import path

from . import views

urlpatterns = [
    path("cliente/pedidos/", views.pedidos, name="cliente_pedidos"),
    path("cliente/pedidos/<int:id_pedido>/cotizaciones/", views.cotizaciones_de_pedido,
         name="cliente_cotizaciones_de_pedido"),
    path("cliente/pedidos/<int:id_pedido>/confirmar-recepcion/", views.confirmar_recepcion,
         name="cliente_confirmar_recepcion"),
    path("cliente/cotizaciones/<int:id_cotizacion>/aceptar/", views.aceptar_cotizacion,
         name="cliente_aceptar_cotizacion"),
]