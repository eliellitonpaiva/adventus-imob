import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerenderStatic from "vite-plugin-prerender-static";
import sitemap from "vite-plugin-sitemap"; // ← MUDOU AQUI: import padrão, não nomeado

// ==============================================
// DADOS REAIS DA ADVENTUS IMOBILIÁRIA
// ==============================================
const imobiliariaData = {
  nome: "Adventus Imobiliária",
  telefone: "+55 99 98808-7867",
  telefoneFixo: "+55 99 8808-7867",
  email: "adventusimobiliaria@gmail.com",
  emailAlternativo: "francesilva@hotmail.com.br",
  endereco: {
    rua: "Rua Fortaleza, 1382-B",
    bairro: "Centro",
    cidade: "Açailândia",
    estado: "MA",
    cep: "65930-000",
    completo: "Rua Fortaleza 1382-B, Centro, Açailândia - MA",
  },
  horarioFuncionamento: "Mo-Fr 08:00-18:00",
  redesSociais: {
    instagram: "https://www.instagram.com/adventusimobiliaria/",
    facebook: "https://www.facebook.com/profile.php?id=100041371455024",
    whatsapp: "https://wa.me/5599988087867",
  },
  coordenadas: {
    lat: "-4.9472",
    lng: "-47.5044",
  },
  slogan: "Cada cliente, uma história.",
  site: "https://adventusimobiliaria.com.br",
  creci: "🔴 ADICIONAR CRECI",
  fundacao: "🔴 ADICIONAR ANO",
  corretores: "🔴 ADICIONAR QUANTIDADE",
};

// ==============================================
// FUNÇÃO DE GERAÇÃO SEMÂNTICA DE KEYWORDS
// ==============================================
function generateKeywords(termos, location) {
  const variations = [];
  const locationVars = [
    location,
    `${location} MA`,
    `${location} Maranhão`,
    `em ${location}`,
    `- ${location}`,
  ];

  termos.forEach((term) => {
    locationVars.forEach((loc) => {
      variations.push(`${term} ${loc}`);
      variations.push(`${loc} ${term}`);
      variations.push(term.replace("Açailândia", loc));
    });
  });

  return [...new Set(variations)].filter((k) => k.length > 5);
}

// ==============================================
// BASE DE PALAVRAS-CHAVE
// ==============================================
const baseKeywords = [
  "Adventus Imobiliária",
  "Adventus Açailândia",
  "imobiliária Açailândia",
  "corretor de imóveis Açailândia",
  "imóveis Açailândia",
  "comprar imóvel Açailândia",
  "alugar imóvel Açailândia",
  "vender imóvel Açailândia",
  "casas Açailândia",
  "apartamentos Açailândia",
  "terrenos Açailândia",
  "imóveis comerciais Açailândia",
  "lançamentos imobiliários Açailândia",
  "financiamento imobiliário Açailândia",
  "melhor imobiliária Açailândia",
  "imobiliárias em Açailândia",
];

