import React, { useEffect } from "react";
import Cabecalho from "../componentes/Cabecalho/Cabecalho.jsx";
import Rodape from "../componentes/Rodape/Rodape.jsx";

const PoliticaPrivacidade = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Cabecalho />

      {/* CONTEÚDO DA POLÍTICA DE PRIVACIDADE */}
      <section className="bg-white py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da página - COM MAIS ESPAÇO NO TOPO E SEM SUBLINHADO */}
          <div className="text-center mb-12 md:mb-16 mt-10 md:mt-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-6">
              Proteção e transparência no tratamento dos seus dados pessoais
            </p>
          </div>

          {/* Conteúdo principal */}
          <div className="max-w-4xl mx-auto">
            {/* Seção 1 - Introdução */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                1. Introdução
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Adventus Imobiliária valoriza a privacidade e a segurança dos
                dados dos nossos clientes, corretores parceiros e visitantes.
                Esta Política de Privacidade explica como coletamos, usamos,
                compartilhamos e protegemos suas informações pessoais no
                contexto dos serviços imobiliários que prestamos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ao utilizar nossos serviços, sites, aplicativos ou interagir
                conosco de qualquer forma, você concorda com os termos desta
                Política de Privacidade.
              </p>
            </section>

            {/* Seção 2 - Dados que Coletamos */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                2. Dados que Coletamos
              </h2>

              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-8 mb-4">
                2.1. Informações Pessoais
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Coletamos informações que você nos fornece diretamente, como:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Dados de identificação:
                  </span>{" "}
                  nome completo, CPF, RG, data de nascimento
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Informações de contato:
                  </span>{" "}
                  e-mail, telefone, endereço residencial
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Dados profissionais:
                  </span>{" "}
                  profissão, renda, vínculo empregatício (para análise de
                  financiamento)
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Dados do imóvel:
                  </span>{" "}
                  endereço do imóvel, características, documentação
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Dados bancários:
                  </span>{" "}
                  para transações imobiliárias e pagamentos
                </li>
              </ul>

              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-8 mb-4">
                2.2. Informações Coletadas Automaticamente
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Quando você visita nosso site, podemos coletar:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  Endereço IP e informações do dispositivo
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Dados de navegação e interação com nosso site
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Cookies e tecnologias similares
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Imóveis visualizados e favoritados
                </li>
              </ul>
            </section>

            {/* Seção 3 - Como Usamos suas Informações */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                3. Como Usamos suas Informações
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos seus dados pessoais para:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  Cadastrar e gerenciar seu perfil em nossa plataforma
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Processar transações imobiliárias (compra, venda, locação)
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Enviar propostas comerciais e oportunidades de imóveis
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Agendar visitas e avaliações de imóveis
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Analisar crédito para financiamento habitacional
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Enviar comunicados importantes sobre seus imóveis
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Melhorar nossos serviços e experiência do usuário
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Cumprir obrigações legais e regulatórias
                </li>
              </ul>
            </section>

            {/* Seção 4 - Compartilhamento de Dados */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                4. Compartilhamento de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Corretores parceiros:
                  </span>{" "}
                  para apresentação de imóveis e negociações
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Instituições financeiras:
                  </span>{" "}
                  para análise de crédito e financiamento
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Cartórios e registros:
                  </span>{" "}
                  para formalização de transações
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Prestadores de serviços:
                  </span>{" "}
                  empresas que nos auxiliam em nossas operações
                </li>
                <li className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Autoridades competentes:
                  </span>{" "}
                  quando exigido por lei
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">
                  Nunca vendemos seus dados pessoais para terceiros.
                </span>
              </p>
            </section>

            {/* Seção 5 - Segurança das Informações */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                5. Segurança das Informações
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais para proteger
                seus dados contra acesso não autorizado, alteração, divulgação
                ou destruição. Entre as medidas de segurança adotadas estão:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  Criptografia de dados sensíveis
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Controle de acesso baseado em função
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Monitoramento contínuo de segurança
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Backups regulares
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Treinamento de equipe em proteção de dados
                </li>
              </ul>
            </section>

            {/* Seção 6 - Seus Direitos */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                6. Seus Direitos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
                direito a:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  Confirmar a existência de tratamento dos seus dados
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Acessar seus dados pessoais
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Corrigir dados incompletos, inexatos ou desatualizados
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Anonimizar, bloquear ou eliminar dados desnecessários
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Eliminar dados tratados com seu consentimento
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Obter informações sobre compartilhamento com terceiros
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Revogar o consentimento a qualquer momento
                </li>
              </ul>
            </section>

            {/* Seção 7 - Retenção de Dados */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                7. Retenção de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mantemos seus dados pessoais apenas pelo tempo necessário para
                cumprir as finalidades para as quais foram coletados, incluindo
                para fins de cumprimento de obrigações legais, regulatórias,
                fiscais, contábeis ou de relatórios.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Os prazos de retenção são definidos com base nos seguintes
                critérios:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li className="text-gray-700 leading-relaxed">
                  Exigências legais e regulatórias
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Prazo prescricional de ações judiciais
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Necessidade operacional para prestação de serviços
                </li>
                <li className="text-gray-700 leading-relaxed">
                  Consentimento do titular
                </li>
              </ul>
            </section>

            {/* Seção 8 - Cookies e Tecnologias Similares */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                8. Cookies e Tecnologias Similares
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua
                experiência em nosso site, personalizar conteúdo e anúncios,
                fornecer recursos de mídia social e analisar nosso tráfego.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Você pode controlar o uso de cookies através das configurações
                do seu navegador. No entanto, a desativação de cookies pode
                afetar a funcionalidade de nosso site.
              </p>
            </section>

            {/* Seção 9 - Alterações nesta Política */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                9. Alterações nesta Política
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente
                para refletir mudanças em nossas práticas ou por outros motivos
                operacionais, legais ou regulatórios.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Notificaremos você sobre mudanças materiais através de avisos em
                nosso site ou por outros meios de comunicação. A data da última
                atualização será indicada no início desta política.
              </p>
            </section>

            {/* Seção 10 - Contato */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                10. Contato
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você tiver alguma dúvida, preocupação ou solicitação
                relacionada a esta Política de Privacidade ou ao tratamento de
                seus dados pessoais, entre em contato conosco:
              </p>

              <div className="bg-gray-50 p-6 md:p-8 rounded-xl mt-4 border-l-4 border-amber-500">
                <h3 className="text-amber-600 font-bold text-xl mb-4">
                  Encarregado de Proteção de Dados (DPO)
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold text-gray-900">
                    Adventus Imobiliária
                  </span>
                </p>
                <p className="text-gray-700 mb-2">
                  E-mail: adventusimobiliaria@gmail.com
                </p>
                <p className="text-gray-700 mb-2">Telefone: (99) 98808-7867</p>
                <p className="text-gray-700 mb-2">
                  Endereço: Rua Fortaleza 1382-B, Centro, Açailândia - MA
                </p>
                <p className="text-gray-700">
                  Horário de atendimento: Segunda a Sexta, das 8h às 18h
                </p>
              </div>
            </section>

            {/* Seção 11 - Legislação Aplicável */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                11. Legislação Aplicável
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Esta Política de Privacidade é regida pelas leis da República
                Federativa do Brasil, especialmente pela Lei nº 13.709/2018 (Lei
                Geral de Proteção de Dados Pessoais - LGPD).
              </p>
              <p className="text-gray-700 leading-relaxed">
                Quaisquer disputas oriundas desta política serão resolvidas no
                foro da comarca de Açailândia/MA.
              </p>
            </section>

            {/* Última atualização */}
            <div className="mt-8">
              <p className="text-gray-500 text-sm">
                <span className="font-semibold text-gray-900">
                  Última atualização:
                </span>{" "}
                18 de Janeiro de 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <Rodape />
    </>
  );
};

export default PoliticaPrivacidade;
