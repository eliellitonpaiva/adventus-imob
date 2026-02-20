// lib/relatoriosService.js
import { supabase } from "./supabase";

export const relatoriosService = {
  // ============================================
  // 1. FUNIL DE SELEÇÃO (quantos em cada etapa)
  // ============================================
  async funilSelecao(periodoInicio, periodoFim) {
    console.log("📊 Gerando funil de seleção");

    let query = supabase.from("candidatos").select("status, created_at");

    if (periodoInicio && periodoFim) {
      query = query
        .gte("created_at", periodoInicio)
        .lte("created_at", periodoFim);
    }

    const { data, error } = await query;

    if (error) throw error;

    const funil = {
      pendentes: data.filter((c) => c.status === "pendente").length,
      entrevistas: data.filter((c) => c.status === "entrevista").length,
      treinamentos: data.filter((c) => c.status === "em_treinamento").length,
      aprovados: data.filter((c) => c.status === "aprovado").length,
      reprovados: data.filter((c) => c.status === "reprovado").length,
      total: data.length,
    };

    // Taxas de conversão
    funil.taxa_aprovacao_entrevista =
      funil.entrevistas > 0
        ? Math.round((funil.treinamentos / funil.entrevistas) * 100)
        : 0;

    funil.taxa_conclusao_treinamento =
      funil.treinamentos > 0
        ? Math.round((funil.aprovados / funil.treinamentos) * 100)
        : 0;

    return funil;
  },

  // ============================================
  // 2. DESEMPENHO POR ENTREVISTADOR
  // ============================================
  async desempenhoEntrevistadores(periodoInicio, periodoFim) {
    console.log("📊 Analisando desempenho dos entrevistadores");

    let query = supabase
      .from("entrevistas")
      .select(
        `
        *,
        candidato:candidatos(*)
      `,
      )
      .eq("status", "realizada");

    if (periodoInicio && periodoFim) {
      query = query
        .gte("data_entrevista", periodoInicio)
        .lte("data_entrevista", periodoFim);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupa por entrevistador
    const desempenho = {};

    data.forEach((entrevista) => {
      if (!desempenho[entrevista.entrevistador]) {
        desempenho[entrevista.entrevistador] = {
          total_entrevistas: 0,
          soma_notas: 0,
          aprovados: 0,
          reprovados: 0,
          candidatos: [],
        };
      }

      const stats = desempenho[entrevista.entrevistador];
      stats.total_entrevistas++;
      stats.soma_notas += entrevista.nota || 0;

      if (entrevista.nota >= 7) {
        stats.aprovados++;
      } else {
        stats.reprovados++;
      }

      stats.candidatos.push({
        nome: entrevista.candidato?.nome,
        nota: entrevista.nota,
        data: entrevista.data_entrevista,
      });
    });

    // Calcula médias
    Object.keys(desempenho).forEach((key) => {
      const stats = desempenho[key];
      stats.media_nota = stats.soma_notas / stats.total_entrevistas;
      stats.taxa_aprovacao = Math.round(
        (stats.aprovados / stats.total_entrevistas) * 100,
      );
    });

    return desempenho;
  },

  // ============================================
  // 3. ANÁLISE DE REPROVAÇÕES
  // ============================================
  async analiseReprovacoes(periodoInicio, periodoFim) {
    console.log("📊 Analisando reprovações");

    let query = supabase.from("reprovacoes").select(`
        *,
        candidato:candidatos(*)
      `);

    if (periodoInicio && periodoFim) {
      query = query
        .gte("data_reprovacao", periodoInicio)
        .lte("data_reprovacao", periodoFim);
    }

    const { data, error } = await query.order("data_reprovacao", {
      ascending: false,
    });

    if (error) throw error;

    const analise = {
      total: data.length,
      por_etapa: {
        entrevista: data.filter((r) => r.etapa === "entrevista").length,
        treinamento: data.filter((r) => r.etapa === "treinamento").length,
      },
      principais_motivos: {},
      ultimas_reprovacoes: data.slice(0, 10),
    };

    // Conta motivos
    data.forEach((r) => {
      const motivo = r.motivo;
      analise.principais_motivos[motivo] =
        (analise.principais_motivos[motivo] || 0) + 1;
    });

    return analise;
  },

  // ============================================
  // 4. TEMPO MÉDIO DE TREINAMENTO
  // ============================================
  async tempoMedioTreinamento(periodoInicio, periodoFim) {
    console.log("📊 Calculando tempo médio de treinamento");

    let query = supabase
      .from("treinamentos")
      .select("data_inicio, data_conclusao, progresso")
      .eq("status", "concluido");

    if (periodoInicio && periodoFim) {
      query = query
        .gte("data_conclusao", periodoInicio)
        .lte("data_conclusao", periodoFim);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length === 0) {
      return { media_dias: 0, total_concluidos: 0 };
    }

    let totalDias = 0;
    data.forEach((t) => {
      if (t.data_inicio && t.data_conclusao) {
        const inicio = new Date(t.data_inicio);
        const fim = new Date(t.data_conclusao);
        const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
        totalDias += dias;
      }
    });

    return {
      media_dias: Math.round(totalDias / data.length),
      total_concluidos: data.length,
      periodo: { inicio: periodoInicio, fim: periodoFim },
    };
  },

  // ============================================
  // 5. PERFORMANCE PÓS-TREINAMENTO
  // ============================================
  async performancePosTreinamento() {
    console.log("📊 Correlacionando treinamento com performance");

    const { data, error } = await supabase
      .from("conversoes")
      .select(
        `
        *,
        corretor:corretores(*),
        treinamento:treinamentos(*),
        vendas:vendas(count),
        visitas:visitas(count)
      `,
      )
      .order("data_conversao", { ascending: false });

    if (error) throw error;

    const performance = {
      total_conversoes: data.length,
      com_vendas: data.filter((c) => c.vendas?.[0]?.count > 0).length,
      media_visitas: 0,
      melhor_desempenho: [],
      por_nota_treinamento: {},
    };

    let totalVisitas = 0;
    data.forEach((item) => {
      const visitas = item.visitas?.[0]?.count || 0;
      totalVisitas += visitas;

      // Agrupa por nota do treinamento (se tiver snapshot)
      if (item.snapshot?.nota_treinamento) {
        const nota = item.snapshot.nota_treinamento;
        if (!performance.por_nota_treinamento[nota]) {
          performance.por_nota_treinamento[nota] = {
            total: 0,
            total_vendas: 0,
          };
        }
        performance.por_nota_treinamento[nota].total++;
        performance.por_nota_treinamento[nota].total_vendas +=
          item.vendas?.[0]?.count || 0;
      }
    });

    performance.media_visitas =
      data.length > 0 ? Math.round(totalVisitas / data.length) : 0;

    return performance;
  },

  // ============================================
  // 6. DASHBOARD COMPLETO
  // ============================================
  async dashboard(periodoInicio, periodoFim) {
    console.log("📊 Gerando dashboard completo");

    try {
      const [funil, entrevistadores, reprovacoes, tempoMedio, performance] =
        await Promise.all([
          this.funilSelecao(periodoInicio, periodoFim),
          this.desempenhoEntrevistadores(periodoInicio, periodoFim),
          this.analiseReprovacoes(periodoInicio, periodoFim),
          this.tempoMedioTreinamento(periodoInicio, periodoFim),
          this.performancePosTreinamento(),
        ]);

      return {
        funil,
        entrevistadores,
        reprovacoes,
        tempoMedio,
        performance,
        periodo: {
          inicio: periodoInicio || "todo_periodo",
          fim: periodoFim || "todo_periodo",
        },
      };
    } catch (error) {
      console.error("Erro ao gerar dashboard:", error);
      throw error;
    }
  },
};
