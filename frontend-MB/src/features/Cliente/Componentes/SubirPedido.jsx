import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { crearPedido, subirArchivo } from '../../../api/clienteApi'

// Mismos límites que valida el backend
const EXTENSIONES_VALIDAS = ['stl', 'obj', 'step', 'stp', '3mf']
const TAMANO_MAXIMO_MB = 50

// `valor` es lo que se guarda (corto, para que los filtros del maker lo reconozcan)
const MATERIALES = [
  { valor: 'PLA', etiqueta: 'PLA Estándar (Ecológico y versátil)' },
  { valor: 'PETG', etiqueta: 'PETG (Resistente)' },
  { valor: 'ABS', etiqueta: 'ABS (Alta temperatura)' },
  { valor: 'TPU', etiqueta: 'TPU (Flexible)' },
]

const SERVICIOS = ['Impresión 3D', 'Diseño', 'Impresión 3D y diseño']

const MAX_DESCRIPCION = 1600 // el backend acepta 2000 y le sumamos el servicio y el link

// 'AAAA-MM-DD' en la hora local (el backend no acepta fechas anteriores a hoy)
const hoy = () => new Date().toLocaleDateString('en-CA')

const estadoInicial = {
  nombre: '',
  material: MATERIALES[0].valor,
  cantidad: '',
  color: '',
  ubicacion: '',
  fechaLimite: '',
  servicio: SERVICIOS[0],
  observaciones: '',
  archivoUrl: '',
}

// Campo que nombra el backend -> campo de este formulario
const CAMPO_DEL_FORMULARIO = {
  titulo: 'nombre',
  descripcion: 'observaciones',
  cantidad: 'cantidad',
  material: 'material',
  color: 'color',
  ubicacion: 'ubicacion',
  fecha_limite: 'fechaLimite',
  archivo_url: 'archivoUrl',
}

const claseBase =
  'w-full rounded-full border bg-[#F8F6F0] px-4 py-2.5 text-sm text-[#2B2B2B] placeholder:text-[#8A8578] focus-visible:border-[#E07A5F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40'

const claseLabel = 'text-xs font-medium text-[#2B2B2B] '
const estilo = 'flex flex-col gap-1.5'

