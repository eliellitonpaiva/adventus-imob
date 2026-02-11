// src/lib/supabase.js - VERSÃO CORRIGIDA
import { createClient } from "@supabase/supabase-js";

// 1. Tenta obter as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Log para DEBUG (mostra se as variáveis foram carregadas, mas NÃO PARA a execução)
console.log(
  "[DEBUG] VITE_SUPABASE_URL carregada?",
  supabaseUrl ? "✅ SIM" : "❌ NÃO",
);
console.log(
  "[DEBUG] VITE_SUPABASE_ANON_KEY carregada?",
  supabaseAnonKey ? "✅ SIM" : "❌ NÃO",
);

// 3. Cria o cliente APENAS se ambas as variáveis existirem
let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("[DEBUG] Cliente Supabase criado com sucesso.");
} else {
  // Se faltar alguma variável, 'supabase' será undefined.
  // O erro será lançado apenas quando tentarmos USAR o cliente, não na criação.
  console.warn(
    "[AVISO] Cliente Supabase NÃO criado. Verifique suas variáveis de ambiente (.env).",
  );
}

// 4. Exporta o cliente (pode ser `undefined` se a criação falhou)
export { supabase };
