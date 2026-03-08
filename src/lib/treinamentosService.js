// src/lib/treinamentosService.js
import { supabase } from "./supabase";

export const treinamentosService = {
  // Buscar treinamento por candidato
  async buscarPorCandidato(candidatoId) {
    try {
      const { data, error } = await supabase
        .from("treinamentos")
        .select("*")
        .eq("candidato_id", candidatoId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar treinamento:", error);
      return null;
    }
  },

  // Iniciar treinamento (criar registro)
  async iniciarTreinamento(candidatoId) {
    try {
      const { data, error } = await supabase
        .from("treinamentos")
        .insert([
          {
            candidato_id: candidatoId,
            status: "nao_iniciado",
            progresso: 0,
            data_inicio: null,
            data_conclusao: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao iniciar treinamento:", error);
      throw error;
    }
  },

  // Começar treinamento (mudar status para em_andamento)
  async comecarTreinamento(treinamentoId) {
    try {
      const { data, error } = await supabase
        .from("treinamentos")
        .update({
          status: "em_andamento",
          data_inicio: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", treinamentoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao começar treinamento:", error);
      throw error;
    }
  },

  // Atualizar progresso do treinamento
  async atualizarProgresso(treinamentoId, progresso) {
    try {
      const updateData = {
        progresso,
        updated_at: new Date().toISOString(),
      };

      // Se chegou a 100%, marca como concluído
      if (progresso >= 100) {
        updateData.status = "concluido";
        updateData.data_conclusao = new Date().toISOString();
      } else if (progresso > 0) {
        updateData.status = "em_andamento";
      }

      const { data, error } = await supabase
        .from("treinamentos")
        .update(updateData)
        .eq("id", treinamentoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      throw error;
    }
  },

  // Concluir treinamento (forçar conclusão)
  async concluirTreinamento(treinamentoId) {
    try {
      const { data, error } = await supabase
        .from("treinamentos")
        .update({
          status: "concluido",
          progresso: 100,
          data_conclusao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", treinamentoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao concluir treinamento:", error);
      throw error;
    }
  },

  // Buscar todos os treinamentos
  async buscarTodos(filtros = {}) {
    try {
      let query = supabase
        .from("treinamentos")
        .select(
          `
          *,
          candidato:candidatos(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (filtros.status) {
        query = query.eq("status", filtros.status);
      }

      if (filtros.candidatoId) {
        query = query.eq("candidato_id", filtros.candidatoId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar treinamentos:", error);
      return [];
    }
  },

  // Buscar estatísticas de treinamentos
  async buscarEstatisticas() {
    try {
      const { data, error } = await supabase
        .from("treinamentos")
        .select("status");

      if (error) throw error;

      const stats = {
        nao_iniciado: 0,
        em_andamento: 0,
        concluido: 0,
        total: data.length,
      };

      data?.forEach((item) => {
        if (stats[item.status] !== undefined) {
          stats[item.status]++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return {
        nao_iniciado: 0,
        em_andamento: 0,
        concluido: 0,
        total: 0,
      };
    }
  },
};
