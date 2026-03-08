// src/lib/slugify.js
export const gerarSlugSEO = (imovel) => {
  if (!imovel) return "imovel";

  const partes = [];

  // Pega o tipo (casa, apto, etc)
  if (imovel.tipo) partes.push(imovel.tipo);

  // Pega o bairro (se tiver)
  if (imovel.bairro) partes.push(imovel.bairro);

  // Pega a cidade (se tiver)
  if (imovel.cidade) partes.push(imovel.cidade);

  // Pega características
  if (imovel.quartos) partes.push(`${imovel.quartos}-quartos`);
  if (imovel.area_construida) partes.push(`${imovel.area_construida}m`);

  // Se não tiver nada disso, usa o título
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};
