// E:\DEV\react\adventus-imob\src\pages\Admin\EditarImovel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  TagIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  SunIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  BoltIcon,
  SparklesIcon,
  HeartIcon,
  CubeTransparentIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  PlusIcon,
  CameraIcon,
  StarIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

// Componentes de drag-and-drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Componente SortableItem para as fotos
const SortableItem = ({
  id,
  url,
  isCapa,
  onSetCapa,
  onRemove,
  index,
  isDark,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getIconColorClass = () =>
    isDark ? "text-[#D4A24D]" : "text-[#D4A24D]";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group rounded-lg border-2 overflow-hidden ${isCapa ? "border-[#D4A24D]" : getBorderClass()} ${isDragging ? "shadow-xl cursor-grabbing" : "cursor-grab"} transition-all hover:shadow-lg`}
    >
      <div className="aspect-square relative">
        <img
          src={url}
          alt={`Foto ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Overlay com ações */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetCapa(id);
            }}
            className={`p-2 rounded-full ${isCapa ? "bg-[#D4A24D] text-white" : "bg-white/90 hover:bg-white text-gray-700"} transition-colors`}
            title={isCapa ? "Foto de capa" : "Definir como capa"}
          >
            {isCapa ? (
              <StarIconSolid className="w-5 h-5" />
            ) : (
              <StarIcon className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className="p-2 rounded-full bg-red-500/90 hover:bg-red-600 text-white transition-colors"
            title="Remover foto"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Badge de ordem */}
        <div
          className={`absolute top-2 left-2 ${isCapa ? "bg-[#D4A24D]" : "bg-black/70"} text-white text-xs font-bold px-2 py-1 rounded-full`}
        >
          {isCapa ? "⭐ CAPA" : `#${index + 1}`}
        </div>

        {/* Badge de arrastar */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const EditarImovel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // =============== ESTADO DAS FOTOS ===============
  const [fotos, setFotos] = useState([]);
  const [uploadingFotos, setUploadingFotos] = useState(false);
  const [fotosError, setFotosError] = useState("");
  const [fotosCarregadas, setFotosCarregadas] = useState(false);

  // Configuração dos sensores para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // =============== FUNÇÕES DO GERENCIADOR DE FOTOS ===============
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        return newItems.map((item, index) => ({
          ...item,
          ordem: index,
        }));
      });
    }
  };

  const handleSetCapa = (fotoId) => {
    setFotos((items) => {
      const fotoClicada = items.find((f) => f.id === fotoId);
      const semFotoClicada = items.filter((f) => f.id !== fotoId);

      const novasFotos = [fotoClicada, ...semFotoClicada].map(
        (item, index) => ({
          ...item,
          ordem: index,
          isCapa: index === 0,
        }),
      );

      return novasFotos;
    });
  };

  const handleRemoveFoto = (fotoId) => {
    setFotos((items) => {
      const novasFotos = items
        .filter((f) => f.id !== fotoId)
        .map((item, index) => ({
          ...item,
          ordem: index,
          isCapa: index === 0,
        }));
      return novasFotos;
    });
  };

  const handleUploadFotos = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if (fotos.length + files.length > 20) {
      setFotosError("Máximo de 20 fotos permitidas");
      return;
    }

    setUploadingFotos(true);
    setFotosError("");

    try {
      const uploadPromises = files.map(async (file, index) => {
        if (!file.type.startsWith("image/")) {
          throw new Error("Apenas imagens são permitidas");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Imagem muito grande. Máximo 5MB");
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `imoveis/temp/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("imoveis")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("imoveis").getPublicUrl(filePath);

        return {
          id: `temp-${Date.now()}-${index}`,
          url: publicUrl,
          path: filePath,
          file: file,
          ordem: fotos.length + index,
          isCapa: fotos.length === 0 && index === 0,
        };
      });

      const novasFotos = await Promise.all(uploadPromises);

      setFotos((prev) => {
        const todasFotos = [...prev, ...novasFotos];
        const temCapa = todasFotos.some((f) => f.isCapa);
        if (!temCapa && todasFotos.length > 0) {
          todasFotos[0].isCapa = true;
        }
        return todasFotos;
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      setFotosError(error.message || "Erro ao fazer upload das fotos");
    } finally {
      setUploadingFotos(false);
      event.target.value = "";
    }
  };

  // =============== CARREGAR FOTOS DO IMÓVEL ===============
  const carregarFotos = async (imovelId) => {
    try {
      const { data, error } = await supabase
        .from("fotos_imovel")
        .select("*")
        .eq("imovel_id", imovelId)
        .order("ordem", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const fotosFormatadas = data.map((foto) => ({
          id: foto.id,
          url: foto.url,
          path: null,
          ordem: foto.ordem,
          isCapa: foto.is_capa,
          existing: true,
        }));
        setFotos(fotosFormatadas);
      }
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    } finally {
      setFotosCarregadas(true);
    }
  };

  // =============== BUSCAR EMPREENDIMENTOS ===============
  const [empreendimentos, setEmpreendimentos] = useState([]);

  // =============== ESTADO DO FORMULÁRIO ===============
  const [formData, setFormData] = useState({
    codigo: "",
    titulo: "",
    finalidade: { venda: true, aluguel: false },
    tipo: "",
    preco: "",
    status: "disponivel",
    financiado: false,
    emCondominio: false,
    proprietarioId: "",
    corretorId: "",
    ocultarPreco: false,
    empreendimento_id: "",
    unidade: "",
    andar: "",
    lote: "",
    bloco: "",
    quadra: "",
    dependencias: {
      dormitorios: "",
      banheiros: "",
      suites: "",
      vagas: "",
      area_total: "",
      area_construida: "",
    },

    // 👇 ADICIONAR AQUI (depois de dependencias)
    precoAnterior: "", // Preço anterior para quando o imóvel baixou de preço

    // LOCALIZAÇÃO SIMPLIFICADA
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    exibirEnderecoSite: false,

    // ETIQUETAS DA VITRINE
    etiquetas: {
      destaqueSemana: false,
      novoSite: false,
      baixouPreco: false,
      financiável: false,
    },
    caracteristicas: {
      areaUtil: "",
      areaPrivativa: "",
      frenteTerreno: "",
      fundo: "",
      lateralEsquerda: "",
      lateralDireita: "",
      peDireito: "",
      topografia: "",
      esquina: false,
      tipoConstrucao: "",
      anoConstrucao: "",
      reformadoRecentemente: false,
      numeroPavimentos: "",
      imovelAverbado: false,
      financiavel: false,
      aceitaPermuta: false,
      tipoIluminacao: "",
      tipoTelhado: "",
      forroLaje: false,
      sistemaEletricoNovo: false,
      caixaDAgua: "",
      sistemaEsgoto: "",
      aquecimentoAgua: "",
      posicaoSolar: "",
      ventilacaoCruzada: false,
      vistaLivre: false,
      vistaPermanente: false,
      ruaSemSaida: false,
      esquinaInfo: false,
      condominioTaxaMensal: "",
    },
    infraestrutura: {
      agua: false,
      energia: false,
      esgoto: false,
      internet: false,
      gas: false,
      piscina: false,
      churrasqueira: false,
      academia: false,
      salaoFestas: false,
      playground: false,
      portaoEletronico: false,
      interfone: false,
      cameraSeguranca: false,
      alarme: false,
    },
    acabamentos: {
      pisoPorcelanato: false,
      pisoCeramica: false,
      pisoLaminado: false,
      pisoVinilico: false,
      pisoMadeiraMaciça: false,
      pisoTaco: false,
      pisoCimentoQueimado: false,
      pisoMarmore: false,
      pisoGranito: false,
      pisoFrio: false,
      revestimentoAzulejo: false,
      revestimentoPastilha: false,
      revestimentoPorcelanato: false,
      revestimentoPedraNatural: false,
      revestimentoPapelParede: false,
      revestimento3D: false,
      tetoGessoRebaixado: false,
      tetoSancaGesso: false,
      tetoForroPVC: false,
      tetoLaje: false,
      portaMadeiraMaciça: false,
      portaLaqueada: false,
      esquadriaAluminio: false,
      esquadriaPVC: false,
      portaPivotante: false,
      bancadaGranito: false,
      bancadaMarmore: false,
      bancadaQuartzo: false,
      bancadaNanoglass: false,
      piso: "",
      azulejo: "",
      porta: "",
      janela: "",
      forro: "",
      armarioCozinha: false,
      armarioBanheiro: false,
      banheira: false,
      boxVidro: false,
      varanda: false,
      sacada: false,
      lavabo: false,
      dependenciaEmpregada: false,
    },
    areaLazer: {
      piscina: false,
      churrasqueira: false,
      espacoGourmet: false,
      salaoFestas: false,
      salaoJogos: false,
      academia: false,
      playground: false,
      quadraPoliesportiva: false,
      campoSociety: false,
      areaVerde: false,
      jardim: false,
      deck: false,
      rooftop: false,
      sauna: false,
      espacoPet: false,
      brinquedoteca: false,
    },
    localizacaoVizinhanca: {
      proximoCentro: false,
      proximoSupermercado: false,
      proximoEscola: false,
      proximoHospital: false,
      proximoFarmacia: false,
      proximoOnibus: false,
      proximoShopping: false,
      proximoFaculdade: false,
      bairroResidencial: false,
      bairroComercial: false,
      ruaAsfaltada: false,
      ruaTranquila: false,
      regiaoValorizada: false,
    },
    seguranca: {
      portaoEletronico: false,
      interfone: false,
      cercaEletrica: false,
      sistemaCameras: false,
      alarme: false,
      portaria24h: false,
      vigilancia24h: false,
      controleAcesso: false,
      fechaduraDigital: false,
      condominioFechado: false,
      murosAltos: false,
    },
    armariosArmazenamento: {
      armarioCozinhaPlanejado: false,
      armariosEmbutidos: false,
      armariosQuarto: false,
      armariosBanheiro: false,
      closet: false,
      despensa: false,
      deposito: false,
      roupeiro: false,
      maleiro: false,
    },
    servicosUtilidades: {
      aguaEncanada: false,
      energiaEletrica: false,
      pocoArtesiano: false,
      aquecimentoGas: false,
      aquecimentoSolar: false,
      gasEncanado: false,
      arCondicionadoInstalado: false,
      infraArCondicionado: false,
      internetFibra: false,
      iluminacaoLED: false,
      energiaSolar: false,
      elevador: false,
      coletaLixo: false,
    },
    diferenciais: {
      varanda: false,
      sacada: false,
      lavabo: false,
      banheira: false,
      boxVidro: false,
      dependenciaEmpregada: false,
      escritorio: false,
      peDireitoDuplo: false,
      mezanino: false,
      vistaPanoramica: false,
    },
    descricao: "",
    observacoes: "",
    iptu_anual: "",
  });

  // =============== CARREGAR DADOS DO IMÓVEL ===============
  useEffect(() => {
    carregarImovel();
    carregarEmpreendimentos();
  }, [id]);

  const carregarImovel = async () => {
    try {
      setLoadingDados(true);
      const { data, error } = await supabase
        .from("imoveis")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        codigo: data.codigo || "",
        titulo: data.titulo || "",
        finalidade: {
          venda: data.finalidade_venda || false,
          aluguel: data.finalidade_aluguel || false,
        },
        tipo: data.tipo || "",
        preco: data.preco || "",
        status: data.status || "disponivel",
        financiado: data.financiado || false,
        emCondominio: data.em_condominio || false,
        proprietarioId: data.proprietario_id || "",
        corretorId: data.corretor_id || "",
        ocultarPreco: data.ocultar_preco || false,
        empreendimento_id: data.id_edificios || "",
        unidade: data.unidade || "",
        andar: data.andar || "",
        lote: data.lote || "",
        bloco: data.bloco || "",
        quadra: data.quadra || "",
        dependencias: {
          dormitorios: data.quartos || "",
          banheiros: data.banheiros || "",
          suites: data.suites || "",
          vagas: data.vagas || "",
          area_total: data.area_total || "",
          area_construida: data.area_construida || "",
        },
        // 👇 ADICIONAR ESTA LINHA (carrega o preço anterior do banco)
        precoAnterior: data.preco_anterior || "",

        cep: data.cep || "",
        endereco: data.endereco || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
        exibirEnderecoSite: data.exibir_endereco_site || false,
        etiquetas: data.etiquetas || {
          destaqueSemana: false,
          novoSite: false,
          baixouPreco: false,
          financiável: false,
        },
        caracteristicas: data.caracteristicas || {
          areaUtil: "",
          areaPrivativa: "",
          frenteTerreno: "",
          fundo: "",
          lateralEsquerda: "",
          lateralDireita: "",
          peDireito: "",
          topografia: "",
          esquina: false,
          tipoConstrucao: "",
          anoConstrucao: "",
          reformadoRecentemente: false,
          numeroPavimentos: "",
          imovelAverbado: false,
          financiavel: false,
          aceitaPermuta: false,
          tipoIluminacao: "",
          tipoTelhado: "",
          forroLaje: false,
          sistemaEletricoNovo: false,
          caixaDAgua: "",
          sistemaEsgoto: "",
          aquecimentoAgua: "",
          posicaoSolar: "",
          ventilacaoCruzada: false,
          vistaLivre: false,
          vistaPermanente: false,
          ruaSemSaida: false,
          esquinaInfo: false,
          condominioTaxaMensal: "",
        },
        infraestrutura: data.infraestrutura || {},
        acabamentos: data.acabamentos || {},
        areaLazer: data.area_lazer || {},
        localizacaoVizinhanca: data.localizacao_vizinhanca || {},
        seguranca: data.seguranca || {},
        armariosArmazenamento: data.armarios_armazenamento || {},
        servicosUtilidades: data.servicos_utilidades || {},
        diferenciais: data.diferenciais || {},
        descricao: data.descricao || "",
        observacoes: data.observacoes || "",
        iptu_anual: data.iptu_anual || "",
      });

      await carregarFotos(id);
    } catch (error) {
      console.error("Erro ao carregar imóvel:", error);
      setSubmitMessage({
        type: "error",
        text: "Erro ao carregar dados do imóvel. Tente novamente.",
      });
    } finally {
      setLoadingDados(false);
    }
  };

  // =============== CARREGAR EMPREENDIMENTOS ===============
  const carregarEmpreendimentos = async () => {
    const { data } = await supabase
      .from("edificios")
      .select("id, nome, tipo, bairro, cidade")
      .order("nome");
    setEmpreendimentos(data || []);
  };

  // =============== FUNÇÕES DE BUSCA CEP ===============
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepError("CEP deve ter 8 dígitos");
      return;
    }
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      if (!response.ok) throw new Error("Erro na resposta da API");
      const data = await response.json();
      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        complemento: data.complemento || prev.complemento,
      }));
    } catch (error) {
      setCepError("Erro ao buscar CEP. Verifique a conexão.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, cep: value }));
    const cepLimpo = value.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarCep(value);
    } else {
      setCepError("");
    }
  };

  // =============== HANDLERS ===============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // =============== CONTROLE DOS ACCORDIONS ===============
  const [accordionOpen, setAccordionOpen] = useState({
    caracteristicas: false,
    acabamentos: false,
    areaLazer: false,
    localizacaoVizinhanca: false,
    seguranca: false,
    armariosArmazenamento: false,
    servicosUtilidades: false,
    diferenciais: false,
  });

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =============== SUBMIT ===============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage({ type: "", text: "" });

    const dadosParaSupabase = {
      codigo: formData.codigo,
      titulo: formData.titulo,
      finalidade_venda: formData.finalidade.venda,
      finalidade_aluguel: formData.finalidade.aluguel,
      tipo: formData.tipo,
      preco: formData.preco ? parseFloat(formData.preco) : null,
      status: formData.status,
      financiado: formData.financiado,
      em_condominio: formData.emCondominio,
      proprietario_id: formData.proprietarioId || null,
      corretor_id: formData.corretorId || null,
      ocultar_preco: formData.ocultarPreco,
      id_edificios: formData.empreendimento_id || null,
      unidade: formData.unidade || "",
      andar: formData.andar ? parseInt(formData.andar) : 0,
      lote: formData.lote || "",
      bloco: formData.bloco || "",
      quadra: formData.quadra || "",
      quartos: parseInt(formData.dependencias.dormitorios) || 0,
      suites: parseInt(formData.dependencias.suites) || 0,
      banheiros: parseInt(formData.dependencias.banheiros) || 0,
      vagas: parseInt(formData.dependencias.vagas) || 1,
      area_total: parseFloat(formData.dependencias.area_total) || 0,
      area_construida: parseFloat(formData.dependencias.area_construida) || 0,
      area_privativa: parseFloat(formData.caracteristicas.areaPrivativa) || 0,
      condominio_mensal:
        parseFloat(formData.caracteristicas.condominioTaxaMensal) || 0,
      iptu_anual: parseFloat(formData.iptu_anual) || 0,
      data_disponibilidade: null,
      cep: formData.cep || "",
      endereco: formData.endereco || "",
      numero: formData.numero || "",
      complemento: formData.complemento || "",
      bairro: formData.bairro || "",
      cidade: formData.cidade || "",
      estado: formData.estado || "",
      exibir_endereco_site: formData.exibirEnderecoSite || false,

      // 👇 NOVA LINHA: preço anterior (só envia se tiver valor, senão manda null)
      preco_anterior: formData.precoAnterior
        ? parseFloat(formData.precoAnterior)
        : null,

      etiquetas: formData.etiquetas,
      caracteristicas: {
        ...formData.caracteristicas,
        areaUtil: formData.caracteristicas.areaUtil
          ? parseFloat(formData.caracteristicas.areaUtil)
          : 0,
        areaPrivativa: formData.caracteristicas.areaPrivativa
          ? parseFloat(formData.caracteristicas.areaPrivativa)
          : 0,
        anoConstrucao: formData.caracteristicas.anoConstrucao
          ? parseInt(formData.caracteristicas.anoConstrucao)
          : null,
        numeroPavimentos: formData.caracteristicas.numeroPavimentos
          ? parseInt(formData.caracteristicas.numeroPavimentos)
          : 0,
        caixaDAgua: formData.caracteristicas.caixaDAgua
          ? parseInt(formData.caracteristicas.caixaDAgua)
          : 0,
        condominioTaxaMensal: formData.caracteristicas.condominioTaxaMensal
          ? parseFloat(formData.caracteristicas.condominioTaxaMensal)
          : 0,
      },
      infraestrutura: formData.infraestrutura || {},
      acabamentos: formData.acabamentos || {},
      area_lazer: formData.areaLazer || {},
      localizacao_vizinhanca: formData.localizacaoVizinhanca || {},
      seguranca: formData.seguranca || {},
      armarios_armazenamento: formData.armariosArmazenamento || {},
      servicos_utilidades: formData.servicosUtilidades || {},
      diferenciais: formData.diferenciais || {},
      dependencias: {
        dormitorios: formData.dependencias.dormitorios || 0,
        banheiros: formData.dependencias.banheiros || 0,
        suites: formData.dependencias.suites || 0,
        vagas: formData.dependencias.vagas || 0,
        area_total: formData.dependencias.area_total || 0,
        area_construida: formData.dependencias.area_construida || 0,
      },
      updated_at: new Date(),
    };

    try {
      const { error } = await supabase
        .from("imoveis")
        .update(dadosParaSupabase)
        .eq("id", id);

      if (error) throw error;

      // =============== ATUALIZAR FOTOS ===============
      try {
        // Deletar fotos antigas
        console.log("🗑️ Deletando fotos antigas do imóvel:", id);

        const { error: deleteError } = await supabase
          .from("fotos_imovel")
          .delete()
          .eq("imovel_id", id);

        if (deleteError) throw deleteError;

        // Se NÃO TEM fotos novas, para por aqui
        if (fotos.length === 0) {
          console.log("📸 Nenhuma foto para salvar");
          return;
        }

        // Inserir as novas fotos
        console.log(`📸 Preparando ${fotos.length} novas fotos`);

        const fotosParaInserir = await Promise.all(
          fotos.map(async (foto, index) => {
            if (foto.id.startsWith("temp-") && foto.file) {
              const newPath = `imoveis/${id}/${foto.file.name}`;

              await supabase.storage.from("imoveis").move(foto.path, newPath);

              const {
                data: { publicUrl },
              } = supabase.storage.from("imoveis").getPublicUrl(newPath);

              return {
                imovel_id: id,
                url: publicUrl,
                ordem: index,
                is_capa: foto.isCapa,
              };
            }

            return {
              imovel_id: id,
              url: foto.url,
              ordem: index,
              is_capa: foto.isCapa,
            };
          }),
        );

        if (fotosParaInserir.length > 0) {
          const { error: insertError } = await supabase
            .from("fotos_imovel")
            .insert(fotosParaInserir);

          if (insertError) throw insertError;
          console.log(`✅ ${fotosParaInserir.length} fotos salvas`);
        }
      } catch (fotoError) {
        console.error("💥 Erro nas fotos:", fotoError);
        throw fotoError;
      }

      setSubmitMessage({
        type: "success",
        text: `Imóvel "${formData.titulo}" atualizado com sucesso!`,
      });

      setTimeout(() => {
        navigate("/admin/imoveis");
      }, 2000);
    } catch (error) {
      console.error("Erro detalhado:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Tem certeza que deseja cancelar? As alterações serão perdidas.",
      )
    ) {
      navigate("/admin/imoveis");
    }
  };

  // =============== FUNÇÕES DE CORES (TEMA) ===============
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getHoverBgClass = () =>
    isDark ? "hover:bg-gray-800" : "hover:bg-white";
  const getInputBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getInputBorderClass = () =>
    isDark ? "border-gray-700" : "border-gray-300";
  const getInputTextClass = () => (isDark ? "text-gray-200" : "text-gray-900");
  const getPlaceholderClass = () =>
    isDark ? "placeholder-gray-500" : "placeholder-gray-500";
  const getCheckboxBorderClass = () =>
    isDark ? "border-gray-600" : "border-gray-300";
  const getIconBgClass = () => (isDark ? "bg-[#D4A24D]/20" : "bg-[#D4A24D]/10");
  const getIconColorClass = () =>
    isDark ? "text-[#D4A24D]" : "text-[#D4A24D]";
  const getAccordionTitleClass = () =>
    isDark ? "text-gray-100" : "text-gray-800";
  const getAccordionSubtitleClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getCounterButtonClass = () =>
    isDark
      ? "bg-gray-900 border-gray-600 hover:bg-gray-700 text-gray-300"
      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700";
  const getCounterInputClass = () =>
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-200"
      : "bg-white border-gray-300 text-gray-900";
  const getOptionBgClass = () => (isDark ? "bg-gray-800" : "bg-white");

  // =============== OPÇÕES PARA SELECTS ===============
  const tiposImovel = [
    { value: "apartamento", label: "Apartamento" },
    { value: "casa", label: "Casa" },
    { value: "terreno", label: "Terreno" },
    { value: "comercial", label: "Comercial" },
    { value: "sobrado", label: "Sobrado" },
    { value: "kitnet", label: "Kitnet" },
    { value: "fazenda", label: "Fazenda" },
    { value: "chacara", label: "Chácara" },
    { value: "sitio", label: "Sítio" },
    { value: "galpao", label: "Galpão" },
  ];

  const estadosBrasil = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  const proprietarios = [
    { id: "1", nome: "Maria Silva" },
    { id: "2", nome: "João Santos" },
    { id: "3", nome: "Ana Oliveira" },
  ];

  const corretores = [
    { id: "101", nome: "Carlos Souza" },
    { id: "102", nome: "Ana Pereira" },
    { id: "103", nome: "Roberto Lima" },
  ];

  const getStatusColor = (status) => {
    const baseColors = {
      disponivel: {
        light: "bg-green-100 text-green-800",
        dark: "bg-green-900/30 text-green-300 border border-green-800",
      },
      reservado: {
        light: "bg-yellow-100 text-yellow-800",
        dark: "bg-yellow-900/30 text-yellow-300 border border-yellow-800",
      },
      vendido: {
        light: "bg-gray-100 text-gray-800",
        dark: "bg-gray-800 text-gray-300 border border-gray-700",
      },
      alugado: {
        light: "bg-blue-100 text-blue-800",
        dark: "bg-blue-900/30 text-blue-300 border border-blue-800",
      },
    };
    return isDark
      ? baseColors[status]?.dark || "bg-gray-800 text-gray-300"
      : baseColors[status]?.light || "bg-gray-100 text-gray-800";
  };

  const getFinanciavelColor = () =>
    isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800";

  const getCheckboxClass = () =>
    `appearance-none h-5 w-5 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/50 focus:ring-offset-2 ${
      isDark ? "bg-gray-800" : "bg-white"
    } ${getCheckboxBorderClass()} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:after:absolute checked:after:content-[''] checked:after:h-[0.625rem] checked:after:w-[0.3125rem] checked:after:rotate-45 checked:after:translate-x-[0.375rem] checked:after:translate-y-[0.125rem] checked:after:border-solid checked:after:border-white checked:after:border-width-0 checked:after:border-r-2 checked:after:border-b-2`;

  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // =============== LOADING ===============
  if (loadingDados || !fotosCarregadas) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Carregando dados do imóvel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? "bg-gray-900"
          : "bg-gradient-to-b from-[#D4A24D]/5 to-[#31353E]/5"
      }`}
    >
      {/* ===== HEADER COM BOTÕES FIXOS ===== */}
      <div
        className={`sticky top-0 z-50 border-b px-4 py-3 transition-colors duration-200 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Lado Esquerdo - Título e Navegação */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/admin/imoveis")}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1
                  className={`text-xl md:text-2xl font-bold transition-colors ${getTextClass()}`}
                >
                  Editar Imóvel
                </h1>
                <p
                  className={`text-xs md:text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  {formData.codigo} • {formData.titulo?.substring(0, 40)}
                  {formData.titulo?.length > 40 ? "..." : ""}
                </p>
              </div>
            </div>

            {/* Lado Direito - Badge + Botões */}
            <div className="flex items-center justify-end space-x-2 md:space-x-3">
              {/* BOTÕES DE AÇÃO */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-xs md:text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="form-editar-imovel" // 👈 LINHA IMPORTANTE!
                  disabled={loading}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-[#D4A24D] hover:bg-[#C4933E] text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4A24D] focus:ring-offset-2 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Atualizar Imóvel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - TODO O RESTO DO CÓDICO PERMANECE IGUAL */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form
          id="form-editar-imovel"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* ========== SEÇÃO 1: INFORMAÇÕES GERAIS ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <HomeIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Informações Gerais do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Dados para identificação, comercialização e gestão
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Código do Imóvel */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Código do Imóvel *
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: APT-001"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Título do Anúncio */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Casa moderna com piscina no Jardins"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Finalidade */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Finalidade *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="finalidade.venda"
                      checked={formData.finalidade.venda}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`ml-2 transition-colors ${getTextClass()}`}
                    >
                      Venda
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="finalidade.aluguel"
                      checked={formData.finalidade.aluguel}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`ml-2 transition-colors ${getTextClass()}`}
                    >
                      Aluguel
                    </span>
                  </label>
                </div>
              </div>
              {/* Tipo do Imóvel */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Tipo do Imóvel *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecione o tipo
                  </option>
                  {tiposImovel.map((tipo) => (
                    <option
                      key={tipo.value}
                      value={tipo.value}
                      className={getOptionBgClass()}
                    >
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Proprietário */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Proprietário
                </label>
                <select
                  name="proprietarioId"
                  value={formData.proprietarioId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecionar proprietário
                  </option>
                  {proprietarios.map((proprietario) => (
                    <option
                      key={proprietario.id}
                      value={proprietario.id}
                      className={getOptionBgClass()}
                    >
                      {proprietario.nome}
                    </option>
                  ))}
                </select>
              </div>
              {/* Corretor Responsável */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Corretor Responsável
                </label>
                <select
                  name="corretorId"
                  value={formData.corretorId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecionar corretor
                  </option>
                  {corretores.map((corretor) => (
                    <option
                      key={corretor.id}
                      value={corretor.id}
                      className={getOptionBgClass()}
                    >
                      {corretor.nome}
                    </option>
                  ))}
                </select>
              </div>
              {/* Preço */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Preço *
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                    >
                      R$
                    </span>
                    <input
                      type="number"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                    />
                  </div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="ocultarPreco"
                      checked={formData.ocultarPreco}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`text-sm transition-colors ${getTextClass()}`}
                    >
                      Ocultar preço na vitrine
                    </span>
                  </label>
                </div>
                {formData.preco && !formData.ocultarPreco && (
                  <p
                    className={`mt-2 text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    {formatPrice(formData.preco)}
                  </p>
                )}
                {formData.ocultarPreco && (
                  <p
                    className={`mt-2 text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                  >
                    Preço não será exibido publicamente.
                  </p>
                )}
              </div>
              {/* Status */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="disponivel" className={getOptionBgClass()}>
                    Disponível
                  </option>
                  <option value="reservado" className={getOptionBgClass()}>
                    Reservado
                  </option>
                  <option value="vendido" className={getOptionBgClass()}>
                    Vendido
                  </option>
                  <option value="alugado" className={getOptionBgClass()}>
                    Alugado
                  </option>
                </select>
              </div>
              {/* Financiável */}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="financiado"
                  name="financiado"
                  checked={formData.financiado}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <label
                  htmlFor="financiado"
                  className={`text-sm transition-colors ${getTextClass()}`}
                >
                  Imóvel financiável
                </label>
              </div>
              {/* Em Condomínio */}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="emCondominio"
                  name="emCondominio"
                  checked={formData.emCondominio}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <label
                  htmlFor="emCondominio"
                  className={`text-sm transition-colors ${getTextClass()}`}
                >
                  Imóvel em condomínio
                </label>
              </div>
            </div>

            {/* BLOCO VÍNCULO COM EMPREENDIMENTO */}
            {formData.emCondominio && (
              <div
                className={`col-span-3 mt-6 p-5 border rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingOfficeIcon
                    className={`w-5 h-5 ${
                      isDark ? "text-blue-400" : "text-blue-700"
                    }`}
                  />
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    Vínculo com Empreendimento
                  </h3>
                  {formData.tipo === "apartamento" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Edifício obrigatório
                    </span>
                  )}
                  {formData.tipo === "casa" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Condomínio/Residencial
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* SELECT DE EMPREENDIMENTOS */}
                  <div className="lg:col-span-2">
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Nome do Empreendimento *
                    </label>
                    <select
                      name="empreendimento_id"
                      value={formData.empreendimento_id}
                      onChange={handleChange}
                      required={formData.emCondominio}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option
                        value=""
                        className={isDark ? "bg-gray-700" : "bg-white"}
                      >
                        Selecione um empreendimento...
                      </option>
                      {empreendimentos
                        .filter((emp) => {
                          if (formData.tipo === "apartamento")
                            return emp.tipo === "edificio";
                          if (formData.tipo === "casa")
                            return (
                              emp.tipo === "condominio" ||
                              emp.tipo === "residencial"
                            );
                          return true;
                        })
                        .map((emp) => (
                          <option
                            key={emp.id}
                            value={emp.id}
                            className={isDark ? "bg-gray-700" : "bg-white"}
                          >
                            {emp.nome} - {emp.bairro}/{emp.cidade}
                            {emp.tipo === "edificio"
                              ? " 🏢"
                              : emp.tipo === "condominio"
                                ? " 🏘️"
                                : " 🏡"}
                          </option>
                        ))}
                    </select>
                    <p className="text-[10px] mt-1.5">
                      <a
                        href="/admin/edificios/cadastrar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center ${
                          isDark
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-800"
                        } hover:underline`}
                      >
                        <PlusIcon className="w-3 h-3 mr-1" />
                        Cadastrar novo empreendimento
                      </a>
                    </p>
                  </div>

                  {/* UNIDADE (só para apartamentos) */}
                  {formData.tipo === "apartamento" && (
                    <>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Unidade/Apartamento
                        </label>
                        <input
                          type="text"
                          name="unidade"
                          value={formData.unidade}
                          onChange={handleChange}
                          placeholder="Ex: 101, 1203"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Andar
                        </label>
                        <input
                          type="text"
                          name="andar"
                          value={formData.andar}
                          onChange={handleChange}
                          placeholder="Ex: 1º, 12º, Cobertura"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Bloco/Torre
                        </label>
                        <input
                          type="text"
                          name="bloco"
                          value={formData.bloco}
                          onChange={handleChange}
                          placeholder="Ex: Bloco A, Torre 1"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>
                    </>
                  )}

                  {/* LOTE e QUADRA (só para casas em condomínio) */}
                  {formData.tipo === "casa" && (
                    <>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Lote/Número
                        </label>
                        <input
                          type="text"
                          name="lote"
                          value={formData.lote}
                          onChange={handleChange}
                          placeholder="Ex: Lote 23"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Quadra
                        </label>
                        <input
                          type="text"
                          name="quadra"
                          value={formData.quadra}
                          onChange={handleChange}
                          placeholder="Ex: Quadra 15"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* MENSAGENS DE VALIDAÇÃO */}
                {formData.tipo === "apartamento" &&
                  !formData.empreendimento_id && (
                    <p
                      className={`text-xs mt-3 flex items-center ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Apartamento precisa estar vinculado a um Edifício.
                    </p>
                  )}
                {formData.tipo === "casa" &&
                  formData.emCondominio &&
                  !formData.empreendimento_id && (
                    <p
                      className={`text-xs mt-3 flex items-center ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Casa em condomínio precisa estar vinculada a um
                      Condomínio/Residencial.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* ========== NOVA SEÇÃO: DEPENDÊNCIAS DO IMÓVEL ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <CubeTransparentIcon
                  className={`w-6 h-6 ${getIconColorClass()}`}
                />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Dependências do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Quantidade de cômodos, vagas e áreas do imóvel
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dormitórios */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Dormitórios
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          dormitorios: Math.max(
                            0,
                            (parseInt(prev.dependencias.dormitorios) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.dormitorios"
                    value={formData.dependencias.dormitorios}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          dormitorios:
                            (parseInt(prev.dependencias.dormitorios) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Banheiros */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Banheiros
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          banheiros: Math.max(
                            0,
                            (parseInt(prev.dependencias.banheiros) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.banheiros"
                    value={formData.dependencias.banheiros}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          banheiros:
                            (parseInt(prev.dependencias.banheiros) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Suíte */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Suíte
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          suites: Math.max(
                            0,
                            (parseInt(prev.dependencias.suites) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.suites"
                    value={formData.dependencias.suites}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          suites: (parseInt(prev.dependencias.suites) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Vagas */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Vagas
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          vagas: Math.max(
                            0,
                            (parseInt(prev.dependencias.vagas) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.vagas"
                    value={formData.dependencias.vagas}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          vagas: (parseInt(prev.dependencias.vagas) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Área Total */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Área Total (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="dependencias.area_total"
                    value={formData.dependencias.area_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>

              {/* Área Construída */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Área Construída (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="dependencias.area_construida"
                    value={formData.dependencias.area_construida}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO 2: LOCALIZAÇÃO SIMPLIFICADA ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <MapPinIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Localização do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereço para controle interno e exibição no site
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CEP */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength="9"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D4A24D]"></div>
                    </div>
                  )}
                </div>
                {cepError && (
                  <p
                    className={`mt-1 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {cepError}
                  </p>
                )}
                {!cepError &&
                  !cepLoading &&
                  formData.cep.replace(/\D/g, "").length === 8 && (
                    <p
                      className={`mt-1 text-sm ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                      CEP válido. Endereço preenchido automaticamente.
                    </p>
                  )}
              </div>

              {/* Endereço */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Ex: Rua das Flores"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>

              {/* Número */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="Ex: 123"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>

              {/* Complemento */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Ex: Apto 101, Bloco B"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>

              {/* Bairro */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Bairro *
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Centro"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>

              {/* Cidade */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Cidade *
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Açailândia"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>

              {/* Estado */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecione o estado
                  </option>
                  {estadosBrasil.map((estado) => (
                    <option
                      key={estado.value}
                      value={estado.value}
                      className={getOptionBgClass()}
                    >
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CHECKBOX ÚNICO - MOSTRAR ENDEREÇO NO SITE */}
              <div className="md:col-span-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-[#D4A24D]">
                  <input
                    type="checkbox"
                    name="exibirEnderecoSite"
                    checked={formData.exibirEnderecoSite}
                    onChange={handleChange}
                    className={getCheckboxClass()}
                  />
                  <div>
                    <div className={`font-medium ${getTextClass()}`}>
                      🌐 Mostrar endereço completo no site
                    </div>
                    <div className={`text-sm ${getTextSecondaryClass()}`}>
                      Se marcado, o endereço (Rua, Número) aparecerá na página
                      pública do imóvel. Se desmarcado, fica visível apenas
                      internamente.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO: EXIBIR NA VITRINE ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r from-[#D4A24D] to-yellow-500`}
              >
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${getTextClass()}`}>
                  ✨ Exibir na Vitrine
                </h2>
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  Dê destaque especial ao seu imóvel na página principal
                </p>
              </div>
            </div>

            {/* Badges de destaque - TODOS UNIFORMIZADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destaque da Semana */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.destaqueSemana"
                  checked={formData.etiquetas.destaqueSemana}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    ⭐ Destaque da Semana
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge dourado na vitrine
                  </div>
                </div>
              </label>

              {/* Novo no Site */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.novoSite"
                  checked={formData.etiquetas.novoSite}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    🆕 Novo no Site
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge azul para imóveis recentes
                  </div>
                </div>
              </label>

              {/* Baixou o Preço */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.baixouPreco"
                  checked={formData.etiquetas.baixouPreco}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    📉 Baixou o Preço
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge vermelho indicando redução
                  </div>
                </div>
              </label>

              {/* Financiável */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.financiável"
                  checked={formData.etiquetas.financiável}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    💰 Financiável
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge roxo para financiamento
                  </div>
                </div>
              </label>
            </div>
            {/* ===== CAMPO DE PREÇO ANTERIOR (só aparece quando "Baixou o Preço" está marcado) ===== */}
            {formData.etiquetas.baixouPreco && (
              <div className="mt-6 p-5 border-2 border-red-500/30 bg-red-500/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📉</div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-white mb-1">
                      Informe o preço anterior
                    </h4>
                    <p className="text-sm text-white/80 mb-4">
                      Este valor aparecerá riscado ao lado do preço atual na
                      página do imóvel, destacando a economia para o cliente.
                    </p>

                    <div className="max-w-md mb-4">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Preço anterior (R$)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                          R$
                        </span>
                        <input
                          type="number"
                          name="precoAnterior"
                          value={formData.precoAnterior}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-red-500/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* 🔥 NOVO: PREVIEW DO PREÇO COM DESCONTO (dentro da box vermelha) */}
                    {formData.preco && formData.precoAnterior && (
                      <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-white/70 mb-2">
                          Preview do preço na página do imóvel:
                        </p>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="text-gray-300 line-through text-sm">
                            {formatPrice(formData.precoAnterior)}
                          </span>
                          <span className="text-white font-bold text-base">
                            {formatPrice(formData.preco)}
                          </span>
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -
                            {Math.round(
                              ((formData.precoAnterior - formData.preco) /
                                formData.precoAnterior) *
                                100,
                            )}
                            % OFF
                          </span>
                        </div>
                        <p className="text-green-400 text-xs mt-2">
                          🎉 Economia de{" "}
                          {formatPrice(formData.precoAnterior - formData.preco)}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-white/60 mt-2">
                      💡 Dica: Quanto maior o desconto aparente, mais atrativo o
                      imóvel fica.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview da Vitrine */}
            <div
              className={`mt-6 p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <h4
                className={`text-sm font-medium mb-3 ${getTextSecondaryClass()}`}
              >
                Preview da Vitrine:
              </h4>

              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formData.titulo || "Título do Imóvel"}
                  </h3>
                  <div className="flex gap-1 flex-wrap">
                    {formData.etiquetas.destaqueSemana && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium flex items-center gap-1">
                        ⭐ Destaque
                      </span>
                    )}
                    {formData.etiquetas.novoSite && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex items-center gap-1">
                        🆕 Novo
                      </span>
                    )}
                    {formData.etiquetas.baixouPreco && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex items-center gap-1">
                        📉 Baixou
                      </span>
                    )}
                    {formData.etiquetas.financiável && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium flex items-center gap-1">
                        💰 Financiável
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPinIcon className="w-4 h-4 mr-1 text-[#D4A24D]" />
                  <span>
                    {formData.bairro || "Bairro"}, {formData.cidade || "Cidade"}
                    /{formData.estado || "UF"}
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-3 ${getTextSecondaryClass()}`}>
                ℹ️ Na vitrine, sempre mostramos: Título + Badges + Bairro,
                Cidade/UF
              </p>
            </div>
          </div>

          {/* ========== NOVA SEÇÃO: FOTOS DO IMÓVEL ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <CameraIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Fotos do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Arraste para organizar • Clique na estrela para definir a capa
                  • Máximo 20 fotos
                </p>
              </div>
            </div>

            {/* Área de upload */}
            <div className="mb-6">
              <label
                className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-[#D4A24D] ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon
                    className={`w-8 h-8 mb-2 ${getTextSecondaryClass()}`}
                  />
                  <p className={`text-sm font-medium ${getTextClass()}`}>
                    {uploadingFotos
                      ? "Enviando..."
                      : "Clique para fazer upload"}
                  </p>
                  <p className={`text-xs ${getTextSecondaryClass()}`}>
                    PNG, JPG ou JPEG (máx. 5MB cada)
                  </p>
                  <p className={`text-xs ${getTextSecondaryClass()} mt-1`}>
                    {fotos.length}/20 fotos
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadFotos}
                  disabled={uploadingFotos || fotos.length >= 20}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>
              {fotosError && (
                <p
                  className={`mt-2 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
                >
                  {fotosError}
                </p>
              )}
            </div>

            {/* Grid de fotos com drag-and-drop */}
            {fotos.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fotos.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {fotos.map((foto, index) => (
                      <SortableItem
                        key={foto.id}
                        id={foto.id}
                        url={foto.url}
                        isCapa={foto.isCapa}
                        index={index}
                        onSetCapa={handleSetCapa}
                        onRemove={handleRemoveFoto}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Informações adicionais */}
            {fotos.length > 0 && (
              <div
                className={`mt-4 p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  <span className="font-medium text-[#D4A24D]">
                    ⭐ Foto de capa:
                  </span>{" "}
                  Será a primeira imagem do carrossel e a miniatura do imóvel.
                </p>
                <p className={`text-sm ${getTextSecondaryClass()} mt-1`}>
                  <span className="font-medium">🖱️ Arraste:</span> As fotos
                  podem ser reorganizadas livremente.
                </p>
              </div>
            )}
          </div>

          {/* ========== SEÇÃO 4: CUSTOS ADICIONAIS ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <SparklesIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Custos Adicionais
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  IPTU e outros custos do imóvel
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* IPTU Anual */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  IPTU Anual (R$)
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    name="iptu_anual"
                    value={formData.iptu_anual}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO 5: ACCORDIONS ========== */}
          <div className="space-y-4">
            {/* ACCORDION 1: CARACTERÍSTICAS DO IMÓVEL */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("caracteristicas")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <CubeTransparentIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Características do Imóvel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Medidas, estrutura, infraestrutura e informações
                      estratégicas
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.caracteristicas ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.caracteristicas && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="space-y-8">
                    {/* 📐 Medidas e Dimensões */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <CubeTransparentIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          📐 Medidas e Dimensões
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Área útil (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaUtil"
                            value={formData.caracteristicas.areaUtil}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Área privativa (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaPrivativa"
                            value={formData.caracteristicas.areaPrivativa}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Frente do terreno (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.frenteTerreno"
                            value={formData.caracteristicas.frenteTerreno}
                            onChange={handleChange}
                            placeholder="Ex: 10m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Fundo (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.fundo"
                            value={formData.caracteristicas.fundo}
                            onChange={handleChange}
                            placeholder="Ex: 25m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Lateral esquerda (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.lateralEsquerda"
                            value={formData.caracteristicas.lateralEsquerda}
                            onChange={handleChange}
                            placeholder="Ex: 30m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Lateral direita (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.lateralDireita"
                            value={formData.caracteristicas.lateralDireita}
                            onChange={handleChange}
                            placeholder="Ex: 30m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Pé direito (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.peDireito"
                            value={formData.caracteristicas.peDireito}
                            onChange={handleChange}
                            placeholder="Ex: 3,20m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Topografia
                          </label>
                          <select
                            name="caracteristicas.topografia"
                            value={formData.caracteristicas.topografia}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option
                              value="plano"
                              className={getOptionBgClass()}
                            >
                              Plano
                            </option>
                            <option
                              value="aclive"
                              className={getOptionBgClass()}
                            >
                              Aclive
                            </option>
                            <option
                              value="declive"
                              className={getOptionBgClass()}
                            >
                              Declive
                            </option>
                          </select>
                        </div>
                        <div className="flex items-center pt-6">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              name="caracteristicas.esquina"
                              checked={formData.caracteristicas.esquina}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              Esquina
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 🏗 Estrutura do Imóvel */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <HomeIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          🏗 Estrutura do Imóvel
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de construção
                          </label>
                          <select
                            name="caracteristicas.tipoConstrucao"
                            value={formData.caracteristicas.tipoConstrucao}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option
                              value="alvenaria_estrutural"
                              className={getOptionBgClass()}
                            >
                              Alvenaria Estrutural
                            </option>
                            <option
                              value="concreto_armado"
                              className={getOptionBgClass()}
                            >
                              Concreto Armado
                            </option>
                            <option
                              value="steel_frame"
                              className={getOptionBgClass()}
                            >
                              Steel Frame
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Ano de construção
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.anoConstrucao"
                            value={formData.caracteristicas.anoConstrucao}
                            onChange={handleChange}
                            placeholder="Ex: 2020"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Número de pavimentos
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.numeroPavimentos"
                            value={formData.caracteristicas.numeroPavimentos}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.reformadoRecentemente"
                            checked={
                              formData.caracteristicas.reformadoRecentemente
                            }
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Reformado recentemente?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.imovelAverbado"
                            checked={formData.caracteristicas.imovelAverbado}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Imóvel averbado?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.financiavel"
                            checked={formData.caracteristicas.financiavel}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Financiável?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.aceitaPermuta"
                            checked={formData.caracteristicas.aceitaPermuta}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Aceita permuta?
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* ⚡ Infraestrutura interna */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <LightBulbIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          ⚡ Infraestrutura interna
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de iluminação
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.tipoIluminacao"
                            value={formData.caracteristicas.tipoIluminacao}
                            onChange={handleChange}
                            placeholder="Ex: LED, Fluorescente"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de telhado
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.tipoTelhado"
                            value={formData.caracteristicas.tipoTelhado}
                            onChange={handleChange}
                            placeholder="Ex: Cerâmica, Metálico"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Caixa d'água (litros)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.caixaDAgua"
                            value={formData.caracteristicas.caixaDAgua}
                            onChange={handleChange}
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Sistema de esgoto
                          </label>
                          <select
                            name="caracteristicas.sistemaEsgoto"
                            value={formData.caracteristicas.sistemaEsgoto}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option
                              value="rede_publica"
                              className={getOptionBgClass()}
                            >
                              Rede Pública
                            </option>
                            <option
                              value="fossa_septica"
                              className={getOptionBgClass()}
                            >
                              Fossa Séptica
                            </option>
                            <option
                              value="fossa_filtro"
                              className={getOptionBgClass()}
                            >
                              Fossa e Filtro
                            </option>
                            <option
                              value="fossa_filtro"
                              className={getOptionBgClass()}
                            >
                              Sumidoro
                            </option>
                            <option
                              value="fossa_filtro"
                              className={getOptionBgClass()}
                            >
                              Fossa Ecológica/Biodigestor
                            </option>
                            <option
                              value="Fossa Ecológica/Biodigestor"
                              className={getOptionBgClass()}
                            >
                              Inexistente
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Aquecimento de água
                          </label>
                          <select
                            name="caracteristicas.aquecimentoAgua"
                            value={formData.caracteristicas.aquecimentoAgua}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option value="gas" className={getOptionBgClass()}>
                              Gás
                            </option>
                            <option
                              value="solar"
                              className={getOptionBgClass()}
                            >
                              Solar
                            </option>
                            <option
                              value="eletrico"
                              className={getOptionBgClass()}
                            >
                              Elétrico
                            </option>
                            <option
                              value="central"
                              className={getOptionBgClass()}
                            >
                              Central
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.forroLaje"
                            checked={formData.caracteristicas.forroLaje}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Forro em laje?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.sistemaEletricoNovo"
                            checked={
                              formData.caracteristicas.sistemaEletricoNovo
                            }
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Sistema elétrico novo?
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* 🏘 Informações estratégicas */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPinIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          🏘 Informações estratégicas
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Posição solar
                          </label>
                          <select
                            name="caracteristicas.posicaoSolar"
                            value={formData.caracteristicas.posicaoSolar}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option
                              value="nascente"
                              className={getOptionBgClass()}
                            >
                              Nascente
                            </option>
                            <option
                              value="poente"
                              className={getOptionBgClass()}
                            >
                              Poente
                            </option>
                            <option
                              value="norte"
                              className={getOptionBgClass()}
                            >
                              Norte
                            </option>
                            <option value="sul" className={getOptionBgClass()}>
                              Sul
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Condomínio com taxa mensal (R$)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.condominioTaxaMensal"
                            value={
                              formData.caracteristicas.condominioTaxaMensal
                            }
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.ventilacaoCruzada"
                            checked={formData.caracteristicas.ventilacaoCruzada}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Ventilação cruzada
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.vistaLivre"
                            checked={formData.caracteristicas.vistaLivre}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Vista livre
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.vistaPermanente"
                            checked={formData.caracteristicas.vistaPermanente}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Vista permanente
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.ruaSemSaida"
                            checked={formData.caracteristicas.ruaSemSaida}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Rua sem saída
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            name="caracteristicas.esquinaInfo"
                            checked={formData.caracteristicas.esquinaInfo}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Esquina
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 2: ACABAMENTOS */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("acabamentos")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <PaintBrushIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Acabamentos
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Pisos, revestimentos, teto, esquadrias e bancadas
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.acabamentos ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.acabamentos && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="space-y-8">
                    {/* 🔹 Pisos */}
                    <div>
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Pisos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "pisoPorcelanato", label: "Porcelanato" },
                          { key: "pisoCeramica", label: "Cerâmica" },
                          { key: "pisoLaminado", label: "Piso laminado" },
                          { key: "pisoVinilico", label: "Piso vinílico" },
                          { key: "pisoMadeiraMaciça", label: "Madeira maciça" },
                          { key: "pisoTaco", label: "Taco" },
                          {
                            key: "pisoCimentoQueimado",
                            label: "Cimento queimado",
                          },
                          { key: "pisoMarmore", label: "Mármore" },
                          { key: "pisoGranito", label: "Granito" },
                          { key: "pisoFrio", label: "Piso frio" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Revestimentos de parede */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Revestimentos de parede
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "revestimentoAzulejo", label: "Azulejo" },
                          { key: "revestimentoPastilha", label: "Pastilha" },
                          {
                            key: "revestimentoPorcelanato",
                            label: "Porcelanato em parede",
                          },
                          {
                            key: "revestimentoPedraNatural",
                            label: "Pedra natural",
                          },
                          {
                            key: "revestimentoPapelParede",
                            label: "Papel de parede",
                          },
                          { key: "revestimento3D", label: "Revestimento 3D" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Teto e forro */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Teto e forro
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            key: "tetoGessoRebaixado",
                            label: "Gesso rebaixado",
                          },
                          { key: "tetoSancaGesso", label: "Sanca de gesso" },
                          { key: "tetoForroPVC", label: "Forro de PVC" },
                          { key: "tetoLaje", label: "Laje" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Esquadrias e portas */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Esquadrias e portas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            key: "portaMadeiraMaciça",
                            label: "Porta de madeira maciça",
                          },
                          { key: "portaLaqueada", label: "Porta laqueada" },
                          {
                            key: "esquadriaAluminio",
                            label: "Esquadrias de alumínio",
                          },
                          { key: "esquadriaPVC", label: "Esquadrias de PVC" },
                          { key: "portaPivotante", label: "Porta pivotante" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Bancadas */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Bancadas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "bancadaGranito", label: "Granito" },
                          { key: "bancadaMarmore", label: "Mármore" },
                          { key: "bancadaQuartzo", label: "Quartzo" },
                          { key: "bancadaNanoglass", label: "Nanoglass" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 3: ÁREA DE LAZER */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("areaLazer")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <SunIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Área de Lazer
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Instalações de lazer e entretenimento
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.areaLazer ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.areaLazer && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "piscina", label: "Piscina" },
                      { key: "churrasqueira", label: "Churrasqueira" },
                      { key: "espacoGourmet", label: "Espaço gourmet" },
                      { key: "salaoFestas", label: "Salão de festas" },
                      { key: "salaoJogos", label: "Salão de jogos" },
                      { key: "academia", label: "Academia" },
                      { key: "playground", label: "Playground" },
                      {
                        key: "quadraPoliesportiva",
                        label: "Quadra poliesportiva",
                      },
                      { key: "campoSociety", label: "Campo society" },
                      { key: "areaVerde", label: "Área verde" },
                      { key: "jardim", label: "Jardim" },
                      { key: "deck", label: "Deck" },
                      { key: "rooftop", label: "Rooftop" },
                      { key: "sauna", label: "Sauna" },
                      { key: "espacoPet", label: "Espaço pet" },
                      { key: "brinquedoteca", label: "Brinquedoteca" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`areaLazer.${key}`}
                          checked={formData.areaLazer[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 4: LOCALIZAÇÃO E VIZINHANÇA */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("localizacaoVizinhanca")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <MapPinIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Localização e Vizinhança
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Proximidade de serviços e características do entorno
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.localizacaoVizinhanca ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.localizacaoVizinhanca && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "proximoCentro", label: "Próximo ao centro" },
                      {
                        key: "proximoSupermercado",
                        label: "Próximo a supermercado",
                      },
                      { key: "proximoEscola", label: "Próximo a escola" },
                      { key: "proximoHospital", label: "Próximo a hospital" },
                      { key: "proximoFarmacia", label: "Próximo a farmácia" },
                      {
                        key: "proximoOnibus",
                        label: "Próximo a ponto de ônibus",
                      },
                      { key: "proximoShopping", label: "Próximo a shopping" },
                      { key: "proximoFaculdade", label: "Próximo a faculdade" },
                      { key: "bairroResidencial", label: "Bairro residencial" },
                      { key: "bairroComercial", label: "Bairro comercial" },
                      { key: "ruaAsfaltada", label: "Rua asfaltada" },
                      { key: "ruaTranquila", label: "Rua tranquila" },
                      { key: "regiaoValorizada", label: "Região valorizada" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`localizacaoVizinhanca.${key}`}
                          checked={formData.localizacaoVizinhanca[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 5: SEGURANÇA */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("seguranca")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <ShieldCheckIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Segurança
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Sistemas de segurança e proteção patrimonial
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.seguranca ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.seguranca && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "portaoEletronico", label: "Portão eletrônico" },
                      { key: "interfone", label: "Interfone" },
                      { key: "cercaEletrica", label: "Cerca elétrica" },
                      { key: "sistemaCameras", label: "Sistema de câmeras" },
                      { key: "alarme", label: "Alarme" },
                      { key: "portaria24h", label: "Portaria 24h" },
                      { key: "vigilancia24h", label: "Vigilância 24h" },
                      { key: "controleAcesso", label: "Controle de acesso" },
                      { key: "fechaduraDigital", label: "Fechadura digital" },
                      { key: "condominioFechado", label: "Condomínio fechado" },
                      { key: "murosAltos", label: "Muros altos" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`seguranca.${key}`}
                          checked={formData.seguranca[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 6: ARMÁRIOS E ARMAZENAMENTO */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("armariosArmazenamento")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <BuildingStorefrontIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Armários e Armazenamento
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Móveis planejados e soluções de armazenamento
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.armariosArmazenamento ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.armariosArmazenamento && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        key: "armarioCozinhaPlanejado",
                        label: "Armário de cozinha planejado",
                      },
                      { key: "armariosEmbutidos", label: "Armários embutidos" },
                      { key: "armariosQuarto", label: "Armários no quarto" },
                      {
                        key: "armariosBanheiro",
                        label: "Armários no banheiro",
                      },
                      { key: "closet", label: "Closet" },
                      { key: "despensa", label: "Despensa" },
                      { key: "deposito", label: "Depósito" },
                      { key: "roupeiro", label: "Roupeiro" },
                      { key: "maleiro", label: "Maleiro" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`armariosArmazenamento.${key}`}
                          checked={formData.armariosArmazenamento[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 7: SERVIÇOS E UTILIDADES */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("servicosUtilidades")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <BoltIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Serviços e Utilidades
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Serviços coletivos, utilidades e infraestrutura urbana
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.servicosUtilidades ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.servicosUtilidades && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "aguaEncanada", label: "Água encanada" },
                      { key: "energiaEletrica", label: "Energia elétrica" },
                      { key: "pocoArtesiano", label: "Poço artesiano" },
                      { key: "aquecimentoGas", label: "Aquecimento a gás" },
                      { key: "aquecimentoSolar", label: "Aquecimento solar" },
                      { key: "gasEncanado", label: "Gás encanado" },
                      {
                        key: "arCondicionadoInstalado",
                        label: "Ar-condicionado instalado",
                      },
                      {
                        key: "infraArCondicionado",
                        label: "Infra para ar-condicionado",
                      },
                      {
                        key: "internetFibra",
                        label: "Internet fibra disponível",
                      },
                      { key: "iluminacaoLED", label: "Iluminação em LED" },
                      {
                        key: "energiaSolar",
                        label: "Sistema de energia solar",
                      },
                      { key: "elevador", label: "Elevador" },
                      { key: "coletaLixo", label: "Coleta de lixo regular" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`servicosUtilidades.${key}`}
                          checked={formData.servicosUtilidades[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION 8: DIFERENCIAIS DO IMÓVEL */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("diferenciais")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <HeartIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Diferenciais do Imóvel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Características especiais que valorizam o imóvel
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.diferenciais ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.diferenciais && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "varanda", label: "Varanda" },
                      { key: "sacada", label: "Sacada" },
                      { key: "lavabo", label: "Lavabo" },
                      { key: "banheira", label: "Banheira" },
                      { key: "boxVidro", label: "Box de vidro" },
                      {
                        key: "dependenciaEmpregada",
                        label: "Dependência de empregada",
                      },
                      { key: "escritorio", label: "Escritório" },
                      { key: "peDireitoDuplo", label: "Pé direito duplo" },
                      { key: "mezanino", label: "Mezanino" },
                      { key: "vistaPanoramica", label: "Vista panorâmica" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`diferenciais.${key}`}
                          checked={formData.diferenciais[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== SEÇÃO 6: DESCRIÇÃO E OBSERVAÇÕES ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <SparklesIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Descrição e Observações
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Informações detalhadas para clientes e uso interno
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Descrição do Imóvel *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva o imóvel com detalhes: acabamentos, diferenciais, localização, etc..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Observações Internas
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Observações para uso interno da imobiliária (não aparece para clientes)..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
            </div>
          </div>

          {/* ========== BLOCO DE FEEDBACK ========== */}
          {submitMessage.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                submitMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {submitMessage.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
                )}
                <p className="font-medium">{submitMessage.text}</p>
              </div>
              {submitMessage.type === "success" && (
                <p className="mt-1 text-sm opacity-80">
                  Você será redirecionado para a lista de imóveis em alguns
                  segundos...
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditarImovel;
