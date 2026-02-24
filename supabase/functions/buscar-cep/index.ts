import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Responder a requisições OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const cep = url.pathname.split("/").pop() || "";

    console.log(`🔍 Buscando CEP: ${cep}`);

    // Validar CEP
    if (!cep || !/^\d{8}$/.test(cep)) {
      return new Response(JSON.stringify({ error: "CEP deve ter 8 dígitos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chamar ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const text = await response.text(); // Pegar como TEXTO primeiro

    console.log(`📥 Resposta bruta:`, text.substring(0, 100)); // Log dos primeiros 100 caracteres

    // Verificar se é HTML (erro do ViaCEP)
    if (text.trim().startsWith("<")) {
      console.log(`❌ ViaCEP retornou HTML, tentando novamente...`);

      // Tentar uma segunda vez com delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const retryResponse = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`,
      );
      const retryText = await retryResponse.text();

      if (retryText.trim().startsWith("<")) {
        return new Response(
          JSON.stringify({ error: "ViaCEP temporariamente indisponível" }),
          {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      // Se a segunda tentativa deu certo, processa o JSON
      const data = JSON.parse(retryText);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Se não é HTML, tenta fazer parse do JSON
    try {
      const data = JSON.parse(text);

      if (data.erro) {
        return new Response(JSON.stringify({ error: "CEP não encontrado" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error(`❌ Erro ao fazer parse do JSON:`, parseError);
      return new Response(
        JSON.stringify({ error: "Resposta inválida do ViaCEP" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error(`💥 Erro na função:`, error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao buscar CEP" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
