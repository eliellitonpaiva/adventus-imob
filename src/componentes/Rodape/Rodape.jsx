import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const Rodape = () => {
  // Pega o ano atual automaticamente
  const anoAtual = new Date().getFullYear();

  // Estado para as configurações
  const [config, setConfig] = useState({
    whatsapp: "",
    telefone: "",
    email_contato: "",
    instagram: "",
    facebook: "",
    endereco: "",
    creci: "",
  });

  const [loading, setLoading] = useState(true);

  // Buscar configurações ao carregar
  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .in("key", [
          "whatsapp",
          "telefone",
          "email_contato",
          "instagram",
          "facebook",
          "endereco",
          "creci",
        ]);

      if (error) throw error;

      // Converter array para objeto
      const configObj = {};
      data.forEach((item) => {
        configObj[item.key] = item.value;
      });

      setConfig(configObj);
    } catch (error) {
      console.error("Erro ao carregar configurações do rodapé:", error);
    } finally {
      setLoading(false);
    }
  };

  // Formatar número do WhatsApp (remover caracteres não numéricos)
  const formatarWhatsApp = (numero) => {
    if (!numero) return "";
    return numero.replace(/\D/g, "");
  };

  // Se estiver carregando, mostra um esqueleto simples
  if (loading) {
    return (
      <footer className="bg-[#31363E] text-white pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-40 bg-gray-600/20 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  // Montar link do WhatsApp
  const numeroWhatsApp = formatarWhatsApp(config.whatsapp);
  const linkWhatsApp = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor.`
    : "#";

  return (
    <footer className="bg-[#31363E] text-white pt-12 md:pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* GRID PRINCIPAL - COM MAIS ESPAÇAMENTO ENTRE ELEMENTOS */}
        <div className="relative left-[15px] md:left-[15px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Coluna 1: Logo e informações */}
            <div className="flex flex-col">
              <div className="w-28 md:w-32 mb-5">
                <img
                  src="https://adventusimobiliaria.com.br/img/adventus-imobiliaria.png"
                  alt="Adventus Imobiliária"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-white/80 text-[15px] leading-relaxed mb-3">
                {config.endereco ||
                  "Rua Fortaleza 1382-B, Centro, Açailândia - MA"}
              </p>
              <p className="text-white/80 text-[15px] mb-2">
                CRECI - {config.creci || "MA 3716"}
              </p>

              {/* LINHA DEPOIS DO CRECI */}
              <div className="w-12 h-px bg-[#D4A24D]/30 mt-5 mb-3"></div>
            </div>

            {/* Coluna 2: Redes sociais e Política de Privacidade */}
            <div className="flex flex-col">
              <h4 className="font-bold text-lg mb-5 text-[#D4A24D]">
                Redes Sociais
              </h4>
              <div className="flex space-x-4 mb-8">
                {/* Instagram */}
                <a
                  href={config.instagram || "#"}
                  target={config.instagram ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4A24D] transition-colors"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                {/* Facebook */}
                <a
                  href={config.facebook || "#"}
                  target={config.facebook ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#D4A24D] transition-colors"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
              </div>

              {/* Política de Privacidade - COM MAIS ESPAÇO */}
              <div className="mb-6">
                <a
                  href="/politica-de-privacidade"
                  className="inline-flex items-center text-sm text-white/70 hover:text-[#D4A24D] transition-colors duration-300 group w-fit mb-2"
                >
                  <i className="fas fa-shield-alt text-[#D4A24D] mr-2 text-xs"></i>
                  <span>Política de Privacidade</span>
                  <i className="fas fa-arrow-right text-xs ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </a>
              </div>

              {/* LINHA DEPOIS DA POLÍTICA DE PRIVACIDADE */}
              <div className="w-12 h-px bg-[#D4A24D]/30 mt-1"></div>
            </div>

            {/* Coluna 3: Contato e WhatsApp */}
            <div className="flex flex-col">
              <h4 className="font-bold text-lg mb-5 text-[#D4A24D]">
                Fale com a gente
              </h4>

              {/* ESPAÇAMENTO MAIOR ENTRE OS ÍTENS DE CONTATO */}
              <div className="space-y-4 mb-8">
                {/* Telefone */}
                <div className="flex items-center text-[15px]">
                  <i className="fas fa-phone text-[#D4A24D] mr-3 text-base"></i>
                  <span>{config.telefone || "(99) 98808-7867"}</span>
                </div>
                {/* E-mail */}
                <div className="flex items-center text-[15px]">
                  <i className="fas fa-envelope text-[#D4A24D] mr-3 text-base"></i>
                  <span>
                    {config.email_contato || "adventusimobiliaria@gmail.com"}
                  </span>
                </div>
              </div>

              {/* WhatsApp - COM MAIS ESPAÇO ACIMA */}
              <div className="flex mt-2">
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg ${
                    numeroWhatsApp
                      ? "bg-[#D4A24D] text-white hover:bg-[#D4A24D]/90"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
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

        {/* COPYRIGHT - COM MAIS ESPAÇAMENTO E RESPIIRO */}
        <div className="border-t border-white/20 mt-12 pt-8 pb-6 text-center">
          <p className="text-white/60 text-[14px]">
            © {anoAtual} Adventu's Imobiliária. Todos os direitos reservados.
          </p>
          {/* ESPAÇO EXTRA DE 4px NA PARTE INFERIOR */}
          <div className="h-1"></div>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