function SubirPedido() {
  const [formulario, setFormulario] = useState(estadoInicial)
  const [enviando, setEnviando] = useState(false)
  const [fase, setFase] = useState('') // 'subiendo' | 'publicando'
  const [error, setError] = useState(null) // { campo, mensaje }
  const [publicado, setPublicado] = useState(null) // id del pedido recién creado

  // Archivo 3D
  const [archivo, setArchivo] = useState(null)
  const [errorArchivo, setErrorArchivo] = useState('')
  const [arrastrando, setArrastrando] = useState(false)
  const [subido, setSubido] = useState(null) // { ruta, origen } -> se reutiliza si hay que reintentar
  const inputArchivo = useRef(null)

  const requiereModelo = formulario.servicio === 'Impresión 3D' // el archivo es obligatorio solo acá
  const mostrarModelo = formulario.servicio !== 'Diseño' // en "Diseño" no hay modelo previo
  const incluyeDiseno = formulario.servicio !== 'Impresión 3D'

  // Borde normal, o rojo si el servidor marcó este campo
  const campo = (nombre) =>
    `${claseBase} ${error?.campo === nombre ? 'border-[#B3402A] ring-2 ring-[#B3402A]/20' : 'border-[#E3DDCF]'}`

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
  }

  // Valida extensión y tamaño antes de aceptar el archivo
  const seleccionarArchivo = (file) => {
    if (!file) return

    const extension = file.name.split('.').pop().toLowerCase()

    if (!EXTENSIONES_VALIDAS.includes(extension)) {
      setArchivo(null)
      setErrorArchivo('Formato no soportado. Usá STL, OBJ, STEP o 3MF.')
      return
    }

    if (file.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      setArchivo(null)
      setErrorArchivo(`El archivo supera los ${TAMANO_MAXIMO_MB} MB.`)
      return
    }

    setErrorArchivo('')
    setArchivo(file)
  }

  const handleArchivo = (e) => seleccionarArchivo(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setArrastrando(false)
    seleccionarArchivo(e.dataTransfer.files[0])
  }

  const quitarArchivo = () => {
    setArchivo(null)
    setErrorArchivo('')
    if (inputArchivo.current) inputArchivo.current.value = ''
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return

    const link = formulario.archivoUrl.trim()
    if (requiereModelo && !archivo && !link) {
      setErrorArchivo('Subí tu archivo 3D para continuar (o pegá un link en el campo de abajo).')
      return
    }

    setError(null)
    setErrorArchivo('')
    setEnviando(true)

    try {
      // 1) Subir el archivo (si ya se subió en un intento anterior, se reutiliza)
      let ruta = ''
      if (mostrarModelo && archivo) {
        if (subido?.origen === archivo) {
          ruta = subido.ruta
        } else {
          setFase('subiendo')
          const res = await subirArchivo(archivo)
          ruta = res.archivo
          setSubido({ ruta, origen: archivo })
        }
      }

      // 2) Publicar el pedido. No hay columna de servicio: va como primera línea de la descripción.
      setFase('publicando')
      const descripcion = [
        `Servicio: ${formulario.servicio}`,
        formulario.observaciones.trim(),
        ruta && link ? `Referencias: ${link}` : '', // si hay archivo y link, el link no se pierde
      ]
        .filter(Boolean)
        .join('\n')

      const res = await crearPedido({
        titulo: formulario.nombre.trim(),
        descripcion,
        cantidad: Number(formulario.cantidad),
        material: formulario.material,
        color: formulario.color.trim(),
        ubicacion: formulario.ubicacion.trim(),
        fecha_limite: formulario.fechaLimite,
        archivo_url: ruta || link,
      })
      setPublicado(res.id_pedido)
    } catch (err) {
      const mensaje =
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor'
          : err.message || 'No pudimos publicar tu solicitud'

      if (err.campo === 'archivo') setErrorArchivo(mensaje) // error de la subida del archivo
      else setError({ campo: CAMPO_DEL_FORMULARIO[err.campo] ?? null, mensaje })
    } finally {
      setEnviando(false)
      setFase('')
    }
  }

  const publicarOtro = () => {
    setFormulario(estadoInicial)
    setArchivo(null)
    setSubido(null)
    setError(null)
    setErrorArchivo('')
    setPublicado(null)
  }

  /* ------------------------------------------- Pedido publicado --------------------------------------------- */
  if (publicado) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm" role="status">
          <h2 className="text-xl font-bold text-emerald-700">¡Solicitud publicada!</h2>
          <p className="mt-2 text-sm text-[#6B6B63]">
            Tu pedido #MK-{publicado} ya está visible para los makers. Cuando alguno lo cotice, te avisamos por mail.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/cliente"
              className="rounded-full bg-[#E07A5F] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C9654B]"
            >
              Ver mis solicitudes
            </Link>
            <button
              type="button"
              onClick={publicarOtro}
              className="cursor-pointer rounded-full border border-[#D9D3C5] bg-white px-6 py-2.5 text-sm font-medium text-[#2B2B2B] transition-colors hover:bg-[#F8F6F0]"
            >
              Publicar otra
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------ Vista --------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#F8F6F1] px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={enviar} className="mx-auto w-full max-w-5xl">
        {/* Tarjeta del formulario */}
        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          {/* 1 columna en celular, 2 en tablet, 3 en notebook */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Nombre del producto */}
            <div className={estilo}>
              <label htmlFor="nombre" className={claseLabel}>Nombre del producto</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                maxLength={200}
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Ej: Adaptador"
                className={campo('nombre')}
              />
            </div>

            {/* Tipo de material */}
            <div className={estilo}>
              <label htmlFor="material" className={claseLabel}>Tipo de material</label>
              <div className="relative">
                <select
                  id="material"
                  name="material"
                  value={formulario.material}
                  onChange={handleChange}
                  className={`${campo('material')} appearance-none pr-10`}
                >
                  {MATERIALES.map((m) => (
                    <option key={m.valor} value={m.valor}>{m.etiqueta}</option>
                  ))}
                </select>
                <IconoFlecha />
              </div>
            </div>

            {/* Cantidad */}
            <div className={estilo}>
              <label htmlFor="cantidad" className={claseLabel}>Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                min="1"
                max="10000"
                required
                value={formulario.cantidad}
                onChange={handleChange}
                placeholder="Ej: 10"
                className={campo('cantidad')}
              />
            </div>

            {/* Color */}
            <div className={estilo}>
              <label htmlFor="color" className={claseLabel}>Color</label>
              <input
                type="text"
                id="color"
                name="color"
                maxLength={50}
                value={formulario.color}
                onChange={handleChange}
                placeholder="Ingresá tu color"
                className={campo('color')}
              />
            </div>

            {/* Ubicación (el maker la muestra en cada pedido) */}
            <div className={estilo}>
              <label htmlFor="ubicacion" className={claseLabel}>Ubicación</label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                required
                maxLength={150}
                value={formulario.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Córdoba Capital"
                className={campo('ubicacion')}
              />
            </div>

            {/* Fecha límite */}
            <div className={estilo}>
              <label htmlFor="fechaLimite" className={claseLabel}>Fecha límite</label>
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                required
                min={hoy()}
                value={formulario.fechaLimite}
                onChange={handleChange}
                className={campo('fechaLimite')}
              />
            </div>

            {/* Servicio */}
            <div className={estilo}>
              <label htmlFor="servicio" className={claseLabel}>Servicio</label>
              <div className="relative">
                <select
                  id="servicio"
                  name="servicio"
                  value={formulario.servicio}
                  onChange={handleChange}
                  className={`${campo('servicio')} appearance-none pr-10`}
                >
                  {SERVICIOS.map((servicio) => (
                    <option key={servicio} value={servicio}>{servicio}</option>
                  ))}
                </select>
                <IconoFlecha />
              </div>
            </div>

            {/* Link a referencias o archivos adicionales */}
            <div className={`${estilo} sm:col-span-2`}>
              <label htmlFor="archivoUrl" className={claseLabel}>
                Link a referencias o archivos adicionales (opcional)
              </label>
              <input
                type="url"
                id="archivoUrl"
                name="archivoUrl"
                maxLength={300}
                value={formulario.archivoUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/…"
                className={campo('archivoUrl')}
              />
              <p className="text-[11px] text-[#6B6B63]">
                Las fotos o planos de referencia todavía no se pueden subir acá: subilos a Drive o Dropbox y pegá el link.
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className={`${estilo} mt-5`}>
            <label htmlFor="observaciones" className={claseLabel}>
              Descripción del pedido{incluyeDiseno ? ' (contanos qué querés que diseñemos)' : ''}
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formulario.observaciones}
              onChange={handleChange}
              rows={4}
              required={incluyeDiseno}
              maxLength={MAX_DESCRIPCION}
              placeholder="Contanos qué necesitás: medidas, para qué se usa, observaciones o sugerencias."
              className={`min-h-28 w-full resize-y rounded-2xl border bg-[#F8F6F0] px-4 py-2.5 text-sm text-[#2B2B2B] placeholder:text-[#8A8578] focus-visible:border-[#E07A5F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40 ${
                error?.campo === 'observaciones' ? 'border-[#B3402A] ring-2 ring-[#B3402A]/20' : 'border-[#E3DDCF]'
              }`}
            />
          </div>

          {/* Zona para subir el archivo 3D (no aparece si el servicio es solo Diseño) */}
          {mostrarModelo && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setArrastrando(true)
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={handleDrop}
              className={`mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors sm:py-14 ${
                arrastrando ? 'border-[#6E9B72] bg-[#DCE8D8]' : 'border-[#A8C0A4] bg-[#E6EEE2]'
              }`}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-white text-[#4A7A93]">
                <IconoCubo />
              </div>

              <h2 className="mt-1 text-base font-bold text-[#2B2B2B] sm:text-lg">Subí tu archivo 3D</h2>
              <p className="text-xs text-[#6B6B63]">
                Formatos soportados: STL, OBJ, STEP, 3MF (máx. {TAMANO_MAXIMO_MB} MB)
              </p>

              <input
                ref={inputArchivo}
                type="file"
                accept=".stl,.obj,.step,.stp,.3mf"
                onChange={handleArchivo}
                className="sr-only"
                aria-label="Archivo del modelo 3D"
              />

              {archivo ? (
                <div className="mt-2 flex max-w-full items-center gap-3 rounded-full bg-white px-4 py-2 text-xs font-medium text-[#2B2B2B]">
                  <span className="truncate">
                    {archivo.name} · {(archivo.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={quitarArchivo}
                    disabled={enviando}
                    className="shrink-0 cursor-pointer text-[#E07A5F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40 disabled:opacity-50"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputArchivo.current?.click()}
                  className="mt-2 cursor-pointer rounded-full bg-white px-5 py-2 text-xs font-medium text-[#2B2B2B] shadow-sm transition-colors hover:bg-[#F8F6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E9B72]"
                >
                  Seleccionar desde mi dispositivo
                </button>
              )}

              {errorArchivo && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B3402A]">
                  {errorArchivo}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mx-auto mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-8">
            {error.mensaje}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={() => console.log('guardarBorrador()', formulario)}
            className="cursor-pointer rounded-full border border-[#D9D3C5] bg-white px-6 py-2.5 text-sm font-medium text-[#2B2B2B] transition-colors hover:bg-[#F8F6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40"
          >
            Guardar borrador
          </button>

          <button
            type="submit"
            disabled={enviando}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E07A5F] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C9654B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? (fase === 'subiendo' ? 'Subiendo archivo…' : 'Publicando…') : 'Subir pedido'}
            {!enviando && (
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// Flecha de los select
function IconoFlecha() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#6B6B63]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Ícono del cubo de la zona de carga
function IconoCubo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3.3 7.5L12 12.5l8.7-5M12 22V12.5" />
    </svg>
  )
}

export default SubirPedido