// ==============================================
// BAIRROS DE AÇAILÂNDIA (LISTA COMPLETA - 41 BAIRROS)
// ==============================================
const bairrosAcilandia = [
  // Centro e região central (8 bairros)
  {
    nome: "Centro",
    slug: "centro",
    regiao: "central",
    descricao: "área central com comércio e serviços",
  },
  {
    nome: "Vila Ildemar",
    slug: "vila-ildemar",
    regiao: "central",
    descricao: "bairro tradicional próximo ao centro",
  },
  {
    nome: "Vila Sarney Filho",
    slug: "vila-sarney-filho",
    regiao: "central",
    descricao: "região central consolidada",
  },
  {
    nome: "João Paulo",
    slug: "joao-paulo",
    regiao: "central",
    descricao: "área residencial próxima ao centro",
  },
  {
    nome: "Entroncamento",
    slug: "entroncamento",
    regiao: "central",
    descricao: "ponto estratégico da cidade",
  },
  {
    nome: "Vila Maranhão",
    slug: "vila-maranhao",
    regiao: "central",
    descricao: "comunidade estabelecida",
  },
  {
    nome: "Vila Ipiranga",
    slug: "vila-ipiranga",
    regiao: "central",
    descricao: "bairro tradicional",
  },
  {
    nome: "Getat",
    slug: "getat",
    regiao: "central",
    descricao: "área do grupo executivo",
  },

  // Jardins e áreas nobres (12 bairros)
  {
    nome: "Jardim América",
    slug: "jardim-america",
    regiao: "nobre",
    descricao: "bairro nobre e residencial",
  },
  {
    nome: "Jardim Glória",
    slug: "jardim-gloria",
    regiao: "nobre",
    descricao: "área nobre em expansão",
  },
  {
    nome: "Jardim Glória II",
    slug: "jardim-gloria-ii",
    regiao: "nobre",
    descricao: "continuação do Jardim Glória",
  },
  {
    nome: "Jardim Glória III",
    slug: "jardim-gloria-iii",
    regiao: "nobre",
    descricao: "novo loteamento nobre",
  },
  {
    nome: "Jardim de Alah",
    slug: "jardim-de-alah",
    regiao: "nobre",
    descricao: "bairro planejado",
  },
  {
    nome: "Jardim Brasil",
    slug: "jardim-brasil",
    regiao: "nobre",
    descricao: "área residencial de qualidade",
  },
  {
    nome: "Jardim Aulídia",
    slug: "jardim-aulidia",
    regiao: "nobre",
    descricao: "bairro tranquilo e arborizado",
  },
  {
    nome: "Park Jardins",
    slug: "park-jardins",
    regiao: "nobre",
    descricao: "condomínio de alto padrão",
  },
  {
    nome: "Parque Planalto",
    slug: "parque-planalto",
    regiao: "nobre",
    descricao: "área nobre com infraestrutura",
  },
  {
    nome: "Parque da Lagoa",
    slug: "parque-da-lagoa",
    regiao: "nobre",
    descricao: "região valorizada",
  },
  {
    nome: "Parque das Nações",
    slug: "parque-das-nacoes",
    regiao: "nobre",
    descricao: "bairro planejado",
  },
  {
    nome: "Parque Novo Horizonte",
    slug: "parque-novo-horizonte",
    regiao: "nobre",
    descricao: "novo parque residencial",
  },

  // Novos loteamentos e residenciais (11 bairros)
  {
    nome: "Nova Açailândia",
    slug: "nova-acailandia",
    regiao: "novo",
    descricao: "bairro novo em crescimento",
  },
  {
    nome: "Nova Açailândia II",
    slug: "nova-acailandia-ii",
    regiao: "novo",
    descricao: "expansão da Nova Açailândia",
  },
  {
    nome: "Residencial Tropical",
    slug: "residencial-tropical",
    regiao: "novo",
    descricao: "condomínio residencial",
  },
  {
    nome: "Residencial Ouro Verde",
    slug: "residencial-ouro-verde",
    regiao: "novo",
    descricao: "loteamento novo",
  },
  {
    nome: "Residencial Valle do Açaí",
    slug: "valle-do-acai",
    regiao: "novo",
    descricao: "residencial planejado",
  },
  {
    nome: "Colinas Park",
    slug: "colinas-park",
    regiao: "novo",
    descricao: "loteamento em desenvolvimento",
  },
  {
    nome: "Porto Seguro",
    slug: "porto-seguro",
    regiao: "novo",
    descricao: "novo bairro residencial",
  },
  {
    nome: "Porto Seguro II",
    slug: "porto-seguro-ii",
    regiao: "novo",
    descricao: "ampliação do Porto Seguro",
  },
  {
    nome: "Novo Bacabal",
    slug: "novo-bacabal",
    regiao: "novo",
    descricao: "área em expansão",
  },
  {
    nome: "Brasil Novo",
    slug: "brasil-novo",
    regiao: "novo",
    descricao: "bairro em desenvolvimento",
  },
  {
    nome: "Barra Azul",
    slug: "barra-azul",
    regiao: "novo",
    descricao: "área residencial",
  },

  // Bairros populares e consolidados (10 bairros)
  {
    nome: "Jacu",
    slug: "jacu",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Piquiá",
    slug: "piquia",
    regiao: "popular",
    descricao: "bairro operário",
  },
  {
    nome: "Vila Bom Jardim",
    slug: "vila-bom-jardim",
    regiao: "popular",
    descricao: "comunidade tradicional",
  },
  {
    nome: "Bom Jardim",
    slug: "bom-jardim",
    regiao: "popular",
    descricao: "bairro residencial",
  },
  {
    nome: "Laranjeiras",
    slug: "laranjeiras",
    regiao: "popular",
    descricao: "área residencial",
  },
  {
    nome: "Vila São Francisco",
    slug: "vila-sao-francisco",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Vila Tancredo Neves",
    slug: "vila-tancredo-neves",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Capelosa",
    slug: "capelosa",
    regiao: "popular",
    descricao: "comunidade tradicional",
  },
  {
    nome: "Vila União",
    slug: "vila-uniao",
    regiao: "popular",
    descricao: "bairro unido",
  },
  {
    nome: "Massaranduba",
    slug: "massaranduba",
    regiao: "popular",
    descricao: "área tradicional",
  },
  {
    nome: "Plano da Serra",
    slug: "plano-da-serra",
    regiao: "popular",
    descricao: "região serrana",
  },
];

