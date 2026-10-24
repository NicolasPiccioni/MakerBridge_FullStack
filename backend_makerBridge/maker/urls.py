from django.urls import path

from . import views

urlpatterns = [
    path("pedidos/", views.listar_pedidos, name="maker_listar_pedidos"),
    path("pedidos/<int:id_pedido>/", views.detalle_pedido, name="maker_detalle_pedido"),
    path("pedidos/<int:id_pedido>/cotizaciones/", views.crear_cotizacion, name="maker_crear_cotizacion"),
    path("maker/trabajos/", views.listar_trabajos, name="maker_listar_trabajos"),
    path("maker/trabajos/<int:id_pedido>/avanzar/", views.avanzar_trabajo, name="maker_avanzar_trabajo"),
]