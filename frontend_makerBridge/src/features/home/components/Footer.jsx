const socials = [
  {
    label: "X (Twitter)",
    hover: "hover:bg-slate-900",
    content: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    label: "Instagram",
    hover: "hover:bg-pink-600",
    content: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" />
      </>
    ),
  },
  {
    label: "YouTube",
    hover: "hover:bg-red-600",
    content: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="4" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    hover: "hover:bg-blue-700",
    content: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#f0ebe3] border-t border-stone-300/70 pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-slate-700">
      <div className="max-w-7xl mx-auto">
        {/* Redes sociales */}
        <div className="flex items-center gap-5 pb-8 border-b border-stone-300">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className={`w-10 h-10 rounded-full bg-stone-200/80 hover:text-white flex items-center justify-center transition-colors ${s.hover}`}
            >
              <svg
                className="w-4 h-4 fill-none stroke-current"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {s.content}
              </svg>
            </a>
          ))}
        </div>

        {/* Columnas del footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 pt-10">
          {/* MakerBridge */}
          <div className="md:col-span-2 max-w-md pr-4">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              MakerBridge
            </h3>
            <p className="text-sm leading-7 text-slate-600">
              Conecta creadores, diseñadores industriales e impresores 3D en una
              sola red colaborativa.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
              Explorar
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                "Cómo funciona",
                "Servicios",
                "Proveedores",
                "Sobre nosotros",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-[#e06d53] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
              Contáctanos
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">
                <a
                  href="mailto:makerbridge@gmail.com"
                  className="hover:text-[#e06d53] transition-colors"
                >
                  makerbridge@gmail.com
                </a>
              </p>
              <p className="text-xs leading-6 text-slate-500">
                Soporte y atención de lunes a viernes de 9 a 18 hs.
              </p>
              <p className="text-xs text-slate-500">Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MakerBridge Inc. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              Términos de Servicio
            </a>
            <a href="#" className="hover:underline">
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
