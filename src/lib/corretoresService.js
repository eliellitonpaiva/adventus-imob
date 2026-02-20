// lib/corretoresService.js
// 👇 SÓ LIDA COM CORRETORES JÁ CONTRATADOS!

export const corretoresService = {
  // Criar corretor (chamado pelo candidatosService)
  async criarCorretor(dados) {
    return await supabase.from("corretores").insert([
      {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        status: dados.status, // "experiencia"
        data_contratacao: dados.data_contratacao,
        data_fim_experiencia: this.calcularFimExperiencia(90),
        // Herda histórico do processo seletivo!
        historico_contratacao: {
          feedback_entrevista: dados.historico_entrevista,
          nota_treinamento: dados.nota_treinamento,
          data_inicio_treinamento: dados.data_inicio_treinamento,
        },
      },
    ]);
  },

  // Buscar corretores ativos
  async listarAtivos() {
    return await supabase
      .from("corretores")
      .select(
        `
        *,
        vendas:vendas(count),
        visitas:visitas(count)
      `,
      )
      .in("status", ["experiencia", "ativo"]);
  },

  // Finalizar período de experiência (após 90 dias)
  async finalizarExperiencia(corretorId) {
    return await supabase
      .from("corretores")
      .update({
        status: "ativo",
        data_fim_experiencia: new Date(),
      })
      .eq("id", corretorId);
  },

  // Métricas do corretor (usado no dashboard)
  async buscarMetricas(corretorId) {
    return await supabase
      .from("corretor_estatisticas")
      .select("*")
      .eq("corretor_id", corretorId)
      .single();
  },
};
