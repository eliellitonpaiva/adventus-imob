// pages/SobreNos.jsx
import React, { useState } from "react";

const SobreNos = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Cor amarela da Adventus (mesma do "Chama no ZAP!")
  const amareloAdventus = "#D4A24D";

  // Array FAQ definido AQUI dentro do componente
  const faqItems = [
    {
      question: "Como funciona o financiamento imobiliário?",
      answer: (
        <div className="space-y-3">
          <p className="font-medium" style={{ color: amareloAdventus }}>
            O processo de financiamento envolve:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <span className="font-medium text-[#31363E]">Entrada:</span>{" "}
              Geralmente de 20% a 30% do valor do imóvel, podendo variar
              conforme o banco e programa habitacional.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">Uso do FGTS:</span>{" "}
              Pode ser utilizado para entrada, amortização ou quitação, desde
              que atenda aos critérios do programa.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Aprovação bancária:
              </span>{" "}
              Análise de crédito, comprovação de renda e avaliação do imóvel
              pelo banco.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Apoio da imobiliária:
              </span>{" "}
              Acompanhamos todo o processo, desde a simulação até a assinatura,
              garantindo segurança e as melhores condições.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "Quais documentos são necessários para comprar um imóvel?",
      answer: (
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2" style={{ color: amareloAdventus }}>
              Pessoa física (comprador):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>RG e CPF</li>
              <li>
                Comprovante de renda (contracheques, declaração de IR, extratos)
              </li>
              <li>
                Comprovante de estado civil (certidão de nascimento/casamento)
              </li>
              <li>Comprovante de residência</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2" style={{ color: amareloAdventus }}>
              Proprietário (vendedor):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Matrícula atualizada do imóvel (até 30 dias)</li>
              <li>IPTU do último ano</li>
              <li>
                Certidões negativas (federal, estadual, municipal, trabalhista)
              </li>
              <li>Certidão de ônus reais</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      question: "Como é feita a avaliação de um imóvel?",
      answer: (
        <div className="space-y-3">
          <p className="text-gray-600">
            Nossa avaliação é{" "}
            <span className="font-semibold" style={{ color: amareloAdventus }}>
              estratégica e baseada em dados
            </span>
            , considerando:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <span className="font-medium text-[#31363E]">
                Análise comparativa de mercado:
              </span>{" "}
              Estudo detalhado de imóveis similares na região.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Localização e liquidez:
              </span>{" "}
              Acesso, infraestrutura, comércio e velocidade de venda na área.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Tendência regional:
              </span>{" "}
              Valorização futura, novos empreendimentos e expansão urbana.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Potencial de valorização:
              </span>{" "}
              Características únicas que podem agregar valor ao imóvel.
            </li>
          </ul>
          <p className="text-sm italic text-gray-500 mt-2">
            Com essa análise, definimos o preço justo e estratégico para
            maximizar seus resultados.
          </p>
        </div>
      ),
    },
    {
      question: "Quanto tempo leva para vender um imóvel?",
      answer: (
        <div className="space-y-3">
          <p className="text-gray-600">
            É uma resposta{" "}
            <span className="font-semibold" style={{ color: amareloAdventus }}>
              inteligente:
            </span>{" "}
            depende de três fatores principais:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <span className="font-medium text-[#31363E]">
                Precificação correta:
              </span>{" "}
              Um imóvel superfaturado pode levar anos; o preço justo acelera a
              venda.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Estratégia de divulgação:
              </span>{" "}
              Marketing direcionado, fotos profissionais e visibilidade nas
              plataformas certas.
            </li>
            <li>
              <span className="font-medium text-[#31363E]">
                Condições de mercado:
              </span>{" "}
              Demanda, época do ano e cenário econômico influenciam diretamente.
            </li>
          </ul>
          <p className="font-medium text-[#31363E] mt-2">
            Em média, com nossa estratégia, imóveis são vendidos entre{" "}
            <span style={{ color: amareloAdventus }}>3 a 6 meses</span>.
          </p>
        </div>
      ),
    },
    {
      question: "A imobiliária auxilia em toda a parte documental?",
      answer: (
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold" style={{ color: amareloAdventus }}>
              Sim.
            </span>{" "}
            Acompanhamos todo o processo até a assinatura:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Verificação e validação de toda a documentação</li>
            <li>Análise de matrícula e certidões do imóvel</li>
            <li>Suporte na coleta de documentos do comprador</li>
            <li>Acompanhamento na assinatura do contrato</li>
            <li>Orientação para registro em cartório</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Segurança e tranquilidade em cada etapa.
          </p>
        </div>
      ),
    },
    {
      question: "É possível anunciar apenas para locação?",
      answer: (
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold" style={{ color: amareloAdventus }}>
              Sim.
            </span>{" "}
            Você pode anunciar exclusivamente para locação. Como funciona:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Definimos o valor de locação com base em análise de mercado</li>
            <li>Divulgação nos principais portais imobiliários</li>
            <li>Seleção criteriosa de inquilinos</li>
            <li>Contratos completos e juridicamente seguros</li>
            <li>Acompanhamento durante toda a locação</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="antialiased">
      {/* CSS para animações - SEM O ATRIBUTO jsx */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Overlay gradiente mais suave */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>

        {/* Vídeo Background (simulado com imagem) */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
            alt="Luxury home"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 lg:px-16 text-white animate-[fadeUp_0.8s_ease-out_forwards] opacity-0">
          {/* Badge */}
          <div className="flex justify-start">
            <span className="inline-block px-5 py-2.5 border-2 border-white/40 text-white text-sm md:text-base font-medium rounded-full mb-6 md:mb-8 bg-black/20 backdrop-blur-md tracking-wider">
              ✦ Desde 2014 construindo histórias
            </span>
          </div>

          {/* Título - 80px no desktop, alinhado à esquerda */}
          <h1 className="text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px] font-extrabold uppercase leading-[1.1] tracking-tight max-w-6xl text-left">
            HÁ MAIS DE UMA DÉCADA
            <br />
            <span
              style={{ color: amareloAdventus }}
              className="font-extrabold inline-block mt-1 md:mt-2"
            >
              CONSTRUINDO HISTÓRIAS
            </span>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Título alinhado à esquerda */}
            <h2 className="text-4xl md:text-5xl font-light text-[#001F3F] mb-12">
              Nossa{" "}
              <span
                className="font-semibold"
                style={{ color: amareloAdventus }}
              >
                História
              </span>
            </h2>

            {/* Container com imagem e texto */}
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Imagem à esquerda */}
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://mrv.com.br/content/dam/conhecer/teaser/Group-30384.webp"
                    alt="Família feliz realizando o sonho da casa própria"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Texto à direita */}
              <div className="lg:w-1/2 space-y-6">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  A Adventus Imobiliária presta serviços no ramo imobiliário,
                  promovendo realizações dos sonhos da casa própria e do bem
                  estar de nossos clientes desde 2014.
                </p>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  Em nossa atuação buscamos oferecer nossos serviços de forma
                  clara, com compromisso e seriedade. Desenvolvendo um
                  atendimento personalizado com rapidez e prontidão, trabalhando
                  com uma equipe qualificada e preparada com as mais novas
                  tendências imobiliárias da atualidade e com forte instrução em
                  financiamento habitacional.
                </p>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  Mantemos parceria com construtores de diversas modalidades,
                  tendências de mercado atuais, e com agências bancárias locais
                  onde atuamos como correspondentes bancários com o intuito de
                  nos persuadir e acolher com maior eficiência a concretização
                  da conquista da casa própria de cada cliente que atendemos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              style={{ color: amareloAdventus }}
              className="font-medium tracking-wider text-sm uppercase"
            >
              Nossos Pilares
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#001F3F] mt-4 mb-6">
              O que nos move é
              <br />
              <span className="font-semibold">o que importa pra você</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Missão */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-[#D4A24D]/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  style={{ color: amareloAdventus }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#001F3F] mb-3">
                Missão
              </h3>
              <p className="text-gray-600">
                Realizar sonhos através de soluções imobiliárias inteligentes,
                oferecendo segurança, transparência e atendimento humanizado em
                cada negociação.
              </p>
            </div>

            {/* Card 2 - Visão */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-[#D4A24D]/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  style={{ color: amareloAdventus }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#001F3F] mb-3">
                Visão
              </h3>
              <p className="text-gray-600">
                Ser referência de excelência e inovação no mercado imobiliário,
                reconhecida pela qualidade do atendimento e pela realização dos
                sonhos dos nossos clientes.
              </p>
            </div>

            {/* Card 3 - Valores */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="w-16 h-16 bg-[#D4A24D]/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8"
                  style={{ color: amareloAdventus }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#001F3F] mb-3">
                Valores
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Transparência em cada etapa</li>
                <li>• Ética e honestidade</li>
                <li>• Compromisso com o cliente</li>
                <li>• Inovação constante</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cases de Sucesso */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              style={{ color: amareloAdventus }}
              className="font-medium tracking-wider text-sm uppercase"
            >
              Jornadas que já realizamos
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#001F3F] mt-4 mb-6">
              Histórias reais de
              <br />
              <span className="font-semibold">clientes realizados</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Case 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Apartamento Família Souza"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-8">
                <span
                  style={{ color: amareloAdventus }}
                  className="font-bold text-sm"
                >
                  ✦ FAMÍLIA SOUZA
                </span>
                <h3 className="text-2xl font-semibold text-[#001F3F] mt-2 mb-3">
                  Do sonho à chave na mão em 30 dias
                </h3>
                <p className="text-gray-600 mb-4">
                  "A imobiliária entendeu exatamente o que a minha família
                  precisava. Encontramos o apartamento perfeito perto da escola
                  das crianças."
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>🏠 3 dormitórios</span>
                  <span>📐 150m²</span>
                  <span>📍 Vila Nova Conceição</span>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80"
                  alt="Cobertura Casal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-8">
                <span
                  style={{ color: amareloAdventus }}
                  className="font-bold text-sm"
                >
                  ✦ CASAL MENDES
                </span>
                <h3 className="text-2xl font-semibold text-[#001F3F] mt-2 mb-3">
                  A cobertura dos sonhos com vista para o mar
                </h3>
                <p className="text-gray-600 mb-4">
                  "O consultor nos mostrou oportunidades que nem imaginávamos.
                  Hoje acordamos com essa vista todos os dias. Realização
                  total."
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>🏠 4 suítes</span>
                  <span>📐 280m²</span>
                  <span>📍 Jardim Paulista</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Interativo */}
      <section
        style={{ backgroundColor: "#F9FAFB", padding: "4.5rem 0 5rem 0" }}
      >
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
            {/* Cabeçalho com ícone e título responsivo */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              {/* Ícone */}
              <div style={{ marginBottom: "1rem" }}>
                <svg
                  style={{
                    width: "clamp(3rem, 8vw, 4.5rem)",
                    height: "clamp(3rem, 8vw, 4.5rem)",
                    color: "#D4A24D",
                    margin: "0 auto",
                  }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>

              {/* Título responsivo */}
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
                  fontWeight: 600,
                  color: "#D4A24D",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                <span style={{ display: "inline" }}>DÚVIDAS</span>
                <span style={{ display: "inline", marginLeft: "0.5rem" }}>
                  FREQUENTES
                </span>

                {/* CSS interno - SEM O ATRIBUTO jsx */}
                <style>{`
                  @media (max-width: 767px) {
                    h2 span {
                      display: block !important;
                      margin-left: 0 !important;
                    }
                    h2 span:first-child {
                      margin-bottom: 0.25rem;
                    }
                  }
                `}</style>
              </h2>
            </div>

            {/* Lista de FAQs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding:
                        "clamp(0.875rem, 3vw, 1.5rem) clamp(1rem, 4vw, 1.5rem)",
                      textAlign: "left",
                      backgroundColor: "#FFFFFF",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      outline: "none",
                      minHeight: "clamp(4rem, 12vw, 5.5rem)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                    }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(0.875rem, 3.5vw, 1.125rem)",
                        fontWeight: 600,
                        color: "#31363E",
                        lineHeight: 1.4,
                        paddingRight: "0.5rem",
                      }}
                    >
                      {item.question}
                    </span>
                    <svg
                      style={{
                        width: "clamp(0.875rem, 3.5vw, 1.25rem)",
                        height: "clamp(0.875rem, 3.5vw, 1.25rem)",
                        color: "#D4A24D",
                        transform:
                          openIndex === index
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        flexShrink: 0,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    style={{
                      maxHeight: openIndex === index ? "800px" : "0",
                      opacity: openIndex === index ? 1 : 0,
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div
                      style={{
                        padding:
                          "1.25rem clamp(1rem, 4vw, 1.5rem) 1.25rem clamp(1rem, 4vw, 1.5rem)",
                        borderTop:
                          openIndex === index ? "1px solid #F3F4F6" : "none",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: "2.5rem",
                backgroundColor: "#31363E",
                borderRadius: "1rem",
                padding: "clamp(1.5rem, 5vw, 2rem)",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: window.innerWidth < 768 ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "clamp(1.125rem, 5vw, 1.25rem)",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Ainda tem dúvidas?
                  </h4>
                  <p
                    style={{
                      color: "#D1D5DB",
                      fontSize: "clamp(0.875rem, 4vw, 1rem)",
                    }}
                  >
                    Fale diretamente com um de nossos consultores.
                  </p>
                </div>
                <a
                  href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus e tenho dúvidas sobre o processo."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#D4A24D",
                    color: "#31363E",
                    padding:
                      "clamp(0.625rem, 3vw, 0.75rem) clamp(1.5rem, 5vw, 2rem)",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                    fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#c0903d";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#D4A24D";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span>Falar com especialista</span>
                  <svg
                    style={{ width: "1rem", height: "1rem" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNos;