// Agrupamento por região
const regioesAcilandia = {
  central: bairrosAcilandia.filter((b) => b.regiao === "central"),
  nobre: bairrosAcilandia.filter((b) => b.regiao === "nobre"),
  novo: bairrosAcilandia.filter((b) => b.regiao === "novo"),
  popular: bairrosAcilandia.filter((b) => b.regiao === "popular"),
};

// ==============================================
// TIPOS DE IMÓVEIS
// ==============================================
const tiposImovel = [
  { nome: "Casa", slug: "casa", plural: "casas", icone: "🏠" },
  {
    nome: "Apartamento",
    slug: "apartamento",
    plural: "apartamentos",
    icone: "🏢",
  },
  { nome: "Terreno", slug: "terreno", plural: "terrenos", icone: "🌲" },
  {
    nome: "Ponto Comercial",
    slug: "ponto-comercial",
    plural: "pontos-comerciais",
    icone: "🏪",
  },
  { nome: "Sítio/Chácara", slug: "sitio", plural: "sítios", icone: "🌳" },
  { nome: "Galpão", slug: "galpao", plural: "galpões", icone: "🏭" },
];

// ==============================================
// GERADOR DE SCHEMA
// ==============================================
function gerarSchemaImobiliaria() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness", "Organization"],
    name: imobiliariaData.nome,
    description: imobiliariaData.slogan,
    url: imobiliariaData.site,
    telephone: imobiliariaData.telefone,
    email: imobiliariaData.email,
    openingHours: imobiliariaData.horarioFuncionamento,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: imobiliariaData.endereco.rua,
      addressLocality: imobiliariaData.endereco.bairro,
      addressRegion: imobiliariaData.endereco.estado,
      postalCode: imobiliariaData.endereco.cep,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: imobiliariaData.coordenadas.lat,
      longitude: imobiliariaData.coordenadas.lng,
    },
    sameAs: [
      imobiliariaData.redesSociais.instagram,
      imobiliariaData.redesSociais.facebook,
      imobiliariaData.redesSociais.whatsapp,
    ],
    areaServed: [
      "Açailândia",
      ...bairrosAcilandia.map((b) => b.nome),
      "Maranhão",
    ],
    keywords: baseKeywords.join(", "),
    foundingDate: imobiliariaData.fundacao,
    numberOfEmployees: imobiliariaData.corretores,
  };
}

// ==============================================
// ROTAS PRINCIPAIS
// ==============================================
function gerarRotasPrincipais() {
  return [
    {
      path: "/casas-em-acailandia",
      titulo: "Casas em Açailândia",
      descricao: "casas para comprar e alugar",
    },
    {
      path: "/apartamentos-em-acailandia",
      titulo: "Apartamentos em Açailândia",
      descricao: "apartamentos residenciais",
    },
    {
      path: "/imoveis-em-acailandia",
      titulo: "Imóveis em Açailândia",
      descricao: "todos os tipos de imóveis",
    },
    {
      path: "/terrenos-em-acailandia",
      titulo: "Terrenos em Açailândia",
      descricao: "lotes e áreas para construção",
    },
    {
      path: "/aluguel-acailandia",
      titulo: "Aluguel de Imóveis em Açailândia",
      descricao: "imóveis para locação",
    },
    {
      path: "/venda-acailandia",
      titulo: "Imóveis à Venda em Açailândia",
      descricao: "imóveis para comprar",
    },
    {
      path: "/imoveis-comerciais-acailandia",
      titulo: "Imóveis Comerciais em Açailândia",
      descricao: "pontos comerciais, salas e galpões",
    },
    {
      path: "/lancamentos-acailandia",
      titulo: "Lançamentos Imobiliários em Açailândia",
      descricao: "imóveis novos e na planta",
    },
  ];
}

