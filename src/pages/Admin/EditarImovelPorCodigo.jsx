// src/pages/Admin/EditarImovelPorCodigo.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const EditarImovelPorCodigo = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirecionar = async () => {
      const { data } = await supabase
        .from("imoveis")
        .select("id")
        .eq("codigo", codigo)
        .maybeSingle();

      if (data) {
        navigate(`/admin/imoveis/editar/${data.id}`);
      } else {
        navigate("/admin/imoveis");
      }
    };

    redirecionar();
  }, [codigo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default EditarImovelPorCodigo;
