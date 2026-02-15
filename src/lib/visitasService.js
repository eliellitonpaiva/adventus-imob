// lib/visitasService.js
import { supabase } from "./supabase";

export const visitasService = {
  // Buscar todas as visitas com dados do imóvel
  async listarVisitas() {
    try {
      console.log("🔍 Buscando visitas...");

      // 1. Buscar as visitas com TODOS os campos (incluindo created_at)
      const { data: visitas, error } = await supabase
        .from("visitas")
        .select("*") // Isso garante que todos os campos, incluindo created_at, sejam retornados
        .order("created_at", { ascending: false }); // Ordena pela data de criação

      if (error) throw error;
      console.log("📦 Dados brutos do banco:", visitas); // 👈 ADICIONA AQUI
      console.log(`📊 Encontradas ${visitas.length} visitas`); // 👈 ADICIONA AQUI

      console.log(`📊 Encontradas ${visitas.length} visitas`);

      // 2. Para cada visita, buscar os dados do imóvel
      const visitasFormatadas = await Promise.all(
        visitas.map(async (visita) => {
          let imovel = null;

          if (visita.imovel_id) {
            const { data: imovelData } = await supabase
              .from("imoveis")
              .select(
                "codigo, endereco, bairro, tipo, quartos, suites, vagas, preco",
              )
              .eq("id", visita.imovel_id)
              .single();

            imovel = imovelData;
            if (imovel) {
              console.log(
                `🏠 Imóvel encontrado para visita ${visita.id}:`,
                imovel.codigo,
              );
            } else {
              console.log(`⚠️ Imóvel não encontrado para visita ${visita.id}`);
            }
          }

          // Buscar dados do corretor se houver corretor_id
          let corretor_nome = null;
          if (visita.corretor_id) {
            const { data: perfilData } = await supabase
              .from("perfis")
              .select("nome")
              .eq("id", visita.corretor_id)
              .maybeSingle();

            corretor_nome = perfilData?.nome || null;
            console.log(
              `👤 Corretor encontrado para visita ${visita.id}:`,
              corretor_nome,
            );
          }

          return {
            id: visita.id,
            status: visita.status,
            nome_cliente: visita.nome_cliente || "Cliente",
            telefone: visita.telefone || "",
            email: visita.email || "",
            data_visita: visita.data_visita,
            created_at: visita.created_at,
            dia_preferencia: visita.dia_preferencia, // 👈 ADICIONAR AQUI
            horario_preferencia: visita.horario_preferencia, // 👈 ADICIONAR AQUI
            corretor_id: visita.corretor_id,
            corretor_nome: corretor_nome,
            motivo_cancelamento: visita.motivo_cancelamento,
            resultado: visita.resultado,
            reagendado: visita.reagendado || false,
            imovel: imovel || {
              codigo: "Sem código",
              endereco: "Endereço não disponível",
              bairro: "Não informado",
              tipo: "Imóvel",
              quartos: 0,
              suites: 0,
              vagas: 0,
              preco: null,
            },
          };
        }),
      );

      console.log(`✅ ${visitasFormatadas.length} visitas formatadas`);
      return {
        data: visitasFormatadas,
        error: null,
        count: visitasFormatadas.length,
      };
    } catch (error) {
      console.error("❌ Erro ao listar visitas:", error);
      return { data: null, error };
    }
  },

  // Criar nova visita
  async criarVisita(visitaData) {
    try {
      console.log("➕ Criando nova visita:", visitaData);

      // Prepara os dados SEM data_visita (só adiciona se existir)
      const insertData = {
        imovel_id: visitaData.imovel_id,
        nome_cliente: visitaData.nome_cliente,
        telefone: visitaData.telefone,
        email: visitaData.email || null,
        dia_preferencia: visitaData.dia_preferencia,
        horario_preferencia: visitaData.horario_preferencia,
        status: "solicitada",
        corretor_id: null,
      };

      // Só adiciona data_visita se foi enviada (ex: quando corretor agenda)
      if (visitaData.data_visita) {
        insertData.data_visita = visitaData.data_visita;
      }

      const { data, error } = await supabase
        .from("visitas")
        .insert([insertData])
        .select();

      if (error) throw error;

      console.log("✅ Visita criada com sucesso:", data[0]);
      return { data: data[0], error: null };
    } catch (error) {
      console.error("❌ Erro ao criar visita:", error);
      return { data: null, error };
    }
  },

  // Buscar estatísticas
  async buscarEstatisticas() {
    try {
      console.log("📊 Buscando estatísticas...");

      const { data: visitas, error } = await supabase
        .from("visitas")
        .select("status, resultado");

      if (error) throw error;

      const stats = {
        total: visitas.length,
        porStatus: {
          solicitada: visitas.filter((v) => v.status === "solicitada").length,
          agendada: visitas.filter((v) => v.status === "agendada").length,
          confirmada: visitas.filter((v) => v.status === "confirmada").length,
          realizada: visitas.filter((v) => v.status === "realizada").length,
          cancelada: visitas.filter((v) => v.status === "cancelada").length,
        },
        resultados: {
          virou_proposta: visitas.filter(
            (v) => v.resultado === "virou_proposta",
          ).length,
          interessado: visitas.filter((v) => v.resultado === "interessado")
            .length,
          nao_interessado: visitas.filter(
            (v) => v.resultado === "nao_interessado",
          ).length,
          nao_compareceu: visitas.filter(
            (v) => v.resultado === "nao_compareceu",
          ).length,
          reagendar: visitas.filter((v) => v.resultado === "reagendar").length,
          sem_retorno: visitas.filter((v) => v.resultado === "sem_retorno")
            .length,
        },
      };

      const confirmadas = stats.porStatus.confirmada;
      const realizadas = stats.porStatus.realizada;
      const naoCompareceu = stats.resultados.nao_compareceu;
      const propostas = stats.resultados.virou_proposta;

      stats.taxas = {
        conversao:
          realizadas > 0 ? ((propostas / realizadas) * 100).toFixed(1) : 0,
        noShow:
          confirmadas > 0
            ? ((naoCompareceu / confirmadas) * 100).toFixed(1)
            : 0,
      };

      console.log("✅ Estatísticas calculadas:", stats);
      return { data: stats, error: null };
    } catch (error) {
      console.error("❌ Erro ao buscar estatísticas:", error);
      return { data: null, error };
    }
  },

  // Assumir visita
  async assumirVisita(visitaId, corretorId) {
    try {
      console.log("🟡 Service - Assumir visita:", { visitaId, corretorId });

      // Verificar se os parâmetros são válidos
      if (!visitaId) throw new Error("visitaId é obrigatório");
      if (!corretorId) throw new Error("corretorId é obrigatório");

      console.log("📦 Enviando update para Supabase...");

      const { data, error } = await supabase
        .from("visitas")
        .update({
          corretor_id: corretorId,
          status: "agendada",
        })
        .eq("id", visitaId)
        .select();

      if (error) {
        console.error("❌ Service - Erro Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("✅ Service - Sucesso:", data);
      return { data: data[0], error: null };
    } catch (error) {
      console.error("❌ Service - Erro ao assumir visita:", error);
      return { data: null, error };
    }
  },

  // Atualizar status
  async atualizarStatus(visitaId, novoStatus, dadosAdicionais = {}) {
    try {
      const updateData = {
        status: novoStatus,
        ...dadosAdicionais,
      };

      const { data, error } = await supabase
        .from("visitas")
        .update(updateData)
        .eq("id", visitaId)
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
      return { data: null, error };
    }
  },

  // Atualizar resultado
  async atualizarResultado(visitaId, resultado) {
    try {
      const { data, error } = await supabase
        .from("visitas")
        .update({ resultado })
        .eq("id", visitaId)
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error("❌ Erro ao atualizar resultado:", error);
      return { data: null, error };
    }
  },

  // Atualizar motivo de cancelamento
  async atualizarMotivoCancelamento(visitaId, motivo) {
    try {
      const { data, error } = await supabase
        .from("visitas")
        .update({ motivo_cancelamento: motivo })
        .eq("id", visitaId)
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error("❌ Erro ao atualizar motivo:", error);
      return { data: null, error };
    }
  },
};
