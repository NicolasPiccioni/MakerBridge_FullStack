
const FotoDePerfil = ({ user }) => (
  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-brand-border-subtle flex flex-col items-center text-center relative overflow-hidden">
    <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-salvia-light rounded-full opacity-50 blur-2xl pointer-events-none" />

    <div className="relative mb-5">
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F4EEE4] border-2 border-brand-border-subtle/60 flex items-center justify-center p-3 shadow-inner">
        <svg className="w-full h-full" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" fill="#F0F5F8" r="88" />
          <path d="M48 185C48 152 70 142 100 142C130 142 152 152 152 185" fill="#BDE0FE" />
          <path d="M85 142C85 152 115 152 115 142" fill="#D3EAFE" stroke="#90C2EB" strokeWidth="3" />
          <path d="M88 120H112V145H88V120Z" fill="#F3BF88" />
          <path d="M88 128C96 135 104 135 112 128V145H88V128Z" fill="#E6AC73" />
          <rect fill="#F9CBA0" height="65" rx="30" width="64" x="68" y="65" />
          <path d="M68 85C68 55 82 45 100 45C118 45 132 55 132 85C132 87 130 95 126 95C122 95 120 78 100 78C80 78 78 95 74 95C70 95 68 87 68 85Z" fill="#8D5B4C" />
          <path d="M66 75C64 62 74 48 98 46C122 44 134 58 134 75C134 77 127 68 116 68C103 68 96 74 84 74C74 74 68 76 66 75Z" fill="#6E4437" />
          <circle cx="68" cy="98" fill="#F3BF88" r="8" />
          <circle cx="132" cy="98" fill="#F3BF88" r="8" />
          <circle cx="85" cy="95" fill="#42281D" r="4.5" />
          <circle cx="115" cy="95" fill="#42281D" r="4.5" />
          <circle cx="86.5" cy="93.5" fill="white" r="1.5" />
          <circle cx="116.5" cy="93.5" fill="white" r="1.5" />
          <path d="M88 108C88 116 112 116 112 108" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="6" />
          <rect fill="#F9CBA0" height="26" rx="8" stroke="#E6AC73" strokeWidth="2" width="22" x="86" y="160" />
          <rect fill="#A8B4BD" height="20" rx="3" width="6" x="94" y="145" />
        </svg>
      </div>

      <button
        type="button"
        title="Cambiar imagen de perfil"
        className="absolute bottom-2 right-2 bg-brand-dark hover:bg-brand-terracota text-white p-2.5 rounded-full shadow-md transition transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </div>

    <h2 className="text-xl font-bold text-brand-dark">{user.nombre}</h2>
    <p className="text-xs font-semibold text-brand-dark-muted mt-0.5">{user.tipo}</p>

    <div className="mt-4 flex items-center gap-2">
      {user.verificado && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-salvia/20 text-[#3d6137]">
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path clipRule="evenodd" fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
          Identidad Verificada
        </span>
      )}
      {user.nivel && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-crema text-brand-dark-muted border border-brand-border-subtle">
          {user.nivel}
        </span>
      )}
    </div>
  </div>
);

export default FotoDePerfil;