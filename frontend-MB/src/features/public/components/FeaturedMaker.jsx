import { useState, useEffect, useCallback } from "react";
import banner from "../assets/MAKERBRIDGE.png";
import banner2 from "../assets/banner2.png";
// import banner3 from "../assets/BANNER3.png";

const SLIDES = [
  {
    src: banner,
    alt: "MakerBridge: conectamos personas y empresas que necesitan piezas impresas en 3D con makers que tienen impresoras disponibles.",
  },
  { src: banner2,
    alt: "Slogan con niños" },
  // { src: banner3, alt: "..." },
];

const ASPECT = "aspect-16/5"; // proporción real de los banners
const AUTOPLAY_MS = 4000;

/* -------------------------------------------------------------------------------------- */
/* Componente de BANNERS */
/* -------------------------------------------------------------------------------------- */


export default function FeaturedMaker() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  // Autoplay (se pausa al pasar el mouse o enfocar)
  useEffect(() => {
    if (paused || total < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, total]);

  return (
    <section aria-label="Maker Destacado del Mes" className="w-full">
      <div
        className={`relative w-full ${ASPECT} overflow-hidden bg-slate-100`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Pista deslizante */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.alt}
              aria-hidden={i !== current}
              className="w-full h-full shrink-0 object-cover object-center"
            />
          ))}
        </div>

        {/* Flechas */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Banner anterior"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente banner"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores */}
        {total > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir al banner ${i + 1}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-brand-primary" : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}