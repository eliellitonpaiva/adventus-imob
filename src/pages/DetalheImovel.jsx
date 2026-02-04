// src/pages/DetalheImovel.jsx - VERSÃO FINAL COMPLETA COM MODAL ATUALIZADO
import React, { useState, useEffect, useRef } from "react";

const DetalheImovel = () => {
  const [imagemAtual, setImagemAtual] = useState(0);
  const [acordeaoAberto, setAcordeaoAberto] = useState(null);
  const [estaArrastando, setEstaArrastando] = useState(false);
  const [inicioX, setInicioX] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    mensagem: "Tenho interesse na casa de 3 dormitórios. Aguardo informações.",
    horarioPreferencia: "",
    diaSemana: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const carrosselRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Cor principal #D4A24D
  const corPrincipal = "#D4A24D";
  const corPrincipalClara = "#E6B85C";
  const corPrincipalEscura = "#C4933E";

  // WhatsApp real da imobiliária
  const whatsappNumber = "5599988087867"; // (99) 98808-7867
  const whatsappMessage =
    "Olá! Tenho interesse na casa de 3 dormitórios e gostaria de mais informações.";

  // Dados do imóvel
  const dadosImovel = {
    titulo: "Casa 3 Dormitórios com Suíte - Centro",
    localizacao: "Centro, Açailândia - MA",
    preco: "R$ 280.000",
  };

  // Dados simples - apenas visualizações
  const visualizacoesTotais = 1247;

  // Imagens do carrossel
  const imagens = [
    "https://adventusimobiliaria.com.br/img/imovei/filename/29/WhatsApp%20Image%202022-09-26%20at%2018.36.42.jpeg",
    "https://adventusimobiliaria.com.br/img/imovei/filename/53/WhatsApp%20Image%202022-11-18%20at%2013.09.45%20(2).jpeg",
    "https://adventusimobiliaria.com.br/img/imovei/filename/127/fcc8e0e6-8837-4ed3-b287-5e6334926e32.jpg",
    "https://adventusimobiliaria.com.br/img/imovei/filename/266/1%20(4).jpeg",
  ];

  // Controlar scroll do body quando modal aberto
  useEffect(() => {
    if (modalAberto) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, [modalAberto]);

  // Fechar modal ao clicar fora - VERSÃO CORRIGIDA 100%
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar se o clique foi no overlay (área escura)
      if (overlayRef.current === event.target) {
        fecharModal();
      }
    };

    if (modalAberto) {
      // Adicionar eventos
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      // Garantir que o overlay esteja pronto para receber cliques
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.style.pointerEvents = "auto";
        }
      }, 10);
    }

    return () => {
      // Remover eventos
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);

      if (overlayRef.current) {
        overlayRef.current.style.pointerEvents = "none";
      }
    };
  }, [modalAberto]);

  // Auto-play do carrossel
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagemAtual, imagens.length]);

  const mudarImagem = (direcao) => {
    setImagemAtual(
      (prev) => (prev + direcao + imagens.length) % imagens.length,
    );
  };

  // ===== FUNÇÕES DE ARRASTE PARA O CARROSSEL =====
  const handleTouchStart = (e) => {
    setEstaArrastando(true);
    setInicioX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!estaArrastando) return;

    const xAtual = e.touches[0].clientX;
    const diff = inicioX - xAtual;

    if (Math.abs(diff) > 30) {
      e.currentTarget.style.transform = `translateX(${diff > 0 ? "-" : ""}5px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!estaArrastando) return;

    const xFinal = e.changedTouches[0].clientX;
    const diff = inicioX - xFinal;

    e.currentTarget.style.transform = "translateX(0)";
    setEstaArrastando(false);

    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        mudarImagem(1);
      } else {
        mudarImagem(-1);
      }
    }
  };

  const handleMouseDown = (e) => {
    if (window.innerWidth <= 768) {
      setEstaArrastando(true);
      setInicioX(e.clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!estaArrastando || window.innerWidth > 768) return;

    const xAtual = e.clientX;
    const diff = inicioX - xAtual;

    if (Math.abs(diff) > 30) {
      e.currentTarget.style.transform = `translateX(${diff > 0 ? "-" : ""}5px)`;
    }
  };

  const handleMouseUp = (e) => {
    if (!estaArrastando || window.innerWidth > 768) return;

    const xFinal = e.clientX;
    const diff = inicioX - xFinal;

    e.currentTarget.style.transform = "translateX(0)";
    setEstaArrastando(false);

    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        mudarImagem(1);
      } else {
        mudarImagem(-1);
      }
    }
  };

  const handleMouseLeave = () => {
    setEstaArrastando(false);
  };

  // ===== LÓGICA DO MODAL DE CAPTURA =====
  const abrirModal = () => {
    setModalAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEnviado(false);
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      mensagem:
        "Tenho interesse na casa de 3 dormitórios. Aguardo informações.",
      horarioPreferencia: "",
      diaSemana: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const leadData = {
        ...formData,
        imovel_titulo: dadosImovel.titulo,
        imovel_localizacao: dadosImovel.localizacao,
        imovel_preco: dadosImovel.preco,
        data_envio: new Date().toISOString(),
        pagina_origem: window.location.href,
        visualizacoes_imovel: visualizacoesTotais,
        tipo_solicitacao: "solicitar_visita_imovel",
      };

      console.log("📤 Enviando lead para o banco de dados:", leadData);

      // Simulação de envio
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEnviado(true);
      setEnviando(false);

      setTimeout(() => {
        fecharModal();
      }, 3000);
    } catch (error) {
      console.error("❌ Erro ao enviar lead:", error);
      setEnviando(false);
      alert(
        "Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.",
      );
    }
  };

  // ===== LÓGICA DO ACORDEÃO =====
  const alternarAcordeao = (index) => {
    setAcordeaoAberto(acordeaoAberto === index ? null : index);
  };

  // ===== DADOS DOS ACORDEÕES =====
  const dadosAcordeao = [
    {
      titulo: "Características do Imóvel",
      icone: "fas fa-home",
      itens: [
        "3 Dormitórios (1 suíte)",
        "2 Banheiros sociais",
        "2 Vagas de garagem",
        "Sala de estar",
        "Sala de jantar",
        "Cozinha planejada",
        "Área de serviço",
        "Quintal amplo",
      ],
    },
    {
      titulo: "Infraestrutura",
      icone: "fas fa-tools",
      itens: [
        "Água encanada",
        "Esgoto tratado",
        "Energia 220V",
        "Rede de gás",
        "Internet fibra óptica",
        "TV a cabo",
        "Sistema de alarme",
        "Portão eletrônico",
      ],
    },
    {
      titulo: "Acabamentos",
      icone: "fas fa-paint-roller",
      itens: [
        "Piso porcelanato na sala",
        "Piso cerâmico nos quartos",
        "Portas de madeira maciça",
        "Janelas em alumínio",
        "Forro de gesso",
        "Iluminação em LED",
      ],
    },
    {
      titulo: "Área de Lazer",
      icone: "fas fa-swimming-pool",
      itens: [
        "Churrasqueira",
        "Área gourmet",
        "Jardim privativo",
        "Varanda frontal",
        "Quintal arborizado",
      ],
    },
    {
      titulo: "Localização & Vizinhança",
      icone: "fas fa-map-marker-alt",
      itens: [
        "Supermercado (200m)",
        "Escola (300m)",
        "Farmácia (150m)",
        "Igreja (350m)",
      ],
    },
    {
      titulo: "Segurança",
      icone: "fas fa-shield-alt",
      itens: ["Sistema de alarme", "Portão eletrônico", "Iluminação externa"],
    },
    {
      titulo: "Armários & Armazenamento",
      icone: "fas fa-archive",
      itens: [
        "Armário de cozinha",
        "Guarda-roupa casal",
        "Armário de banheiro",
      ],
    },
    {
      titulo: "Serviços & Utilidades",
      icone: "fas fa-concierge-bell",
      itens: ["Coleta seletiva", "Iluminação pública", "Segurança privada"],
    },
  ];

  return (
    <>
      {/* ===== GALERIA DE FOTOS ===== */}
      <section className="mb-0">
        <div className="relative w-full">
          <div
            ref={carrosselRef}
            className="relative h-[380px] md:h-[540px] lg:h-[560px] w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: window.innerWidth <= 768 ? "grab" : "default",
              transition: "transform 0.3s ease",
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
              style={{
                backgroundImage: `url('${imagens[imagemAtual]}')`,
              }}
            />

            {/* Indicadores de slide - COM COR #D4A24D */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtual(index)}
                  className={`
                    w-3 h-3 md:w-3.5 md:h-3.5 
                    rounded-full 
                    transition-all duration-300 
                    border-2 border-white/30
                    outline-none
                    focus:outline-none
                    focus:ring-2 focus:ring-[#D4A24D] focus:ring-offset-2
                    ${
                      imagemAtual === index
                        ? `bg-[#D4A24D] scale-110 shadow-[0_0_10px_rgba(212,162,77,0.8)] border-white`
                        : "bg-white/90 hover:bg-white hover:scale-105 hover:shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    }
                  `}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CABEÇALHO DO IMÓVEL ===== */}
      <section className="bg-[#31353E] text-white pt-8 pb-12 md:pt-10 md:pb-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* COLUNA 1 - INFORMAÇÕES DO IMÓVEL */}
            <div className="flex flex-col justify-center">
              {/* Badge Exclusivo - COM COR #D4A24D */}
              <div className="self-start mb-6">
                <div className="inline-flex items-center bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  <i className="fas fa-star mr-1.5 text-[10px]"></i>
                  <span className="text-[11px] tracking-tight">
                    EXCLUSIVIDADE ADVENTUS
                  </span>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                Casa 3 Dormitórios com Suíte - Centro
              </h1>

              {/* Localização - COM COR #D4A24D */}
              <div className="flex items-center space-x-2 text-white mb-5">
                <i className="fas fa-map-marker-alt text-[#D4A24D] text-sm"></i>
                <span className="text-sm md:text-base">
                  <strong>Centro, Açailândia - MA</strong> - Próximo ao Mercado
                  Municipal
                </span>
              </div>

              {/* Preço COM LINHA PONTILHADA SEPARADORA - ESPAÇAMENTO CORRIGIDO */}
              <div className="mb-6">
                <div className="text-3xl md:text-4xl font-black text-white">
                  R$ 280.000
                </div>

                {/* LINHA PONTILHADA SEPARADORA - COR AMARELA #D4A24D */}
                <div className="my-4">
                  <div className="w-full border-t border-dashed border-[#D4A24D]/40"></div>
                </div>
              </div>

              {/* ===== CARACTERÍSTICAS - COM COR #D4A24D ===== */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-white">
                {/* DORMITÓRIOS */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                    <i className="fas fa-door-closed text-[#D4A24D] text-lg"></i>
                  </div>
                  <div className="h-[44px] flex flex-col items-center justify-center">
                    <div className="text-base font-light leading-tight">
                      3 Dormitórios
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                      2 quartos + 1 suíte
                    </div>
                  </div>
                </div>

                {/* BANHEIROS */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                    <i className="fas fa-bath text-[#D4A24D] text-lg"></i>
                  </div>
                  <div className="h-[44px] flex flex-col items-center justify-center">
                    <div className="text-base font-light leading-tight">
                      2 Banheiros
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                      completos
                    </div>
                  </div>
                </div>

                {/* VAGAS */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                    <i className="fas fa-car text-[#D4A24D] text-lg"></i>
                  </div>
                  <div className="h-[44px] flex flex-col items-center justify-center">
                    <div className="text-base font-light leading-tight">
                      2 Vagas
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                      cobertas
                    </div>
                  </div>
                </div>

                {/* ÁREA TOTAL */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                    <i className="fas fa-expand-arrows-alt text-[#D4A24D] text-lg"></i>
                  </div>
                  <div className="h-[44px] flex flex-col items-center justify-center">
                    <div className="text-base font-light leading-tight">
                      200 m²
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                      área total
                    </div>
                  </div>
                </div>

                {/* ÁREA CONSTRUÍDA */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                    <i className="fas fa-ruler-combined text-[#D4A24D] text-lg"></i>
                  </div>
                  <div className="h-[44px] flex flex-col items-center justify-center">
                    <div className="text-base font-light leading-tight">
                      90 m²
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                      área construída
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA 2 - BOX DE VISUALIZAÇÕES COM EFEITOS ANIMADOS */}
            <div className="relative flex items-center justify-center">
              {/* LINHA DIVISÓRIA ELEGANTE */}
              <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              </div>

              {/* CONTAINER DE VISUALIZAÇÕES */}
              <div className="lg:pl-8 w-full">
                {/* BOX COM EFEITOS ANIMADOS - LUZ BRANCA DIAGONAL PREMIUM */}
                <div className="bg-gradient-to-br from-[#2a2e36]/60 via-[#2a2e36]/50 to-[#D4A24D]/5 backdrop-blur-sm rounded-xl p-6 border border-[#D4A24D]/10 shadow-lg shadow-[#D4A24D]/5 relative overflow-hidden">
                  {/* EFEITO DE LUZ BRANCA DIAGONAL PREMIUM - 1 SEGUNDO, APENAS UMA VEZ */}
                  <div className="light-sweep-premium"></div>

                  {/* BRILHO SUAVE NO TOPO */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <div className="text-center relative z-10">
                    {/* ÍCONE DE ATENÇÃO COM EFEITO DE ONDINHA (PULSAÇÃO SUAVE) */}
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4A24D]/15 to-[#E6B85C]/10 flex items-center justify-center border border-[#D4A24D]/15 shadow-inner shadow-[#D4A24D]/10 pulse-wave">
                        <i className="fas fa-exclamation-circle text-[#D4A24D]/90 text-2xl"></i>
                      </div>
                    </div>

                    {/* NÚMERO DE VISUALIZAÇÕES COM TEXTO EM DESTAQUE */}
                    <div className="mb-3">
                      <div className="text-5xl md:text-6xl font-black text-white leading-tight">
                        {visualizacoesTotais.toLocaleString("pt-BR")}
                      </div>
                      {/* TEXTO "VISUALIZAÇÕES TOTAIS" EM SEMI-NEGRITO/DESTAQUE - FONTE MENOR */}
                      <div className="text-xs font-semibold text-[#E6B85C] mt-2 tracking-wider">
                        VISUALIZAÇÕES TOTAIS
                      </div>
                    </div>

                    {/* MENSAGEM DISCRETA EM BRANCO */}
                    <p className="text-xs text-white/70 mt-4 max-w-xs mx-auto font-light">
                      Este imóvel tem atraído muita atenção desde sua
                      publicação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ESPAÇAMENTO PADRONIZADO 1: CABEÇALHO → ACORDEÕES ===== */}
      <div className="py-6 md:py-8"></div>

      {/* ===== ACORDEÕES COM AZUL ADVENTUS E COR #D4A24D ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {dadosAcordeao.map((acordeao, index) => (
            <div
              key={index}
              className={`border-b border-gray-300 last:border-b-0 transition-colors duration-300 ${
                acordeaoAberto === index ? "bg-[#31353E]/5" : ""
              }`}
            >
              <button
                onClick={() => alternarAcordeao(index)}
                className={`w-full px-6 py-5 text-left flex justify-between items-center transition-all duration-300 ${
                  acordeaoAberto === index
                    ? "bg-[#31353E]/10 hover:bg-[#31353E]/20 border-l-4 border-[#31353E]"
                    : "bg-white hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i
                    className={`${acordeao.icone} ${
                      acordeaoAberto === index
                        ? "text-[#31353E]"
                        : "text-[#D4A24D]"
                    }`}
                  ></i>
                  <span
                    className={`font-semibold ${
                      acordeaoAberto === index
                        ? "text-[#31353E]"
                        : "text-gray-800"
                    }`}
                  >
                    {acordeao.titulo}
                  </span>
                </div>
                <i
                  className={`fas fa-chevron-down transition-transform duration-300 ${
                    acordeaoAberto === index
                      ? "rotate-180 text-[#31353E]"
                      : "text-[#D4A24D]"
                  }`}
                ></i>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  acordeaoAberto === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white px-6 pb-5 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {acordeao.itens.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-2 py-2"
                      >
                        <span className="text-green-600 font-bold text-sm">
                          ✓
                        </span>
                        <span className="text-gray-700 font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ESPAÇAMENTO PADRONIZADO 2: ACORDEÕES → CTA ===== */}
      <div className="py-6 md:py-8"></div>

      {/* ===== CTA SECTION - VERSÃO COM ESPAÇAMENTOS PADRONIZADOS ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#31353E] text-white rounded-xl shadow-xl relative overflow-hidden">
          {/* EFEITO DE LUZ NO FUNDO */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4A24D]/5 to-transparent"></div>

          <div className="relative z-10">
            {/* CONTEÚDO PRINCIPAL DO CTA */}
            <div className="p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                {/* COLUNA ESQUERDA - DÚVIDA RÁPIDA / WHATSAPP */}
                <div className="pb-10 lg:pb-0 lg:pr-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-600">
                  <div className="flex flex-col items-center text-center">
                    {/* TÍTULO */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#D4A24D]">
                      Dúvida rápida?
                    </h2>

                    {/* MICROCOPY - UMA LINHA SÓ */}
                    <p className="text-gray-300 mb-6 text-sm md:text-base font-light leading-relaxed max-w-md">
                      Resolva suas dúvidas em poucos minutos!
                    </p>

                    {/* BOTÃO WHATSAPP - TEXTO MAIOR, BOTÃO MENOR */}
                    <div className="relative mb-8">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-premium inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap"
                      >
                        {/* EFEITO DE LUZ DIAGONAL */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                        <i className="fab fa-whatsapp text-base"></i>
                        <span>Falar agora no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* LINHA DIVISÓRIA VERTICAL PREMIUM - ÚNICA, ELEGANTE E COM ALTURA MENOR */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2/3">
                  <div className="h-full w-[0.5px] bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                </div>

                {/* COLUNA DIREITA - ATENDIMENTO PERSONALIZADO */}
                <div className="pt-10 lg:pt-0 lg:pl-8 flex flex-col justify-center">
                  <div className="flex flex-col items-center text-center">
                    {/* TÍTULO EM BRANCO - PARA NÃO COMPETIR COM BOTÃO */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                      Atendimento personalizado
                    </h2>

                    {/* DESCRIÇÃO - UMA LINHA SÓ */}
                    <p className="text-gray-300 mb-6 text-sm md:text-base font-light leading-relaxed max-w-md">
                      Conheça todos os detalhes do imóvel pessoalmente
                    </p>

                    {/* BOTÃO SOLICITAR VISITA - TEXTO MAIOR, BOTÃO MENOR */}
                    <div className="relative">
                      <button
                        onClick={abrirModal}
                        className="btn-visita-premium inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white text-sm md:text-base font-semibold rounded-lg hover:from-[#C4933E] hover:to-[#D4A24D] hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap"
                      >
                        {/* EFEITO DE LUZ DIAGONAL */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                        <i className="fas fa-calendar-alt text-base"></i>
                        <span>Solicitar visita ao imóvel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LINHA DIVISÓRIA AMARELA ENTRE AS SEÇÕES */}
            <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent"></div>

            {/* RODAPÉ DELICADO - CONTAINER BRANCO BAIXO COM ÍCONE DE RELÓGIO PERFEITAMENTE ALINHADO */}
            <div className="bg-white p-4 md:p-5 rounded-b-xl">
              <div className="text-center">
                {/* TEXTO AZUL COM ÍCONE DE RELÓGIO PERFEITAMENTE ALINHADO - CORREÇÃO FINAL */}
                <p className="text-[#31353E] text-sm font-light flex items-center justify-center">
                  <i
                    className="far fa-clock text-[#D4A24D] mr-2 text-sm relative"
                    style={{ top: "-1px" }}
                  ></i>
                  <span className="relative" style={{ top: "0px" }}>
                    Atendimento de segunda a sexta, das 8h às 18h
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ESPAÇAMENTO PADRONIZADO 3: CTA → FOOTER ===== */}
      <div className="py-6 md:py-8"></div>

      {/* ===== MODAL DE CAPTURA DE LEADS - VERSÃO FINAL COM ÍCONES E BOTÃO REDIMENSIONADO ===== */}
      {modalAberto && (
        <>
          {/* OVERLAY ESCURO - AGORA FECHA AO CLICAR COM 100% DE GARANTIA */}
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300"
            onClick={fecharModal}
            style={{ cursor: "pointer" }}
          ></div>

          {/* MODAL EM SI - CORRIGIDO PARA MOBILE E DESKTOP */}
          <div
            ref={modalRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            <div className="w-full max-w-md mx-auto pointer-events-auto">
              {/* CONTEÚDO DO MODAL */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* CABEÇALHO DO MODAL - TÍTULO SEMPRE VISÍVEL */}
                <div className="bg-[#31353E] text-white p-5 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    {/* TÍTULO SIMPLIFICADO - UMA LINHA SÓ, SEMPRE VISÍVEL */}
                    <div className="flex-1 pr-3 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        Preencha seus dados e preferências
                      </h3>
                    </div>
                    <button
                      onClick={fecharModal}
                      className="bg-[#D4A24D] hover:bg-[#C4933E] text-white text-lg md:text-xl transition-colors rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md flex-shrink-0 ml-2"
                      aria-label="Fechar"
                    >
                      <span className="font-bold">×</span>
                    </button>
                  </div>
                </div>

                {/* CORPO DO MODAL - SCROLL NO MOBILE */}
                <div className="p-5 md:p-6 max-h-[70vh] md:max-h-none overflow-y-auto">
                  {enviado ? (
                    <div className="text-center py-6 md:py-8">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-green-600 text-2xl md:text-3xl"></i>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                        Solicitação Enviada!
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Em breve nosso corretor entrará em contato para combinar
                        o melhor horário.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-4">
                        Esta janela será fechada automaticamente...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        {/* NOME COM ÍCONE DE PESSOA */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-user text-gray-400"></i>
                          </div>
                          <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base"
                            placeholder="Digite seu nome completo *"
                          />
                        </div>

                        {/* TELEFONE COM ÍCONE DE TELEFONE */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-phone text-gray-400"></i>
                          </div>
                          <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base"
                            placeholder="WhatsApp com DDD*"
                          />
                        </div>

                        {/* EMAIL COM ÍCONE DE ENVELOPE */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-envelope text-gray-400"></i>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base"
                            placeholder="Seu melhor Email*"
                          />
                        </div>

                        {/* DIA DA SEMANA */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-calendar-day text-gray-400"></i>
                          </div>
                          <select
                            name="diaSemana"
                            value={formData.diaSemana}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base appearance-none"
                          >
                            <option value="">
                              Selecione o melhor dia para visita *
                            </option>
                            <option value="segunda">Segunda-feira</option>
                            <option value="terca">Terça-feira</option>
                            <option value="quarta">Quarta-feira</option>
                            <option value="quinta">Quinta-feira</option>
                            <option value="sexta">Sexta-feira</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-400"></i>
                          </div>
                        </div>

                        {/* HORÁRIO */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-clock text-gray-400"></i>
                          </div>
                          <select
                            name="horarioPreferencia"
                            value={formData.horarioPreferencia}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base appearance-none"
                          >
                            <option value="">
                              Selecione o melhor horário *
                            </option>
                            <option value="manha">Manhã (8h às 12h)</option>
                            <option value="tarde">Tarde (14h às 18h)</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-400"></i>
                          </div>
                        </div>

                        {/* MENSAGEM */}
                        <div className="relative">
                          <div className="absolute top-3 left-3">
                            <i className="fas fa-comment text-gray-400"></i>
                          </div>
                          <textarea
                            name="mensagem"
                            value={formData.mensagem}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base"
                            placeholder="Mensagem adicional (opcional)"
                          />
                        </div>

                        {/* BOTÃO ENVIAR - DIMINUÍDO EM ALTURA E LARGURA */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={enviando}
                            className={`w-full py-2.5 rounded-lg font-medium text-base transition-all duration-300 flex items-center justify-center space-x-2 ${
                              enviando
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#D4A24D] hover:bg-[#C4933E] text-white hover:shadow-md shadow-sm"
                            }`}
                            style={{ maxWidth: "280px", margin: "0 auto" }}
                          >
                            {enviando ? (
                              <>
                                <i className="fas fa-spinner fa-spin text-sm"></i>
                                <span>Enviando...</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-calendar-check text-sm"></i>
                                <span>Solicitar Visita Agendada</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== ESTILOS GLOBAIS E ANIMAÇÕES ===== */}
      <style jsx="true" global="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        /* FONTE DA ADVENTUS */
        body {
          font-family: "Montserrat", sans-serif;
          margin: 0;
          padding: 0;
          background: #f8f9fa;
          color: #333;
          scroll-behavior: smooth;
        }

        /* CLASSE PARA FONTE LIGHT */
        .font-light {
          font-weight: 300 !important;
        }

        /* REMOVER BORDA E OUTLINE DE TODOS OS BOTÕES */
        button {
          border: none !important;
          outline: none !important;
        }

        button:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* Garantir que textos brancos sejam 100% sólidos */
        .text-white {
          color: #ffffff !important;
        }

        /* Suavizar transições */
        * {
          transition:
            background-color 0.3s ease,
            transform 0.3s ease,
            opacity 0.3s ease;
        }

        /* Melhorar experiência de arraste no mobile */
        @media (max-width: 768px) {
          .carrossel-container {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            touch-action: pan-y;
          }
        }

        /* Estilos para inputs com foco */
        input:focus,
        textarea:focus,
        select:focus {
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(212, 162, 77, 0.1) !important;
        }

        /* PREVENIR SCROLL NO BODY QUANDO MODAL ABERTO */
        body.modal-open {
          overflow: hidden !important;
          position: fixed;
          width: 100%;
        }

        /* ESTILO ESPECÍFICO PARA O OVERLAY DO MODAL */
        .modal-overlay {
          cursor: pointer !important;
        }

        /* ===== ANIMAÇÕES PARA O BOX DE VISUALIZAÇÕES ===== */

        /* 1. EFEITO DE LUZ BRANCA DIAGONAL PREMIUM */
        .light-sweep-premium {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 25%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 100%
          );
          opacity: 0;
          animation: lightSweepPremium 8s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes lightSweepPremium {
          0%,
          90%,
          100% {
            opacity: 0;
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          5% {
            opacity: 0.2;
          }
          10% {
            opacity: 0.6;
            transform: translateX(0%) translateY(0%) rotate(45deg);
          }
          15% {
            opacity: 0.2;
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          20%,
          89% {
            opacity: 0;
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        /* 2. EFEITO DE ONDINHA NO ÍCONE (PULSAÇÃO SUAVE) */
        .pulse-wave {
          animation: wavePulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .pulse-wave::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid rgba(212, 162, 77, 0.3);
          animation: waveExpand 3s ease-out infinite;
          z-index: -1;
        }

        @keyframes wavePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              inset 0 0 8px rgba(212, 162, 77, 0.1),
              0 0 8px rgba(212, 162, 77, 0.1);
          }
          50% {
            transform: scale(1.03);
            box-shadow:
              inset 0 0 12px rgba(212, 162, 77, 0.2),
              0 0 15px rgba(212, 162, 77, 0.2);
          }
        }

        @keyframes waveExpand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* ===== EFEITOS PREMIUM PARA OS BOTÕES DO CTA ===== */

        /* EFEITO DE LUZ DIAGONAL NOS BOTÕES */
        .btn-whatsapp-premium:hover,
        .btn-visita-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
        }

        /* EFEITO DE GLOW SUAVE NOS BOTÕES */
        .btn-whatsapp-premium {
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3) !important;
        }

        .btn-visita-premium {
          box-shadow: 0 4px 15px rgba(212, 162, 77, 0.3) !important;
        }

        /* ANIMAÇÃO DE LUZ PARA O BOTÃO DO WHATSAPP */
        .btn-whatsapp-premium::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: 0.5s;
        }

        .btn-whatsapp-premium:hover::before {
          left: 100%;
        }

        /* ANIMAÇÃO DE LUZ PARA O BOTÃO DE VISITA */
        .btn-visita-premium::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: 0.5s;
        }

        .btn-visita-premium:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  );
};

export default DetalheImovel;
