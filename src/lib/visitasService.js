// lib/visitasService.js
import { supabase } from "./supabase";

export const visitasService = {
  // Buscar todas as visitas com dados do imóvel
  async listarVisitas() {
    try {
      console.log("🔍 Buscando visitas...");

      // Buscar as visitas com TODOS os campos
      const { data: visitas, error } = await supabase
        .from("visitas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("📦 Dados brutos do banco:", visitas);
      console.log(`📊 Encontradas ${visitas.length} visitas`);

      // Para cada visita, buscar os dados do imóvel
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

          // Buscar na tabela CORRETORES
          let corretor_nome = null;
          if (visita.corretor_id) {
            const { data: corretorData } = await supabase
              .from("corretores")
              .select("nome")
              .eq("id", visita.corretor_id)
              .maybeSingle();

            corretor_nome = corretorData?.nome || null;
            console.log(
              `👤 Corretor encontrado para visita ${visita.id}:`,
              corretor_nome,
            );
          }

          // 🔴 CORREÇÃO DAS DATAS: Adicionar 'Z' no final se não tiver
          const formatarDataBanco = (dataStr) => {
            if (!dataStr) return null;
            // Se já tem Z, mantém, se não, adiciona
            return dataStr.includes("Z") ? dataStr : dataStr + "Z";
          };

          return {
            id: visita.id,
            status: visita.status,
            nome_cliente: visita.nome_cliente || "Cliente",
            telefone: visita.telefone || "",
            email: visita.email || "",
            // ✅ DATAS CORRIGIDAS COM 'Z'
            data_visita: formatarDataBanco(visita.data_visita),
            created_at: formatarDataBanco(visita.created_at),
            dia_preferencia: visita.dia_preferencia,
            horario_preferencia: visita.horario_preferencia,
            lead_id: visita.lead_id,
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

      // Log para verificar as datas corrigidas
      console.log("📅 DATAS CORRIGIDAS - Primeira visita:", {
        created_at_original: visitas[0]?.created_at,
        created_at_corrigido: visitasFormatadas[0]?.created_at,
        data_visita_original: visitas[0]?.data_visita,
        data_visita_corrigido: visitasFormatadas[0]?.data_visita,
      });

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

      // Prepara os dados - AGORA COM lead_id!
      const insertData = {
        imovel_id: visitaData.imovel_id,
        lead_id: visitaData.lead_id,
        nome_cliente: visitaData.nome_cliente,
        telefone: visitaData.telefone,
        email: visitaData.email || null,
        dia_preferencia: visitaData.dia_preferencia,
        horario_preferencia: visitaData.horario_preferencia,
        status: "solicitada",
        corretor_id: null,
      };

      // Só adiciona data_visita se foi enviada
      if (visitaData.data_visita) {
        insertData.data_visita = visitaData.data_visita;
      }

      console.log("📦 Dados para insert:", insertData);

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

      if (!visitaId) throw new Error("visitaId é obrigatório");
      if (!corretorId) throw new Error("corretorId é obrigatório");

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
