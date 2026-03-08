// src/lib/candidatosService.js
import { supabase } from "./supabase";

export const candidatosService = {
  // Buscar candidatos por status
  async buscarPorStatus(status) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar candidatos ${status}:`, error);
      return [];
    }
  },

  // Buscar todos os candidatos
  async buscarTodos() {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar todos os candidatos:", error);
      return [];
    }
  },

  // Buscar candidato por ID
  async buscarPorId(id) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar candidato:", error);
      return null;
    }
  },

  // Criar novo candidato
  async criar(dados) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .insert([
          {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
            creci: dados.creci || null,
            status: "pendente",
            observacoes: dados.observacoes || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao criar candidato:", error);
      throw error;
    }
  },

  // Agendar entrevista
  async agendarEntrevista(candidatoId, dados) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .update({
          status: "entrevista",
          data_entrevista: dados.data,
          horario_entrevista: dados.horario,
          entrevistador: dados.entrevistador || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidatoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao agendar entrevista:", error);
      throw error;
    }
  },

  // Registrar feedback da entrevista (aprovação/reprovação)
  async registrarFeedbackEntrevista(candidatoId, feedback) {
    try {
      const updateData = {
        status: feedback.status,
        nota_entrevista: feedback.nota || null,
        updated_at: new Date().toISOString(),
      };

      // Se for reprovado, guarda o motivo
      if (feedback.status === "reprovado") {
        updateData.motivo_reprovacao = feedback.observacoes || "";
      }

      // Se for aprovado, avança para treinamento
      if (feedback.status === "aprovado") {
        updateData.status = "treinamento_aprovado";
        updateData.data_aprovacao = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("candidatos")
        .update(updateData)
        .eq("id", candidatoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao registrar feedback:", error);
      throw error;
    }
  },

  // Iniciar treinamento
  async iniciarTreinamento(candidatoId) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .update({
          status: "treinamento_andamento",
          data_inicio_treinamento: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidatoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao iniciar treinamento:", error);
      throw error;
    }
  },

  // Concluir treinamento (virar ativo)
  async concluirTreinamento(candidatoId) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .update({
          status: "ativo",
          data_conclusao_treinamento: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidatoId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao concluir treinamento:", error);
      throw error;
    }
  },

  // Atualizar candidato
  async atualizar(id, dados) {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .update({
          ...dados,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Erro ao atualizar candidato:", error);
      throw error;
    }
  },

  // Excluir candidato
  async excluir(id) {
    try {
      const { error } = await supabase.from("candidatos").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao excluir candidato:", error);
      throw error;
    }
  },

  // Buscar estatísticas (contagens por status)
  async buscarEstatisticas() {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .select("status");

      if (error) throw error;

      const stats = {
        pendentes: 0,
        entrevista: 0,
        treinamento_aprovado: 0,
        treinamento_andamento: 0,
        ativo: 0,
        reprovado: 0,
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
        pendentes: 0,
        entrevista: 0,
        treinamento_aprovado: 0,
        treinamento_andamento: 0,
        ativo: 0,
        reprovado: 0,
      };
    }
  },
};
