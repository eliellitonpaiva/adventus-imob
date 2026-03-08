// src/lib/slugify.js

/**
 * Remove acentos de uma string
 * @param {string} str - String com acentos
 * @returns {string} - String sem acentos
 */
const removerAcentos = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Limpa uma string para uso em URLs (remove caracteres especiais, espaços por hífen)
 * @param {string} str - String para limpar
 * @param {Object} options - Opções de limpeza
 * @returns {string} - String limpa
 */
const limparParaSlug = (str, options = {}) => {
  const {
    separador = "-",
    removerAcentos: remover = true,
    substituirEspacos = true,
    toLowerCase: lower = true,
  } = options;

  if (!str) return "";

  let resultado = str;

  // Remove acentos se solicitado
  if (remover) {
    resultado = removerAcentos(resultado);
  }

  // Converte para minúsculas se solicitado
  if (lower) {
    resultado = resultado.toLowerCase();
  }

  // Substitui caracteres especiais por vazio
  resultado = resultado.replace(/[^a-z0-9\s-]/gi, "");

  // Substitui espaços pelo separador
  if (substituirEspacos) {
    resultado = resultado.replace(/\s+/g, separador);
  }

  // Remove separadores repetidos
  const regexRepetidos = new RegExp(`${separador}+`, "g");
  resultado = resultado.replace(regexRepetidos, separador);

  // Remove separador do início e fim
  const regexInicioFim = new RegExp(`^${separador}+|${separador}+$`, "g");
  resultado = resultado.replace(regexInicioFim, "");

  return resultado;
};

/**
 * Gera um slug a partir de um texto simples
 * @param {string} texto - Texto para converter em slug
 * @returns {string} - Slug gerado
 */
export const slugify = (texto) => {
  return limparParaSlug(texto);
};

/**
 * Gera um slug SEO a partir de um objeto imóvel
 * @param {Object} imovel - Dados do imóvel
 * @returns {string} - Slug SEO otimizado
 */
export const gerarSlugSEO = (imovel) => {
  if (!imovel) return "imovel";

  const partes = [];

  // 1. TIPO DO IMÓVEL (prioridade alta para SEO)
  if (imovel.tipo) {
    const tipos = {
      apartamento: "apartamento",
      casa: "casa",
      terreno: "terreno",
      comercial: "comercial",
      sobrado: "sobrado",
      kitnet: "kitnet",
      fazenda: "fazenda",
      chacara: "chacara",
      sitio: "sitio",
      galpao: "galpao",
      predio: "predio",
      sala: "sala-comercial",
      loja: "loja",
    };
    partes.push(tipos[imovel.tipo] || imovel.tipo);
  }

  // 2. FINALIDADE (venda/aluguel) - se disponível
  if (imovel.finalidade) {
    partes.push(imovel.finalidade === "venda" ? "venda" : "aluguel");
  }

  // 3. QUARTOS (se for relevante)
  if (imovel.quartos && imovel.quartos > 0) {
    const quartosTexto =
      imovel.quartos === 1 ? "1-quarto" : `${imovel.quartos}-quartos`;
    partes.push(quartosTexto);
  }

  // 4. SUÍTES (opcional, bom para SEO)
  if (imovel.suites && imovel.suites > 0) {
    const suitesTexto =
      imovel.suites === 1 ? "1-suite" : `${imovel.suites}-suites`;
    partes.push(suitesTexto);
  }

  // 5. ÁREA CONSTRUÍDA (valoriza o imóvel)
  if (imovel.area_construida && imovel.area_construida > 0) {
    partes.push(`${Math.round(imovel.area_construida)}m2`);
  }

  // 6. BAIRRO (se tiver e for para exibir)
  if (imovel.bairro) {
    partes.push(limparParaSlug(imovel.bairro));
  }

  // 7. CIDADE (se tiver)
  if (imovel.cidade) {
    partes.push(limparParaSlug(imovel.cidade));
  }

  // 8. UF/ESTADO (se tiver)
  if (imovel.estado) {
    partes.push(imovel.estado.toLowerCase());
  }

  // Se não tiver nada disso, usa o título
  if (partes.length === 0 && imovel.titulo) {
    return limparParaSlug(imovel.titulo);
  }

  // Junta todas as partes com hífen e limpa
  return limparParaSlug(partes.join("-"));
};

/**
 * Gera slug apenas com localização (bairro-cidade-uf)
 * @param {Object} imovel - Dados do imóvel
 * @returns {string} - Slug de localização
 */
export const slugifyLocalizacao = (imovel) => {
  const partes = [];

  if (imovel.bairro) partes.push(imovel.bairro);
  if (imovel.cidade) partes.push(imovel.cidade);
  if (imovel.estado) partes.push(imovel.estado);

  if (partes.length === 0) return "";
  return limparParaSlug(partes.join("-"));
};

/**
 * Gera slug apenas com características (tipo-quartos-area)
 * @param {Object} imovel - Dados do imóvel
 * @returns {string} - Slug de características
 */
export const slugifyCaracteristicas = (imovel) => {
  const partes = [];

  if (imovel.tipo) partes.push(imovel.tipo);
  if (imovel.quartos) partes.push(`${imovel.quartos}-quartos`);
  if (imovel.area_construida)
    partes.push(`${Math.round(imovel.area_construida)}m2`);

  if (partes.length === 0) return "";
  return limparParaSlug(partes.join("-"));
};

// Export default com todas as funções (opcional)
export default {
  slugify,
  gerarSlugSEO,
  slugifyLocalizacao,
  slugifyCaracteristicas,
  removerAcentos,
};
