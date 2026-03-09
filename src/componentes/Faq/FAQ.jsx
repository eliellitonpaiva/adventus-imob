import React, { useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Como funciona o financiamento imobiliário?",
      answer: (
        <div className="space-y-3">
          <p
            className="font-medium"
            style={{ color: "#D4A24D", fontSize: "clamp(0.875rem, 4vw, 1rem)" }}
          >
            O processo de financiamento envolve:
          </p>
          <ul
            className="list-disc pl-5 space-y-2"
            style={{
              color: "#4B5563",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Entrada:
              </span>{" "}
              Geralmente de 20% a 30% do valor do imóvel, podendo variar
              conforme o banco e programa habitacional.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Uso do FGTS:
              </span>{" "}
              Pode ser utilizado para entrada, amortização ou quitação, desde
              que atenda aos critérios do programa.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Aprovação bancária:
              </span>{" "}
              Análise de crédito, comprovação de renda e avaliação do imóvel
              pelo banco.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
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
            <p
              className="font-medium"
              style={{
                color: "#D4A24D",
                marginBottom: "0.5rem",
                fontSize: "clamp(0.875rem, 4vw, 1rem)",
              }}
            >
              Pessoa física (comprador):
            </p>
            <ul
              className="list-disc pl-5 space-y-1"
              style={{
                color: "#4B5563",
                fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
              }}
            >
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
            <p
              className="font-medium"
              style={{
                color: "#D4A24D",
                marginBottom: "0.5rem",
                fontSize: "clamp(0.875rem, 4vw, 1rem)",
              }}
            >
              Proprietário (vendedor):
            </p>
            <ul
              className="list-disc pl-5 space-y-1"
              style={{
                color: "#4B5563",
                fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
              }}
            >
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
          <p
            style={{ color: "#374151", fontSize: "clamp(0.875rem, 4vw, 1rem)" }}
          >
            Nossa avaliação é{" "}
            <span style={{ color: "#D4A24D", fontWeight: 600 }}>
              estratégica e baseada em dados
            </span>
            , considerando:
          </p>
          <ul
            className="list-disc pl-5 space-y-2"
            style={{
              color: "#4B5563",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Análise comparativa de mercado:
              </span>{" "}
              Estudo detalhado de imóveis similares na região.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Localização e liquidez:
              </span>{" "}
              Acesso, infraestrutura, comércio e velocidade de venda na área.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Tendência regional:
              </span>{" "}
              Valorização futura, novos empreendimentos e expansão urbana.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Potencial de valorização:
              </span>{" "}
              Características únicas que podem agregar valor ao imóvel.
            </li>
          </ul>
          <p
            className="text-sm mt-2 italic"
            style={{
              color: "#6B7280",
              fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
            }}
          >
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
          <p
            style={{ color: "#374151", fontSize: "clamp(0.875rem, 4vw, 1rem)" }}
          >
            É uma resposta{" "}
            <span style={{ color: "#D4A24D", fontWeight: 600 }}>
              inteligente:
            </span>{" "}
            depende de três fatores principais:
          </p>
          <ul
            className="list-disc pl-5 space-y-2"
            style={{
              color: "#4B5563",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Precificação correta:
              </span>{" "}
              Um imóvel superfaturado pode levar anos; o preço justo acelera a
              venda.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Estratégia de divulgação:
              </span>{" "}
              Marketing direcionado, fotos profissionais e visibilidade nas
              plataformas certas.
            </li>
            <li>
              <span style={{ color: "#31363E", fontWeight: 500 }}>
                Condições de mercado:
              </span>{" "}
              Demanda, época do ano e cenário econômico influenciam diretamente.
            </li>
          </ul>
          <p
            style={{
              color: "#31363E",
              fontWeight: 500,
              marginTop: "0.5rem",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
            Em média, com nossa estratégia, imóveis são vendidos entre{" "}
            <span style={{ color: "#D4A24D" }}>3 a 6 meses</span>.
          </p>
        </div>
      ),
    },
    {
      question: "A imobiliária auxilia em toda a parte documental?",
      answer: (
        <div className="space-y-2">
          <p
            style={{ color: "#374151", fontSize: "clamp(0.875rem, 4vw, 1rem)" }}
          >
            <span style={{ color: "#D4A24D", fontWeight: 600 }}>Sim.</span>{" "}
            Acompanhamos todo o processo até a assinatura:
          </p>
          <ul
            className="list-disc pl-5 space-y-1"
            style={{
              color: "#4B5563",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
            <li>Verificação e validação de toda a documentação</li>
            <li>Análise de matrícula e certidões do imóvel</li>
            <li>Suporte na coleta de documentos do comprador</li>
            <li>Acompanhamento na assinatura do contrato</li>
            <li>Orientação para registro em cartório</li>
          </ul>
          <p
            className="text-sm mt-2"
            style={{
              color: "#6B7280",
              fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
            }}
          >
            Segurança e tranquilidade em cada etapa.
          </p>
        </div>
      ),
    },
    {
      question: "É possível anunciar apenas para locação?",
      answer: (
        <div className="space-y-2">
          <p
            style={{ color: "#374151", fontSize: "clamp(0.875rem, 4vw, 1rem)" }}
          >
            <span style={{ color: "#D4A24D", fontWeight: 600 }}>Sim.</span> Você
            pode anunciar exclusivamente para locação. Como funciona:
          </p>
          <ul
            className="list-disc pl-5 space-y-1"
            style={{
              color: "#4B5563",
              fontSize: "clamp(0.813rem, 3.5vw, 0.938rem)",
            }}
          >
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
    <section style={{ backgroundColor: "#F9FAFB", padding: "4.5rem 0 5rem 0" }}>
      <div className="container mx-auto px-6">
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Cabeçalho com ícone e título responsivo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            {/* Ícone */}
            <div style={{ marginBottom: "1rem" }}>
              <ChatBubbleOvalLeftEllipsisIcon
                style={{
                  width: "clamp(3rem, 8vw, 4.5rem)",
                  height: "clamp(3rem, 8vw, 4.5rem)",
                  color: "#D4A24D",
                  margin: "0 auto",
                }}
              />
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
              {/* Versão Desktop: inline com espaço normal */}
              <span style={{ display: "inline" }}>DÚVIDAS</span>
              <span style={{ display: "inline", marginLeft: "0.5rem" }}>
                FREQUENTES
              </span>

              {/* Versão Mobile: block com quebra (sobrescreve via media query) */}
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

          {/* Lista de FAQs - COM ALTURA PADRONIZADA */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
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
                  onClick={() => toggleFAQ(index)}
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
                    minHeight:
                      "clamp(4rem, 12vw, 5.5rem)" /* ALTURA MÍNIMA PADRONIZADA */,
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
                        openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
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
  );
};

export default Faq;
