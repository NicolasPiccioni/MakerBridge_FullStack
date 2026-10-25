import { useRef, useState } from 'react'

const EXTENSIONES_VALIDAS = ['stl', 'obj', 'step', 'stp', '3mf']
const TAMANO_MAXIMO_MB = 50

const MATERIALES = [
  'PLA Estándar (Ecológico y versátil)',
  'PETG (Resistente)',
  'ABS (Alta temperatura)',
  'TPU (Flexible)',
]

const SERVICIOS = ['Impresión 3D', 'Diseño', 'Impresión 3D y diseño']

const MAX_REFERENCIAS = 5
const TAMANO_MAXIMO_REF_MB = 10

const estadoInicial = {
  nombre: '',
  material: MATERIALES[0],
  cantidad: '',
  color: '',
  fechaLimite: '',
  servicio: SERVICIOS[0],
}

// Clases compartidas por todos los campos
const claseCampo =
  'w-full rounded-full border border-[#E3DDCF] bg-[#F8F6F0] px-4 py-2.5 text-sm text-[#2B2B2B] placeholder:text-[#8A8578] focus-visible:border-[#E07A5F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40'

const claseLabel = 'text-xs font-medium text-[#2B2B2B] '
const estilo = 'flex flex-col gap-1.5'

function SubirPedido() {
  const [formulario, setFormulario] = useState(estadoInicial)
  const [archivo, setArchivo] = useState(null)
  const [errorArchivo, setErrorArchivo] = useState('')
  const [arrastrando, setArrastrando] = useState(false)
  const inputArchivo = useRef(null)

  // Archivos de referencia (solo si el servicio incluye diseño)
  const [referencias, setReferencias] = useState([])
  const [errorReferencia, setErrorReferencia] = useState('')
  const [arrastrandoRef, setArrastrandoRef] = useState(false)
  const inputReferencia = useRef(null)

  const incluyeDiseno = formulario.servicio !== 'Impresión 3D'
  const requiereModelo = formulario.servicio === 'Impresión 3D' // el STL es obligatorio solo acá
  const mostrarModelo = formulario.servicio !== 'Diseño' // en "Diseño" no hay modelo previo

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

  // Agrega fotos o archivos de referencia validando tipo, tamaño y cantidad
  const agregarReferencias = (lista) => {
    const nuevos = Array.from(lista)
    const validos = []
    let error = ''

    nuevos.forEach((file) => {
      const esImagen = file.type.startsWith('image/')
      const esPdf = file.type === 'application/pdf'

      if (!esImagen && !esPdf) {
        error = 'Solo se aceptan imágenes (JPG, PNG, WEBP) o PDF.'
      } else if (file.size > TAMANO_MAXIMO_REF_MB * 1024 * 1024) {
        error = `Cada archivo puede pesar hasta ${TAMANO_MAXIMO_REF_MB} MB.`
      } else {
        validos.push({
          id: `${file.name}-${file.lastModified}-${file.size}`,
          file,
          url: esImagen ? URL.createObjectURL(file) : null, // para la vista previa
        })
      }
    })

    const espacio = MAX_REFERENCIAS - referencias.length
    if (validos.length > espacio) {
      validos.slice(espacio).forEach((r) => r.url && URL.revokeObjectURL(r.url))
      error = `Podés subir hasta ${MAX_REFERENCIAS} archivos.`
    }

    setReferencias([...referencias, ...validos.slice(0, espacio)])
    setErrorReferencia(error)
  }

  const handleReferencias = (e) => {
    agregarReferencias(e.target.files)
    e.target.value = '' // permite volver a elegir el mismo archivo
  }

  const handleDropReferencias = (e) => {
    e.preventDefault()
    setArrastrandoRef(false)
    agregarReferencias(e.dataTransfer.files)
  }

  const quitarReferencia = (id) => {
    const referencia = referencias.find((r) => r.id === id)
    if (referencia?.url) URL.revokeObjectURL(referencia.url)
    setReferencias(referencias.filter((r) => r.id !== id))
    setErrorReferencia('')
  }

  const guardarBorrador = () => {
    console.log('guardarBorrador()', formulario, archivo)
  }

  const enviar = (e) => {
    e.preventDefault()

    if (requiereModelo && !archivo) {
      setErrorArchivo('Subí un archivo para continuar.')
      return
    }

    if (incluyeDiseno && referencias.length === 0) {
      setErrorReferencia('Subí al menos una foto o archivo de referencia.')
      return
    }

    // Para enviar los archivos al backend se usa FormData
    const datos = new FormData()
    Object.entries(formulario).forEach(([clave, valor]) => datos.append(clave, valor))
    if (mostrarModelo && archivo) 
    datos.append('archivo', archivo)
    if (incluyeDiseno) {
      referencias.forEach((r) => 
        datos.append('referencias', r.file))
    }

    console.log('enviar()', formulario, archivo, referencias)
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
              <label htmlFor="nombre" className={claseLabel}>
                Nombre del producto
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Ej: Adaptador"
                className={claseCampo}
              />
            </div>

            {/* Tipo de material */}
            <div className={estilo}>
              <label htmlFor="material" className={claseLabel}>
                Tipo de material
              </label>
              <div className="relative">
                <select
                  id="material"
                  name="material"
                  value={formulario.material}
                  onChange={handleChange}
                  className={`${claseCampo} appearance-none pr-10`}
                >
                  {/* Filtrado del array Materiales */}
                  {MATERIALES.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
                <IconoFlecha />
              </div>
            </div>

            {/* Cantidad */}
            <div className={estilo}>
              <label htmlFor="cantidad" className={claseLabel}>
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                min="1"
                required
                value={formulario.cantidad}
                onChange={handleChange}
                placeholder="Ej: 10"
                className={claseCampo}
              />
            </div>

            {/* Color */}
            <div className={estilo}>
              <label htmlFor="color" className={claseLabel}>
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formulario.color}
                onChange={handleChange}
                placeholder="Ingresá tu color"
                className={claseCampo}
              />
            </div>

            {/* Fecha límite */}
            <div className={estilo}>
              <label htmlFor="fechaLimite" className={claseLabel}>
                Fecha límite
              </label>
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formulario.fechaLimite}
                onChange={handleChange}
                className={claseCampo}
              />
            </div>

            {/* Servicio */}
            <div className={estilo}>
              <label htmlFor="servicio" className={claseLabel}>
                Servicio
              </label>
              <div className="relative">
                <select
                  id="servicio"
                  name="servicio"
                  value={formulario.servicio}
                  onChange={handleChange}
                  className={`${claseCampo} appearance-none pr-10`}
                >
                  {/* Filtrado del array Servicios */}
                  {SERVICIOS.map((servicio) => (
                    <option key={servicio} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Observaciones o sugerencias */}
          <div className={estilo}>
            <label htmlFor="observaciones" className={claseLabel}>
              Observacion o sugerencias
            </label>
            <textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={handleChange}
                rows={4}
                className='min-h-28 w-full resize-y rounded-2xl border border-[#E3DDCF] bg-[#F8F6F0] px-4 py-2.5 text-sm text-[#2B2B2B] placeholder:text-[#8A8578] focus-visible:border-[#E07A5F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40'
              />
          </div>
          

          {/* Zona para subir el archivo STL (no aparece si el servicio es solo Diseño) */}
          {mostrarModelo && (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setArrastrando(true)
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={handleDrop}
            className={`mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors sm:py-14 ${
              arrastrando
                ? 'border-[#6E9B72] bg-[#DCE8D8]'
                : 'border-[#A8C0A4] bg-[#E6EEE2]'
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-white text-[#4A7A93]">
              <IconoCubo />
            </div>

            <h2 className="mt-1 text-base font-bold text-[#2B2B2B] sm:text-lg">
              Subí tu archivo STL
            </h2>
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
                <span className="truncate">{archivo.name}</span>
                <button
                  type="button"
                  onClick={quitarArchivo}
                  className="shrink-0 cursor-pointer text-[#E07A5F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40"
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

          {/* Referencias del diseño (aparece si el servicio incluye Diseño) */}
          {incluyeDiseno && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setArrastrandoRef(true)
              }}
              onDragLeave={() => setArrastrandoRef(false)}
              onDrop={handleDropReferencias}
              className={`mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors sm:py-12 ${
                arrastrandoRef
                  ? 'border-[#C9A96B] bg-[#F3E8D0]'
                  : 'border-[#D8C7A0] bg-[#F8F2E6]'
              }`}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-white text-[#B07A2E]">
                <IconoImagen />
              </div>

              <h2 className="mt-1 text-base font-bold text-[#2B2B2B] sm:text-lg">
                Subí una referencia para tu diseño
              </h2>
              <p className="max-w-md text-xs text-[#6B6B63]">
                Fotos, bocetos o planos: JPG, PNG, WEBP o PDF (máx. {TAMANO_MAXIMO_REF_MB} MB
                cada uno, hasta {MAX_REFERENCIAS} archivos)
              </p>

              <input
                ref={inputReferencia}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleReferencias}
                className="sr-only"
                aria-label="Archivos de referencia"
              />

              <button
                type="button"
                onClick={() => inputReferencia.current?.click()}
                disabled={referencias.length >= MAX_REFERENCIAS}
                className="mt-2 cursor-pointer rounded-full bg-white px-5 py-2 text-xs font-medium text-[#2B2B2B] shadow-sm transition-colors hover:bg-[#F8F6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Seleccionar fotos o archivos
              </button>

              {referencias.length > 0 && (
                <ul className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {referencias.map((r) => (
                    <li
                      key={r.id}
                      className="relative flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm"
                    >
                      {r.url ? (
                        <img
                          src={r.url}
                          alt={`Referencia ${r.file.name}`}
                          className="h-24 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-full items-center justify-center bg-[#F1EDE3] text-xs font-bold text-[#6B6B63]">
                          PDF
                        </div>
                      )}
                      <span className="truncate px-2 py-1.5 text-[11px] text-[#2B2B2B]">
                        {r.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => quitarReferencia(r.id)}
                        aria-label={`Quitar ${r.file.name}`}
                        className="absolute right-1.5 top-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-sm font-bold text-[#B3402A] shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/50"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {errorReferencia && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B3402A]">
                  {errorReferencia}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Botones: apilados en celular, separados a los extremos desde sm */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={guardarBorrador}
            className="cursor-pointer rounded-full border border-[#D9D3C5] bg-white px-6 py-2.5 text-sm font-medium text-[#2B2B2B] transition-colors hover:bg-[#F8F6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/40"
          >
            Guardar borrador
          </button>

          <button
            type="submit"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#E07A5F] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C9654B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]/50 focus-visible:ring-offset-2"
          >
            Subir pedido
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

// Ícono de la zona de referencias
function IconoImagen() {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16l-5-5-8 9" />
    </svg>
  )
}

export default SubirPedido

