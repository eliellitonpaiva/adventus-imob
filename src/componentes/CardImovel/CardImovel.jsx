import { Link } from "react-router-dom";

const CardImovel = ({
  status = "available",
  tipo = "CASA",
  finalidade = "VENDA",
  preco = "R$ 850.000",
  titulo = "Casa moderna em condomínio fechado",
  localizacao = "Centro • Torres / RS",
  quartos = 3,
  suites = 1,
  banheiros = 2,
  vagas = 2,
  emCondominio = true,
  imagem = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=60",
}) => {
  const statusMap = {
    available: {
      label: "Disponível",
      className:
        "bg-gradient-to-br from-green-400 to-green-600 border-green-200",
      icon: "fas fa-check-circle",
    },
    sold: {
      label: "Vendido",
      className: "bg-gradient-to-br from-red-400 to-red-600 border-red-200",
      icon: "fas fa-times-circle",
    },
    "price-drop": {
      label: "Baixou Preço",
      className:
        "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-200",
      icon: "fas fa-arrow-down",
    },
  };

  const statusData = statusMap[status];

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col relative md:min-h-[200px] md:flex-row group w-full max-w-sm mx-auto md:max-w-none">
      {/* STATUS BADGE */}
      <div
        className={`absolute top-5 left-5 md:top-6 md:left-6 px-4 py-2 rounded-2xl text-xs font-bold text-white uppercase tracking-wider z-10 transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 border-2 border-white/50 backdrop-blur-sm flex items-center gap-1.5 shadow-2xl ${statusData.className} animate-pulse hover:animate-none hover:shadow-glow`}
      >
        <i className={`${statusData.icon} text-xs drop-shadow-md`}></i>
        {statusData.label}
      </div>

      {/* IMAGEM */}
      <div className="relative h-56 overflow-hidden bg-white md:w-2/5 md:h-auto md:flex-shrink-0">
        <div className="absolute inset-4 rounded-xl overflow-hidden shadow-lg bg-white">
          <img
            src={imagem}
            alt={`Imóvel: ${titulo}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* DIVIDER PARA DESKTOP */}
        <div className="hidden md:block absolute right-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent bg-[length:1px_10px] bg-repeat-y"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6 flex-grow flex flex-col relative md:w-3/5">
        {/* TAGS */}
        <div className="flex flex-wrap gap-2.5 mb-4 items-center">
          <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl text-sm font-bold">
            {finalidade}
          </span>
          <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl text-sm font-bold">
            {tipo}
          </span>
        </div>

        {/* PREÇO NO LUGAR CORRETO */}
        <div className="text-2xl font-extrabold text-gray-800 font-sans mb-4">
          {preco}
        </div>

        {/* TÍTULO */}
        <h3 className="text-xl font-bold mb-3 text-gray-800 leading-relaxed">
          {titulo}
        </h3>

        {/* LOCALIZAÇÃO */}
        <div className="flex items-center gap-2 text-gray-600 mb-5 text-sm">
          <i className="fas fa-map-marker-alt text-amber-500 text-sm"></i>
          {localizacao}
        </div>

        {/* FEATURES */}
        <div className="flex flex-wrap gap-2.5 mb-6 pt-4 border-t border-dashed border-gray-200 justify-start items-start">
          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs min-w-[50px] md:min-w-[55px] lg:min-w-[60px] flex-shrink-0">
            <i className="fas fa-bed text-amber-500 text-lg md:text-xl mb-0.5"></i>
            <span className="font-normal text-gray-800 text-sm leading-tight font-sans whitespace-nowrap text-center">
              {quartos} Quarto{quartos !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs min-w-[50px] md:min-w-[55px] lg:min-w-[60px] flex-shrink-0">
            <i className="fas fa-bath text-amber-500 text-lg md:text-xl mb-0.5"></i>
            <span className="font-normal text-gray-800 text-sm leading-tight font-sans whitespace-nowrap text-center">
              {banheiros} Banheiro{banheiros !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs min-w-[50px] md:min-w-[55px] lg:min-w-[60px] flex-shrink-0">
            <i className="fas fa-shower text-amber-500 text-lg md:text-xl mb-0.5"></i>
            <span className="font-normal text-gray-800 text-sm leading-tight font-sans whitespace-nowrap text-center">
              {suites} Suíte{suites !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs min-w-[50px] md:min-w-[55px] lg:min-w-[60px] flex-shrink-0">
            <i className="fas fa-car text-amber-500 text-lg md:text-xl mb-0.5"></i>
            <span className="font-normal text-gray-800 text-sm leading-tight font-sans whitespace-nowrap text-center">
              {vagas} Vaga{vagas !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* AÇÕES - CORRIGIDO: BOTÃO SEMPRE VISÍVEL + ETIQUETA CONDICIONAL */}
        <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-200">
          {/* LADO ESQUERDO: ETIQUETA "EM CONDOMÍNIO" (SE FOR TRUE) */}
          <div className="flex items-center">
            {emCondominio && (
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                <i className="fas fa-building text-amber-500 text-sm"></i>
                <span>Em condomínio</span>
              </div>
            )}
          </div>

          {/* LADO DIREITO: SEMPRE MOSTRA O BOTÃO "VER DETALHES" */}
          <Link
            to="/imovel/1"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold font-sans border-none cursor-pointer transition-all duration-300 ease-in-out text-sm flex items-center gap-2.5 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 border-0 border-gray-800/20 group/btn"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <i className="fas fa-eye text-sm"></i>
              Ver Detalhes
            </span>
            <span className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-500 ease-in-out group-hover/btn:left-full"></span>
          </Link>
        </div>
      </div>

      {/* ESTILOS EMBUTIDOS PARA ANIMAÇÕES ESPECÍFICAS */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }
          50% {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .hover\:shadow-glow:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .bg-gradient-to-br.from-green-400.to-green-600.hover\:shadow-glow:hover {
          box-shadow:
            0 0 20px rgba(0, 255, 0, 0.9),
            0 0 30px rgba(0, 255, 0, 0.7),
            0 0 40px rgba(0, 255, 0, 0.5);
        }

        .bg-gradient-to-br.from-red-400.to-red-600.hover\:shadow-glow:hover {
          box-shadow:
            0 0 20px rgba(255, 0, 0, 0.9),
            0 0 30px rgba(255, 0, 0, 0.7),
            0 0 40px rgba(255, 0, 0, 0.5);
        }

        .bg-gradient-to-br.from-orange-400.to-orange-600.hover\:shadow-glow:hover {
          box-shadow:
            0 0 20px rgba(255, 119, 0, 0.9),
            0 0 30px rgba(255, 119, 0, 0.7),
            0 0 40px rgba(255, 119, 0, 0.5);
        }

        .bg-\[length\:1px_10px\] {
          background-size: 1px 10px;
        }

        @media (max-width: 767px) {
          .flex-wrap > * {
            flex: 1;
            min-width: 45px;
          }
        }
      `}</style>
    </article>
  );
};

export default CardImovel;
