import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications deve ser usado dentro de NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState({
    imoveis: 0,
    corretores: 0,
    leads: 0,
    visitas: 0,
    contratos: 0,
    empreendimentos: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);

      // Verifica se o Supabase está configurado
      if (!supabase) {
        console.warn("Supabase não configurado. Usando dados mockados.");
        setNotificacoes({
          imoveis: 5,
          corretores: 2,
          leads: 12,
          visitas: 3,
          contratos: 1,
          empreendimentos: 0,
        });
        return;
      }

      // 🔥 IMÓVEIS - contar apenas os NÃO VISUALIZADOS
      const { count: imoveisCount, error: imoveisError } = await supabase
        .from("imoveis")
        .select("*", { count: "exact", head: true })
        .eq("visualizado", false);

      if (imoveisError) {
        console.error("Erro ao buscar imóveis:", imoveisError);
      }

      // 🔥 CORRETORES - usando 'etapa' com valor 'pendentes'
      const { count: corretoresCount, error: corretoresError } = await supabase
        .from("corretores")
        .select("*", { count: "exact", head: true })
        .eq("etapa", "pendentes");

      if (corretoresError) {
        console.error("Erro ao buscar corretores:", corretoresError);
      }

      // 🔥 VISITAS - contando apenas as SOLICITADAS (novas)
      const { count: visitasCount, error: visitasError } = await supabase
        .from("visitas")
        .select("*", { count: "exact", head: true })
        .eq("status", "solicitada");

      if (visitasError) {
        console.error("Erro ao buscar visitas:", visitasError);
      }

      // 🔥 LEADS - não lidos
      const { count: leadsCount, error: leadsError } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "nao_lido");

      if (leadsError) {
        console.error("Erro ao buscar leads:", leadsError);
      }

      // 🔥 CONTRATOS - COMPLETAMENTE SILENCIADO (não mostra erro nenhum)
      let contratosCount = 0;
      // Tabela contratos não existe ainda - mantém 0 sem tentar buscar

      // 🔥 EMPREENDIMENTOS - usando tabela EDIFICIOS
      let empreendimentosCount = 0;
      try {
        const { count, error: edificiosError } = await supabase
          .from("edificios")
          .select("*", { count: "exact", head: true });

        if (!edificiosError) {
          empreendimentosCount = count || 0;
        }
      } catch (e) {
        // Ignora qualquer erro da tabela edificios
      }

      setNotificacoes({
        imoveis: imoveisCount || 0,
        corretores: corretoresCount || 0,
        leads: leadsCount || 0,
        visitas: visitasCount || 0,
        contratos: contratosCount || 0,
        empreendimentos: empreendimentosCount || 0,
      });

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      setError("Falha ao carregar notificações");

      // Fallback para dados mock
      setNotificacoes({
        imoveis: 5,
        corretores: 2,
        leads: 12,
        visitas: 3,
        contratos: 1,
        empreendimentos: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar contador específico
  const atualizarContador = (tipo, valor) => {
    setNotificacoes((prev) => ({
      ...prev,
      [tipo]: valor,
    }));
  };

  // Incrementar contador
  const incrementarContador = (tipo) => {
    setNotificacoes((prev) => ({
      ...prev,
      [tipo]: prev[tipo] + 1,
    }));
  };

  // Decrementar contador
  const decrementarContador = (tipo) => {
    setNotificacoes((prev) => ({
      ...prev,
      [tipo]: Math.max(0, prev[tipo] - 1),
    }));
  };

  // Configurar inscrição em tempo real
  useEffect(() => {
    if (!supabase) return;

    // Inscrever para mudanças em imóveis
    const imoveisSubscription = supabase
      .channel("imoveis-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "imoveis" },
        (payload) => {
          console.log("🔔 Novo imóvel detectado:", payload.new);
          incrementarContador("imoveis");
        },
      )
      .subscribe();

    // Inscrever para mudanças em leads
    const leadsSubscription = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        () => {
          console.log("🔔 Novo lead detectado!");
          incrementarContador("leads");
        },
      )
      .subscribe();

    // Inscrever para mudanças em corretores
    const corretoresSubscription = supabase
      .channel("corretores-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "corretores" },
        (payload) => {
          console.log("🔔 Novo corretor detectado:", payload.new);
          if (payload.new.etapa === "pendentes") {
            incrementarContador("corretores");
          }
        },
      )
      .subscribe();

    // Inscrever para mudanças em visitas
    const visitasSubscription = supabase
      .channel("visitas-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visitas" },
        (payload) => {
          console.log("🔔 Nova visita detectada:", payload.new);
          if (payload.new.status === "solicitada") {
            incrementarContador("visitas");
          }
        },
      )
      .subscribe();

    // 🔥 INSCREVER PARA MUDANÇAS EM EDIFICIOS (empreendimentos)
    const edificiosSubscription = supabase
      .channel("edificios-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "edificios" },
        (payload) => {
          console.log(
            "🔔 Novo empreendimento/edifício detectado:",
            payload.new,
          );
          incrementarContador("empreendimentos");
        },
      )
      .subscribe();

    // 🔥 CONTRATOS - Subscription desativada (tabela não existe)
    // const contratosSubscription = ...

    // Cleanup subscriptions
    return () => {
      imoveisSubscription.unsubscribe();
      leadsSubscription.unsubscribe();
      corretoresSubscription.unsubscribe();
      visitasSubscription.unsubscribe();
      edificiosSubscription.unsubscribe();
    };
  }, []);

  // Carrega notificações ao iniciar
  useEffect(() => {
    carregarNotificacoes();

    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificacoes,
        loading,
        error,
        carregarNotificacoes,
        atualizarContador,
        incrementarContador,
        decrementarContador,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
