// src/componentes/AvatarUpload/AvatarUpload.jsx
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext"; // ✅ ../../contexts
import { supabase } from "../../lib/supabase"; // ✅ ../../lib
import { CameraIcon } from "@heroicons/react/24/outline";

// Constantes de validação
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const AvatarUpload = ({
  userId,
  tipo = "corretores",
  currentAvatar,
  onUpload,
}) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [error, setError] = useState("");

  // Valida o arquivo antes do upload
  const validarArquivo = (file) => {
    // Valida tipo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Formato inválido. Use JPG, PNG ou WEBP");
      return false;
    }

    // Valida tamanho
    if (file.size > MAX_FILE_SIZE) {
      setError("Arquivo muito grande. Máximo 2MB");
      return false;
    }

    // Valida extensão
    const extension = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError("Extensão inválida. Use .jpg, .png ou .webp");
      return false;
    }

    return true;
  };

  // Remove avatar antigo do storage
  const removerAvatarAntigo = async (url) => {
    if (!url) return;

    try {
      // Extrai o nome do arquivo da URL
      const path = url.split("/").pop();
      if (path) {
        await supabase.storage.from("avatars").remove([path]);
      }
    } catch (error) {
      console.warn("Erro ao remover avatar antigo:", error);
      // Não bloqueia o fluxo se falhar
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      setError("");

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      // Valida o arquivo
      if (!validarArquivo(file)) {
        setUploading(false);
        return;
      }

      // 🔍 LOGS PARA DEBUG - COLOQUE AQUI
      console.log("📁 Arquivo selecionado:", {
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
      });

      console.log("👤 Usuário:", {
        id: userId,
        tipo: tipo,
      });

      const { data: userData } = await supabase.auth.getUser();
      console.log("👤 Usuário autenticado:", userData);

      // Verifica se o usuário está autenticado no Supabase Auth
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("🔑 Sessão Supabase:", sessionData);

      // Se não estiver autenticado, tenta usar a sessão do seu sistema
      if (!sessionData.session) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log("📦 Usuário do sistema:", user);

          // Tenta fazer login no Supabase Auth com as credenciais
          // Nota: Isso requer que o usuário exista no auth do Supabase
          const { error: signInError } = await supabase.auth.signInWithPassword(
            {
              email: user.email,
              password: "senha_do_usuario", // ⚠️ PRECISAMOS DA SENHA
            },
          );

          if (signInError) {
            console.warn(
              "Não foi possível autenticar no Supabase:",
              signInError,
            );
          }
        }
      }
      // Remove avatar antigo se existir
      if (avatarUrl) {
        await removerAvatarAntigo(avatarUrl);
      }

      // Gera nome único para o arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Organiza em pasta

      console.log("📤 Tentando upload para:", filePath);

      // Faz upload para o Storage
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      console.log("📥 Resposta do upload:", { uploadError, data });

      if (uploadError) throw uploadError;

      // Pega a URL pública
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Atualiza a URL no banco de dados
      const { error: updateError } = await supabase
        .from(tipo)
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Atualiza estado local
      setAvatarUrl(publicUrl);
      onUpload?.(publicUrl);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setError("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setUploading(false);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      event.target.value = "";
    }
  };

  return (
    <div className="relative group">
      {/* Avatar atual */}
      <div
        className={`
          relative w-24 h-24 rounded-full overflow-hidden border-4
          ${isDark ? "border-gray-700" : "border-gray-200"}
          ${error ? "border-red-500" : ""}
        `}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={() => {
              // Se a imagem falhar, mostra placeholder
              setAvatarUrl(null);
            }}
          />
        ) : (
          <div
            className={`
              w-full h-full flex items-center justify-center
              ${isDark ? "bg-gray-700" : "bg-gray-100"}
            `}
          >
            <CameraIcon
              className={`
                w-8 h-8
                ${isDark ? "text-gray-500" : "text-gray-400"}
              `}
            />
          </div>
        )}

        {/* Overlay de upload (aparece no hover) */}
        <label
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black bg-opacity-50 rounded-full
            opacity-0 group-hover:opacity-100
            cursor-pointer transition-opacity duration-200
            ${uploading ? "opacity-100" : ""}
          `}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
          {!uploading && <CameraIcon className="w-8 h-8 text-white" />}
        </label>

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="absolute mt-2 text-xs text-red-500 whitespace-nowrap">
          {error}
        </p>
      )}

      {/* Nome do arquivo (opcional, feedback visual) */}
      {!error && avatarUrl && (
        <p
          className={`mt-2 text-xs text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          Clique na foto para alterar
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;
