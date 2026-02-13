import { Link } from "react-router-dom";

const CardImovel = ({
  id,
  slug,
  status = "available",
  tipo = "CASA",
  finalidade = "VENDA",
  preco = "R$ 850.000",
  titulo = "Casa moderna em condomínio fechado", // ← AGORA RECEBE O TÍTULO AUTOMÁTICO!
  localizacao = "Centro • Torres / RS",
  bairro = "", // 🔥 NOVO!
  cidade = "", // 🔥 NOVO!
  estado = "", // 🔥 NOVO!
  quartos = 3,
  suites = 1,
  banheiros = 2,
  vagas = 2,
  emCondominio = true,
  empreendimento = null,
  unidade = "",
  bloco = "",
  andar = "",
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

  const statusData = statusMap[status] || statusMap.available;

  const montarUnidadeCompleta = () => {
    const partes = [];
    if (unidade) partes.push(`Apto ${unidade}`);
    if (andar) {
      const andarLimpo = andar.toString().replace("º", "");
      partes.push(`${andarLimpo}º andar`);
    }
    if (bloco) partes.push(`Bloco ${bloco}`);
    return partes.join(" • ");
  };

  const unidadeCompleta = montarUnidadeCompleta();

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col relative md:min-h-[200px] md:flex-row group w-full max-w-sm mx-auto md:max-w-none">
      {/* STATUS BADGE */}
      <div
        className={`absolute top-5 left-5 md:top-6 md:left-6 px-4 py-2 rounded-2xl text-xs font-bold text-white uppercase tracking-wider z-10 transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 border-2 border-white/50 backdrop-blur-sm flex items-center gap-1.5 shadow-2xl ${statusData.className}`}
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

        {/* PREÇO */}
        <div className="text-2xl font-extrabold text-gray-800 font-sans mb-4">
          {preco}
        </div>

        {/* TÍTULO - AGORA MOSTRA O TÍTULO AUTOMÁTICO CORRETO! */}
        <h3 className="text-xl font-bold text-gray-800 leading-relaxed mb-2">
          {titulo}
        </h3>

        {/* UNIDADE */}
        {unidadeCompleta && (
          <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
            <div className="w-4 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-door-open text-amber-500 text-xs"></i>
            </div>
            <span className="leading-tight">{unidadeCompleta}</span>
          </div>
        )}

        {/* EMPREENDIMENTO */}
        {empreendimento?.nome && (
          <div className="flex items-start gap-2 mb-2">
            <div className="w-4 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-building text-amber-500 text-xs"></i>
            </div>
            <div className="bg-amber-100/90 px-2 py-0.5 rounded-lg inline-flex items-center">
              <span className="leading-tight font-medium text-amber-800 text-[11px]">
                {empreendimento.nome}
              </span>
              {empreendimento.tipo === "edificio" && (
                <span className="ml-1.5 text-[9px] bg-amber-200/80 text-amber-700 px-1 py-0.5 rounded-full">
                  Edifício
                </span>
              )}
              {empreendimento.tipo === "condominio" && (
                <span className="ml-1.5 text-[9px] bg-amber-200/80 text-amber-700 px-1 py-0.5 rounded-full">
                  Condomínio
                </span>
              )}
            </div>
          </div>
        )}

        {/* LOCALIZAÇÃO */}
        <div className="flex items-start gap-2 text-gray-500 text-sm mb-5">
          <div className="w-4 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-map-marker-alt text-amber-500 text-xs"></i>
          </div>
          <span className="leading-tight">{localizacao}</span>
        </div>

        {/* FEATURES */}
        <div className="flex flex-wrap gap-4 mb-6 pt-4 border-t border-dashed border-gray-200">
          {/* QUARTOS */}
          {quartos > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bed text-amber-500 text-xs"></i>
              </div>
              <span>
                {quartos} Quarto{quartos !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* BANHEIROS */}
          {banheiros > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bath text-amber-500 text-xs"></i>
              </div>
              <span>
                {banheiros} Banheiro{banheiros !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* SUÍTES */}
          {suites > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-crown text-amber-500 text-xs"></i>
              </div>
              <span>
                {suites} Suíte{suites !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* VAGAS */}
          {vagas > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-car text-amber-500 text-xs"></i>
              </div>
              <span>
                {vagas} Vaga{vagas !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* AÇÕES */}
        <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-200">
          <div>
            {emCondominio && !empreendimento?.nome && (
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <div className="w-4 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-building text-amber-500 text-xs"></i>
                </div>
                <span>Em condomínio</span>
              </div>
            )}
          </div>

          {/* LINK COM SLUG */}
          <Link
            to={`/imovel/${slug || id}`}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-4 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-eye text-xs"></i>
            </div>
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CardImovel;
