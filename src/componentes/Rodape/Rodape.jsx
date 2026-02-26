import React from "react";

const Rodape = () => {
  // Pega o ano atual automaticamente
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-[#31363E] text-white pt-10 md:pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* GRID PRINCIPAL DESLOCADO 15px PARA A DIREITA */}
        <div className="relative left-[15px] md:left-[15px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Coluna 1: Logo e informações */}
            <div className="flex flex-col">
              <div className="w-28 md:w-32 mb-4">
                <img
                  src="https://adventusimobiliaria.com.br/img/adventus-imobiliaria.png"
                  alt="Adventus Imobiliária"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-white/80 text-[15px] leading-relaxed mb-2">
                Rua Fortaleza 1382-B, Centro
                <br />
                Açailândia - MA
              </p>
              <p className="text-white/80 text-[15px]">CRECI - MA 3716</p>

              {/* LINHA DEPOIS DO CRECI */}
              <div className="w-12 h-px bg-[#D4A24D]/30 mt-4 mb-2"></div>
            </div>

            {/* Coluna 2: Redes sociais e Política de Privacidade */}
            <div className="flex flex-col">
              <h4 className="font-bold text-lg mb-4 text-[#D4A24D]">
                Redes Sociais
              </h4>
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4A24D] transition-colors"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4A24D] transition-colors"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
              </div>

              {/* Política de Privacidade */}
              <a
                href="/politica-de-privacidade"
                className="inline-flex items-center text-sm text-white/70 hover:text-[#D4A24D] transition-colors duration-300 group w-fit mb-2"
              >
                <i className="fas fa-shield-alt text-[#D4A24D] mr-2 text-xs"></i>
                <span>Política de Privacidade</span>
                <i className="fas fa-arrow-right text-xs ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
              </a>

              {/* LINHA DEPOIS DA POLÍTICA DE PRIVACIDADE */}
              <div className="w-12 h-px bg-[#D4A24D]/30 mt-2"></div>
            </div>

            {/* Coluna 3: Contato e WhatsApp */}
            <div className="flex flex-col">
              <h4 className="font-bold text-lg mb-4 text-[#D4A24D]">
                Fale com a gente
              </h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-[15px]">
                  <i className="fas fa-phone text-[#D4A24D] mr-3"></i>
                  <span>(99) 98808-7867</span>
                </div>
                <div className="flex items-center text-[15px]">
                  <i className="fas fa-envelope text-[#D4A24D] mr-3"></i>
                  <span>adventusimobiliaria@gmail.com</span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex">
                <a
                  href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#D4A24D] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#D4A24D]/90 transition-all duration-300 hover:shadow-lg"
                >
                  <span>Chama no ZAP!</span>
                  <span className="ml-2 bg-white text-[#D4A24D] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-whatsapp text-xs"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT - SEM DESLOCAMENTO (centralizado) */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/60 text-[14px]">
            © {anoAtual} Adventu's Imobiliária. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
