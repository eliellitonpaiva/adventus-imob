import React from "react";

const Rodape = () => {
  return (
    <footer className="bg-adventus-primary text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Coluna 1: Logo e informações */}
          <div className="flex flex-col">
            <img
              src="https://adventusimobiliaria.com.br/img/adventusimobiliaria.png"
              alt="Adventus Imobiliária"
              className="h-10 md:h-12 w-auto mb-4"
            />
            <p className="text-white/80 text-[15px] leading-relaxed mb-2">
              Rua Fortaleza 1382-B, Centro
              <br />
              Açailândia - MA
            </p>
            <p className="text-white/80 text-[15px]">CRECI - MA 3716</p>
          </div>

          {/* Coluna 2: Redes sociais */}
          <div className="flex flex-col">
            <h4 className="font-bold text-lg mb-4 text-adventus-accent">
              Redes Sociais
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-adventus-accent transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-adventus-accent transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
            </div>
          </div>

          {/* Coluna 3: Contato e WhatsApp */}
          <div className="flex flex-col">
            <h4 className="font-bold text-lg mb-4 text-adventus-accent">
              Fale com a gente
            </h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-[15px]">
                <i className="fas fa-phone text-adventus-accent mr-3"></i>
                <span>(99) 98808-7867</span>
              </div>
              <div className="flex items-center text-[15px]">
                <i className="fas fa-envelope text-adventus-accent mr-3"></i>
                <span>adventusimobiliaria@gmail.com</span>
              </div>
            </div>

            {/* Botão WhatsApp - LARGURA CONTROLADA */}
            <div className="flex">
              <a
                href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-adventus-yellow to-yellow-400 text-white px-4 py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-shadow"
              >
                <span>Chama no ZAP!</span>
                <span className="ml-2 bg-white text-adventus-yellow rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className="fab fa-whatsapp text-xs"></i>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Linha de direitos autorais */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-[14px]">
            © 2026 Adventu's Imobiliária. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
