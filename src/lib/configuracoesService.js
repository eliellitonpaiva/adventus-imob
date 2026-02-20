// src/lib/configuracoesService.js
import { supabase } from "./supabase";

export const configuracoesService = {
  // Buscar configurações atuais
  async getConfiguracoes() {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Erro ao buscar configurações:", error);
      return {
        dias_experiencia_padrao: 90,
        dias_experiencia_minimo: 30,
        dias_experiencia_maximo: 180,
        permite_avaliacao_antecipada: true,
      };
    }

    return data;
  },

  // Buscar apenas dias de experiência padrão
  async getDiasExperiencia() {
    const config = await this.getConfiguracoes();
    return config.dias_experiencia_padrao;
  },

  // Atualizar configurações (para o dono/gestor)
  async atualizarConfiguracoes(novasConfigs) {
    const { data, error } = await supabase
      .from("configuracoes")
      .update({
        ...novasConfigs,
        updated_at: new Date(),
      })
      .eq("id", 1)
      .select();

    if (error) throw error;
    return data;
  },
};