// ==============================================
// ROTAS POR REGIÃO
// ==============================================
function gerarRotasRegiao() {
  const regioes = [
    { slug: "nobre", nome: "Nobre", bairros: regioesAcilandia.nobre },
    { slug: "central", nome: "Central", bairros: regioesAcilandia.central },
    {
      slug: "novos-loteamentos",
      nome: "Novos Loteamentos",
      bairros: regioesAcilandia.novo,
    },
    { slug: "populares", nome: "Populares", bairros: regioesAcilandia.popular },
  ];

  return regioes.flatMap((regiao) => {
    const rotas = [
      {
        path: `/imoveis-regiao-${regiao.slug}-acailandia`,
        tags: {
          title: `Imóveis na Região ${regiao.nome} de Açailândia | Adventus`,
          description: `Encontre imóveis na região ${regiao.nome} de Açailândia: ${regiao.bairros.map((b) => b.nome).join(", ")}. Casas, apartamentos e terrenos com a Adventus.`,
          keywords: [
            `imóveis região ${regiao.nome} Açailândia`,
            `região ${regiao.nome} Açailândia imóveis`,
            ...regiao.bairros.flatMap((b) => [
              `${b.nome} Açailândia`,
              `imóveis ${b.nome}`,
            ]),
            ...baseKeywords,
          ].join(", "),
          canonical: `${imobiliariaData.site}/imoveis-regiao-${regiao.slug}-acailandia`,
        },
      },
    ];

    // Adiciona rotas por tipo + região
    tiposImovel.forEach((tipo) => {
      rotas.push({
        path: `/${tipo.plural}-regiao-${regiao.slug}-acailandia`,
        tags: {
          title: `${tipo.plural} na Região ${regiao.nome} de Açailândia | Adventus`,
          description: `Encontre ${tipo.plural} na região ${regiao.nome} de Açailândia. ${regiao.bairros.map((b) => b.nome).join(", ")}. Confira as opções com a Adventus.`,
          keywords: [
            `${tipo.plural} região ${regiao.nome} Açailândia`,
            `${tipo.slug} ${regiao.slug} Açailândia`,
            ...regiao.bairros.map((b) => `${tipo.slug} ${b.slug} Açailândia`),
            ...baseKeywords,
          ].join(", "),
          canonical: `${imobiliariaData.site}/${tipo.plural}-regiao-${regiao.slug}-acailandia`,
        },
      });
    });

    return rotas;
  });
}

