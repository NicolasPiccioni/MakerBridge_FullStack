BEGIN;

-- 1. Columnas nuevas (quedan opcionales para no romper inserts de otros)
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS titulo VARCHAR(200);
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(150);

-- 2. Sacar el CHECK viejo de estado (sin depender de cómo se llame)
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.pedidos'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%estado%'
  LOOP
    EXECUTE format('ALTER TABLE public.pedidos DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- 3. Convertir los pedidos que ya existen
UPDATE public.pedidos SET estado = 'abierto'    WHERE estado IN ('pendiente', 'cotizado');
UPDATE public.pedidos SET estado = 'finalizado' WHERE estado IN ('terminado', 'entregado');

-- 4. Nuevo CHECK y nuevo default
ALTER TABLE public.pedidos ADD CONSTRAINT pedidos_estado_check CHECK (
  estado IN ('abierto', 'asignado', 'en_proceso', 'listo_despacho',
             'en_transito', 'finalizado', 'cancelado')
);
ALTER TABLE public.pedidos ALTER COLUMN estado SET DEFAULT 'abierto';

-- 5. Los pedidos viejos no tienen título: usamos el comienzo de la descripción
UPDATE public.pedidos SET titulo = LEFT(descripcion, 80) WHERE titulo IS NULL;

COMMIT;