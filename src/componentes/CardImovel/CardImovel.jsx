import { Link } from "react-router-dom";

// 🔥 FUNÇÃO PARA GERAR SLUG SEO (COLOQUE ANTES DO COMPONENTE)
const gerarSlugSEO = (imovel) => {
  if (!imovel) return "imovel";

  const partes = [];

  // 1. TIPO (casa, apto, etc)
  if (imovel.tipo) partes.push(imovel.tipo.toLowerCase());

  // 2. BAIRRO (se tiver)
  if (imovel.bairro) partes.push(imovel.bairro.toLowerCase());

  // 3. CIDADE (se tiver)
  if (imovel.cidade) partes.push(imovel.cidade.toLowerCase());

  // 4. QUARTOS (se tiver)
  if (imovel.quartos && imovel.quartos > 0) {
    partes.push(`${imovel.quartos}-quartos`);
  }

  // 5. ÁREA CONSTRUÍDA (se tiver)
  if (imovel.areaConstruida && imovel.areaConstruida > 0) {
    partes.push(`${imovel.areaConstruida}m`);
  } else if (imovel.areaTotal && imovel.areaTotal > 0) {
    partes.push(`${imovel.areaTotal}m`);
  }

  // Se não conseguiu montar nada, usa o título
  if (partes.length === 0 && imovel.titulo) {
    return imovel.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Junta tudo com hífen
  return partes
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

const CardImovel = ({
  id,
  slug,
  codigo,
  status = "available",
  tipo = "CASA",
  finalidade = "VENDA",
  preco = "R$ 850.000",
  titulo = "Casa moderna em condomínio fechado",
  localizacao = "Centro • Torres / RS",
  bairro = "",
  cidade = "",
  estado = "",
  quartos = 3,
  suites = 1,
  banheiros = 2,
  vagas = 2,
  areaTotal = 0,
  areaConstruida = 0,
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

  // 🔥 GERAR O SLUG SEO COM OS DADOS DO IMÓVEL
  const slugSEO = gerarSlugSEO({
    tipo,
    bairro,
    cidade,
    quartos,
    areaConstruida,
    areaTotal,
    titulo,
  });

  // 🔥 NOVA URL: /imovel/[slug]/[codigo]
  const urlImovel = codigo
    ? `/imovel/${slugSEO}/${codigo}`
    : `/imovel/${slug || id}`;

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col relative md:min-h-[200px] md:flex-row group w-full max-w-sm mx-auto md:max-w-none">
      {/* STATUS BADGE */}
      <div
        className={`absolute top-5 left-5 md:top-6 md:left-6 px-4 py-2 rounded-2xl text-xs font-bold text-white uppercase tracking-wider z-10 transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 border-2 border-white/50 backdrop-blur-sm flex items-center gap-1.5 shadow-2xl ${statusData.className}`}
      >
        <i className={`${statusData.icon} text-xs drop-shadow-md`}></i>
        {statusData.label}
      </div>

      {/* CÓDIGO DO IMÓVEL */}
      {codigo && (
        <div className="absolute top-5 right-5 md:top-6 md:right-6 z-10">
          <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono border border-white/20">
            {codigo}
          </span>
        </div>
      )}

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

        {/* TÍTULO */}
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

          {/* 🔥 LINK NOVO FORMATO */}
          <Link
            to={urlImovel}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            title={codigo ? `Código: ${codigo}` : "Ver detalhes"}
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