// ==============================================
// CONFIGURAÇÃO PRINCIPAL
// ==============================================
export default defineConfig({
  plugins: [
    react(),
    prerenderStatic({
      routes: async () => {
        // Gera todas as keywords semânticas
        const locationKeywords = generateKeywords(baseKeywords, "Açailândia");

        // ==============================================
        // CONSTRUÇÃO DE TODAS AS ROTAS
        // ==============================================
        const rotas = [
          // HOME PAGE
          {
            path: "/",
            tags: {
              title: `${imobiliariaData.nome} | Compra, Venda e Aluguel em Açailândia MA`,
              description: `${imobiliariaData.slogan}. Encontre seu imóvel em Açailândia com a ${imobiliariaData.nome}. Casas, apartamentos, imóveis comerciais e terrenos em todos os bairros: ${bairrosAcilandia
                .slice(0, 10)
                .map((b) => b.nome)
                .join(", ")} e mais.`,
              keywords: [...baseKeywords, ...locationKeywords].join(", "),
              author: imobiliariaData.nome,
              url: imobiliariaData.site,
              image:
                "https://adventusimobiliaria.com.br/img/adventusimobiliaria.png",
              canonical: imobiliariaData.site,
              "geo.region": "BR-MA",
              "geo.placename": "Açailândia",
              "geo.position": `${imobiliariaData.coordenadas.lat};${imobiliariaData.coordenadas.lng}`,
              ICBM: `${imobiliariaData.coordenadas.lat}, ${imobiliariaData.coordenadas.lng}`,
              schema: gerarSchemaImobiliaria(),
            },
          },

          // PÁGINAS PRINCIPAIS (8 páginas)
          ...gerarRotasPrincipais().map((item) => ({
            path: item.path,
            tags: {
              title: `${item.titulo} | ${imobiliariaData.nome}`,
              description: `Encontre as melhores ${item.descricao} em Açailândia MA. Confira as opções disponíveis em todos os bairros com a ${imobiliariaData.nome} - Sua imobiliária no Centro de Açailândia.`,
              keywords: [
                item.path.replace(/\//g, "").replace(/-/g, " "),
                `${item.titulo.toLowerCase()} MA`,
                ...baseKeywords,
              ].join(", "),
              canonical: `${imobiliariaData.site}${item.path}`,
            },
          })),

          // PÁGINAS DE TIPOS DE IMÓVEIS (6 páginas)
          ...tiposImovel.map((tipo) => ({
            path: `/${tipo.plural}`,
            tags: {
              title: `${tipo.nome}s em Açailândia | ${imobiliariaData.nome}`,
              description: `Encontre ${tipo.nome.toLowerCase()}s em Açailândia MA. Diversas opções de ${tipo.nome.toLowerCase()}s para comprar ou alugar em todos os bairros com a ${imobiliariaData.nome}.`,
              keywords: [
                `${tipo.plural} Açailândia`,
                `${tipo.nome.toLowerCase()} Açailândia`,
                `comprar ${tipo.nome.toLowerCase()} Açailândia`,
                `alugar ${tipo.nome.toLowerCase()} Açailândia`,
                ...baseKeywords,
              ].join(", "),
              canonical: `${imobiliariaData.site}/${tipo.plural}`,
            },
          })),

          // PÁGINAS DE BAIRROS (41 páginas)
          ...bairrosAcilandia.map((bairro) => ({
            path: `/imoveis-${bairro.slug}-acailandia`,
            tags: {
              title: `Imóveis no ${bairro.nome} - Açailândia | ${imobiliariaData.nome}`,
              description: `Encontre casas, apartamentos e terrenos no ${bairro.nome}, ${bairro.descricao} em Açailândia MA. As melhores opções com a ${imobiliariaData.nome} - Sua imobiliária no Centro.`,
              keywords: [
                `imóveis ${bairro.nome} Açailândia`,
                `${bairro.nome} Açailândia imóveis`,
                `casa ${bairro.nome} Açailândia`,
                `apartamento ${bairro.nome} Açailândia`,
                `terreno ${bairro.nome} Açailândia`,
                `comprar imóvel ${bairro.nome}`,
                `alugar ${bairro.nome} Açailândia`,
                ...baseKeywords,
              ].join(", "),
              canonical: `${imobiliariaData.site}/imoveis-${bairro.slug}-acailandia`,
            },
          })),

          // PÁGINAS DE TIPO + BAIRRO (41 x 6 = 246 páginas)
          ...bairrosAcilandia.flatMap((bairro) =>
            tiposImovel.map((tipo) => ({
              path: `/${tipo.plural}-${bairro.slug}-acailandia`,
              tags: {
                title: `${tipo.nome}s no ${bairro.nome} - Açailândia | ${imobiliariaData.nome}`,
                description: `Encontre ${tipo.nome.toLowerCase()}s no ${bairro.nome}, ${bairro.descricao} em Açailândia. Confira as opções disponíveis com a ${imobiliariaData.nome}.`,
                keywords: [
                  `${tipo.plural} ${bairro.nome} Açailândia`,
                  `${tipo.nome.toLowerCase()} ${bairro.slug} Açailândia`,
                  `comprar ${tipo.nome.toLowerCase()} ${bairro.slug}`,
                  `alugar ${tipo.nome.toLowerCase()} ${bairro.slug}`,
                  `${tipo.plural} em Açailândia ${bairro.nome}`,
                  ...baseKeywords,
                ].join(", "),
                canonical: `${imobiliariaData.site}/${tipo.plural}-${bairro.slug}-acailandia`,
              },
            })),
          ),

          // PÁGINAS POR REGIÃO (4 regiões + 24 subtipos = 28 páginas)
          ...gerarRotasRegiao(),
        ];

        console.log(`✅ Total de páginas geradas: ${rotas.length}`);
        console.log(`📊 Detalhamento:`);
        console.log(`   - Home: 1`);
        console.log(`   - Páginas principais: 8`);
        console.log(`   - Tipos de imóveis: 6`);
        console.log(`   - Bairros: 41`);
        console.log(`   - Tipo + Bairro: 246`);
        console.log(`   - Regiões: 28`);
        console.log(`   - TOTAL: ${rotas.length} páginas`);

        return rotas;
      },
    }),

    // GERADOR DE SITEMAP - CORRIGIDO!
    sitemap({
      hostname: imobiliariaData.site,
      routes: async () => {
        const rotasBase = [
          "/",
          ...gerarRotasPrincipais().map((r) => r.path),
          ...tiposImovel.map((t) => `/${t.plural}`),
          ...bairrosAcilandia.map((b) => `/imoveis-${b.slug}-acailandia`),
          ...bairrosAcilandia.flatMap((b) =>
            tiposImovel.map((t) => `/${t.plural}-${b.slug}-acailandia`),
          ),
        ];

        // Adiciona rotas de região
        const regioes = ["nobre", "central", "novos-loteamentos", "populares"];
        regioes.forEach((regiao) => {
          rotasBase.push(`/imoveis-regiao-${regiao}-acailandia`);
          tiposImovel.forEach((tipo) => {
            rotasBase.push(`/${tipo.plural}-regiao-${regiao}-acailandia`);
          });
        });

        return [...new Set(rotasBase)];
      },
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
