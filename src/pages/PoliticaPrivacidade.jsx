import React, { useEffect, useState } from "react";
import Cabecalho from "../componentes/Cabecalho/Cabecalho.jsx";
import Rodape from "../componentes/Rodape/Rodape.jsx";
import {
  Building2,
  Database,
  Target,
  Shield,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Check,
  ArrowRight,
  Calendar,
  Home,
  Users,
  Cookie,
  MessageSquare,
  Gavel,
} from "lucide-react";

const PoliticaPrivacidade = () => {
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Cor padrão da Adventus
  const adventusYellow = "#D4A24D";

  // Data atual
  const dataAtual = "14 de março de 2026";

  return (
    <>
      <Cabecalho />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#D4A24D]/40 py-20 md:py-24 px-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Arquitetura contemporânea de luxo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/85 to-[#D4A24D]/30"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-wide">
            Política de Privacidade
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Na Adventus Imobiliária, sua privacidade é prioridade. Saiba como
            protegemos e utilizamos suas informações com total transparência.
          </p>

          {/* BOX DE ATUALIZAÇÃO */}
          <div className="flex justify-center mt-16">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <div className="w-10 h-10 bg-[#D4A24D]/20 rounded-xl flex items-center justify-center">
                <Calendar
                  className="w-5 h-5"
                  style={{ color: adventusYellow }}
                />
              </div>
              <div className="text-left">
                <span
                  className="text-sm font-medium block"
                  style={{ color: adventusYellow }}
                >
                  Última atualização
                </span>
                <span className="text-white font-semibold text-base md:text-lg">
                  {dataAtual}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* GRID DE CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Card 1 - Quem Somos */}
            <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#D4A24D] to-[#D4A24D]/80"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2
                    className="w-8 h-8"
                    style={{ color: adventusYellow }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Quem Somos
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: adventusYellow }}
                    ></span>
                    Adventus Imobiliária
                  </p>
                  <p className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: adventusYellow }}
                    ></span>
                    CRECI MA 3716
                  </p>
                  <p className="flex items-start gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2"
                      style={{ backgroundColor: adventusYellow }}
                    ></span>
                    Rua Fortaleza 1382-B, Centro, Açailândia - MA
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Dados que Coletamos */}
            <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#D4A24D] to-[#D4A24D]/80"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database
                    className="w-8 h-8"
                    style={{ color: adventusYellow }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Dados Coletados
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Apenas o necessário para atendê-lo
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check
                      className="w-5 h-5"
                      style={{ color: adventusYellow }}
                    />
                    <span>Nome completo</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check
                      className="w-5 h-5"
                      style={{ color: adventusYellow }}
                    />
                    <span>E-mail</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <Check
                      className="w-5 h-5"
                      style={{ color: adventusYellow }}
                    />
                    <span>WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3 - Como Usamos */}
            <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#D4A24D] to-[#D4A24D]/80"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target
                    className="w-8 h-8"
                    style={{ color: adventusYellow }}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Como Usamos
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: adventusYellow }}
                    />
                    <span>Apresentar imóveis</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: adventusYellow }}
                    />
                    <span>Enviar propostas</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: adventusYellow }}
                    />
                    <span>Agendar visitas</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: adventusYellow }}
                    />
                    <span>Comunicações</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* SEÇÃO DE COMPROMISSO - VERSÃO SIMPLIFICADA */}
          <div className="relative bg-gradient-to-br from-[#D4A24D] to-[#D4A24D]/70 rounded-3xl overflow-hidden mb-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5"></div>
            <div className="relative z-10 p-10 md:p-14">
              <div className="grid md:grid-cols-3 gap-10 items-center">
                {/* COLUNA DO TEXTO - OCUPA 2/3 */}
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Seus dados estão{" "}
                    <span className="text-white/90">seguros</span> conosco
                  </h2>

                  <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                    Nunca vendemos seus dados para terceiros. Suas informações
                    são utilizadas exclusivamente para oferecer o melhor
                    atendimento imobiliário, seguindo rigorosamente a Lei Geral
                    de Proteção de Dados (LGPD).
                  </p>
                </div>

                {/* COLUNA DO CADEADO - OCUPA 1/3 */}
                <div className="flex justify-center md:justify-end">
                  <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                    <Lock className="w-20 h-20 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÕES DETALHADAS EM ACCORDION */}
          <div className="space-y-4">
            {/* Introdução */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <details
                className="group"
                open={openSection === "intro"}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSection("intro");
                  } else {
                    setOpenSection(null);
                  }
                }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Home
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Introdução
                    </h3>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 group-open:rotate-180 transition-transform"
                    style={{ color: adventusYellow }}
                  />
                </summary>
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600 leading-relaxed">
                    A Adventus Imobiliária valoriza a privacidade e a segurança
                    dos dados dos nossos clientes, corretores parceiros e
                    visitantes. Esta Política de Privacidade explica como
                    coletamos, usamos, compartilhamos e protegemos suas
                    informações pessoais no contexto dos serviços imobiliários
                    que prestamos.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Ao utilizar nossos serviços, sites, aplicativos ou interagir
                    conosco de qualquer forma, você concorda com os termos desta
                    Política de Privacidade.
                  </p>
                </div>
              </details>
            </div>

            {/* Segurança */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <details
                className="group"
                open={openSection === "seguranca"}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSection("seguranca");
                  } else {
                    setOpenSection(null);
                  }
                }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Shield
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Segurança das Informações
                    </h3>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 group-open:rotate-180 transition-transform"
                    style={{ color: adventusYellow }}
                  />
                </summary>
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600 mb-4">
                    Implementamos medidas técnicas e organizacionais:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">Criptografia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">Controle de acesso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">
                        Monitoramento contínuo
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">Backups regulares</span>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Seus Direitos */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <details
                className="group"
                open={openSection === "direitos"}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSection("direitos");
                  } else {
                    setOpenSection(null);
                  }
                }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Users
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Seus Direitos (LGPD)
                    </h3>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 group-open:rotate-180 transition-transform"
                    style={{ color: adventusYellow }}
                  />
                </summary>
                <div className="px-6 pb-6 pl-20">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">
                        Confirmar existência de tratamento
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">Acessar seus dados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">
                        Corrigir dados incompletos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">
                        Eliminar dados desnecessários
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">
                        Revogar consentimento
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check
                        className="w-4 h-4"
                        style={{ color: adventusYellow }}
                      />
                      <span className="text-gray-600">Portabilidade</span>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Cookies */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <details
                className="group"
                open={openSection === "cookies"}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSection("cookies");
                  } else {
                    setOpenSection(null);
                  }
                }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Cookie
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Cookies
                    </h3>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 group-open:rotate-180 transition-transform"
                    style={{ color: adventusYellow }}
                  />
                </summary>
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600">
                    Utilizamos cookies para melhorar sua experiência. Você pode
                    controlar nas configurações do seu navegador.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* SEÇÃO DE CONTATO */}
          <div className="mt-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 p-10 shadow-xl">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare
                    className="w-6 h-6"
                    style={{ color: adventusYellow }}
                  />
                  Encarregado de Proteção de Dados (DPO)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Mail
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="text-gray-900 font-medium">
                        adventusimobiliaria@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Phone
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-gray-900 font-medium">
                        (99) 98808-7867
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p className="text-gray-900 font-medium">
                        Rua Fortaleza 1382-B, Centro, Açailândia - MA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock
                        className="w-5 h-5"
                        style={{ color: adventusYellow }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Horário</p>
                      <p className="text-gray-900 font-medium">
                        Segunda a Sexta, 8h às 18h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUNA DO ESCUDO - DESLOCADA 20px PARA DIREITA */}
              <div className="flex flex-col items-center justify-center md:items-end md:pr-20">
                <div className="w-48 h-48 bg-gradient-to-br from-[#D4A24D] to-[#D4A24D]/80 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                  <Shield className="w-24 h-24 text-white" />
                </div>
                <p className="text-center text-gray-600 max-w-xs md:text-right">
                  Seus dados tratados com responsabilidade e transparência
                </p>
              </div>
            </div>
          </div>

          {/* LEGISLAÇÃO */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full">
              <Gavel className="w-4 h-4" style={{ color: adventusYellow }} />
              <span>
                Regido pela Lei nº 13.709/2018 (LGPD) - Foro: Açailândia/MA
              </span>
            </div>
          </div>
        </div>
      </section>

      <Rodape />
    </>
  );
};

export default PoliticaPrivacidade;
