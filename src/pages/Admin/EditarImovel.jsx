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
  XMarkIcon,
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

// ========== COMPONENTE SORTABLE ITEM PARA FOTOS ==========
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

        {/* Overlay com acoes */}
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

// ========== COMPONENTE DE INPUT DE PREÇO COM MÁSCARA ==========
const PriceInput = ({
  name,
  value,
  onChange,
  label,
  required,
  isDark,
  getInputClasses,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    if (rawValue === "") {
      setDisplayValue("");
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: "",
          type: "text",
        },
      };
      onChange(syntheticEvent);
      return;
    }

    const numericValue = parseFloat(rawValue) / 100;

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);

    setDisplayValue(formatted);

    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: numericValue,
        type: "number",
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
      >
        {label} {required && "*"}
      </label>
      <div className="relative">
        <span
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          R$
        </span>
        <input
          type="text"
          name={name}
          value={displayValue}
          onChange={handlePriceChange}
          required={required}
          placeholder="R$ 0,00"
          className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
        />
      </div>
    </div>
  );
};

// ========== COMPONENTE DE CHECKBOX COM BOTÃO ADICIONAR ==========
const CheckboxAccordion = ({
  title,
  subtitle,
  icon: Icon,
  section,
  isOpen,
  onToggle,
  items,
  formData,
  setFormData,
  handleChange,
  isDark,
  getBorderClass,
  getHoverBgClass,
  getTextClass,
  getCheckboxClass,
  getIconBgClass,
  getIconColorClass,
  getAccordionTitleClass,
  getAccordionSubtitleClass,
  getTextSecondaryClass,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [customItems, setCustomItems] = useState([]);

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;
    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCustomItems([...customItems, { id: newItemId, name: newItemName }]);
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [newItemId]: false },
    }));
    setNewItemName("");
    setShowAddForm(false);
  };

  const handleRemoveCustomItem = (itemId) => {
    setCustomItems(customItems.filter((item) => item.id !== itemId));
    setFormData((prev) => {
      const newSection = { ...prev[section] };
      delete newSection[itemId];
      return { ...prev, [section]: newSection };
    });
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-white"} ${getBorderClass()}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-white"} ${getHoverBgClass()}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
            <Icon className={`w-5 h-5 ${getIconColorClass()}`} />
          </div>
          <div className="text-left">
            <h3
              className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
            >
              {title}
            </h3>
            <p
              className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div
          className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
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

      {isOpen && (
        <div
          className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-white"} ${getBorderClass()}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-md font-semibold ${getTextClass()}`}>
                Itens
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm bg-[#D4A24D] text-white hover:bg-[#c0913c]"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Adicionar item</span>
              </button>
            </div>

            {showAddForm && (
              <div
                className={`p-4 border rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nome do item"
                    className="flex-1 px-3 py-2 border rounded-lg"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCustomItem()
                    }
                  />
                  <button
                    onClick={handleAddCustomItem}
                    className="px-3 py-2 bg-[#D4A24D] text-white rounded-lg"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    X
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
                >
                  <input
                    type="checkbox"
                    name={`${section}.${key}`}
                    checked={formData[section]?.[key] || false}
                    onChange={handleChange}
                    className={getCheckboxClass()}
                  />
                  <span className={getTextClass()}>{label}</span>
                </label>
              ))}

              {customItems.map((item) => (
                <div key={item.id} className="relative group">
                  <label
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
                  >
                    <input
                      type="checkbox"
                      name={`${section}.${item.id}`}
                      checked={formData[section]?.[item.id] || false}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span className={getTextClass()}>{item.name}</span>
                  </label>
                  <button
                    onClick={() => handleRemoveCustomItem(item.id)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== COMPONENTE PARA SEÇÕES DE ACABAMENTO ==========
const SecaoAcabamento = ({
  titulo,
  section,
  items,
  formData,
  setFormData,
  handleChange,
  isDark,
  getBorderClass,
  getHoverBgClass,
  getTextClass,
  getCheckboxClass,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [customItems, setCustomItems] = useState([]);

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;
    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCustomItems([...customItems, { id: newItemId, name: newItemName }]);
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [newItemId]: false },
    }));
    setNewItemName("");
    setShowAddForm(false);
  };

  const handleRemoveCustomItem = (itemId) => {
    setCustomItems(customItems.filter((item) => item.id !== itemId));
    setFormData((prev) => {
      const newSection = { ...prev[section] };
      delete newSection[itemId];
      return { ...prev, [section]: newSection };
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-md font-semibold ${getTextClass()}`}>{titulo}</h4>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm bg-[#D4A24D] text-white hover:bg-[#c0913c]"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {showAddForm && (
        <div
          className={`mb-4 p-4 border rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Nome do item"
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomItem()}
            />
            <button
              onClick={handleAddCustomItem}
              className="px-3 py-2 bg-[#D4A24D] text-white rounded-lg"
            >
              OK
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg"
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(({ key, label }) => (
          <label
            key={key}
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
          >
            <input
              type="checkbox"
              name={`${section}.${key}`}
              checked={formData[section]?.[key] || false}
              onChange={handleChange}
              className={getCheckboxClass()}
            />
            <span className={getTextClass()}>{label}</span>
          </label>
        ))}

        {customItems.map((item) => (
          <div key={item.id} className="relative group">
            <label
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
            >
              <input
                type="checkbox"
                name={`${section}.${item.id}`}
                checked={formData[section]?.[item.id] || false}
                onChange={handleChange}
                className={getCheckboxClass()}
              />
              <span className={getTextClass()}>{item.name}</span>
            </label>
            <button
              onClick={() => handleRemoveCustomItem(item.id)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== COMPONENTE PRINCIPAL ==========
const EditarImovel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // =============== BUSCAR CORRETORES REAIS ===============
  const [corretoresReais, setCorretoresReais] = useState([]);
  const [loadingCorretores, setLoadingCorretores] = useState(false);

  useEffect(() => {
    const fetchCorretores = async () => {
      setLoadingCorretores(true);
      try {
        const { data, error } = await supabase
          .from("corretores")
          .select("id, nome, creci, email, ativo")
          .eq("ativo", true)
          .order("nome");

        if (error) throw error;
        setCorretoresReais(data || []);
      } catch (error) {
        console.error("Erro ao buscar corretores:", error);
      } finally {
        setLoadingCorretores(false);
      }
    };

    fetchCorretores();
  }, []);

  // =============== ESTADO DAS FOTOS ===============
  const [fotos, setFotos] = useState([]);
  const [uploadingFotos, setUploadingFotos] = useState(false);
  const [fotosError, setFotosError] = useState("");
  const [fotosCarregadas, setFotosCarregadas] = useState(false);

  // Configuracao dos sensores para drag-and-drop
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

  // =============== FUNCOES DO GERENCIADOR DE FOTOS ===============
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
      setFotosError("Maximo de 20 fotos permitidas");
      return;
    }

    setUploadingFotos(true);
    setFotosError("");

    try {
      const uploadPromises = files.map(async (file, index) => {
        if (!file.type.startsWith("image/")) {
          throw new Error("Apenas imagens sao permitidas");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Imagem muito grande. Maximo 5MB");
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

  // =============== CARREGAR FOTOS DO IMOVEL ===============
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

  const carregarEmpreendimentos = async () => {
    const { data } = await supabase
      .from("edificios")
      .select("id, nome, tipo, bairro, cidade")
      .order("nome");
    setEmpreendimentos(data || []);
  };

  // =============== CARREGAR FINALIDADES ===============
  const carregarFinalidades = async (imovelId) => {
    try {
      const { data, error } = await supabase
        .from("imovel_finalidades")
        .select("tipo, preco")
        .eq("imovel_id", imovelId)
        .eq("status", "ativo");

      if (error) throw error;

      if (data && data.length > 0) {
        const venda = data.find((f) => f.tipo === "venda");
        const aluguel = data.find((f) => f.tipo === "aluguel");

        setFormData((prev) => ({
          ...prev,
          finalidade_venda: !!venda,
          finalidade_aluguel: !!aluguel,
          preco_venda: venda?.preco || "",
          preco_aluguel: aluguel?.preco || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar finalidades:", error);
    }
  };

  // =============== ESTADO DO FORMULARIO ===============
  const [formData, setFormData] = useState({
    // Campos diretos
    codigo: "",
    titulo: "",
    tipo: "",
    status: "disponivel",
    financiado: false,
    emCondominio: false,
    proprietarioId: "",
    corretorId: "",
    ocultarPreco: false,

    // Finalidades (agora separadas, não objeto)
    finalidade_venda: false,
    finalidade_aluguel: false,
    preco_venda: "",
    preco_aluguel: "",

    // Relacionamento com edificios
    empreendimento_id: "",
    unidade: "",
    andar: "",
    lote: "",
    bloco: "",
    quadra: "",

    // Dependências (colunas diretas)
    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,
    area_total: 0,
    area_construida: 0,
    area_privativa: 0,

    // Custos
    condominio_mensal: 0,
    iptu_anual: 0,

    // Localização
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    exibirEnderecoSite: false,

    // Etiquetas (JSONB)
    etiquetas: {
      destaqueSemana: false,
      novoSite: false,
      baixouPreco: false,
      financivel: false,
    },

    // JSONBs
    caracteristicas: {},
    infraestrutura: {},
    acabamentos: {},
    areaLazer: {},
    localizacaoVizinhanca: {},
    seguranca: {},
    armariosArmazenamento: {},
    servicosUtilidades: {},
    diferenciais: {},

    // Textos
    descricao: "",
    observacoes: "",

    precoAnterior: "",
  });

  // =============== CARREGAR DADOS DO IMOVEL ===============
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
        // Campos diretos
        codigo: data.codigo || "",
        titulo: data.titulo || "",
        tipo: data.tipo || "",
        status: data.status || "disponivel",
        financiado: data.financiado || false,
        emCondominio: data.em_condominio || false,
        proprietarioId: data.proprietario_id || "",
        corretorId: data.corretor_id || "",
        ocultarPreco: data.ocultar_preco || false,

        // Finalidades (serão preenchidas pela carregarFinalidades)
        finalidade_venda: false,
        finalidade_aluguel: false,
        preco_venda: "",
        preco_aluguel: "",

        // Relacionamento com edificios
        empreendimento_id: data.id_edificios || "",
        unidade: data.unidade || "",
        andar: data.andar || "",
        lote: data.lote || "",
        bloco: data.bloco || "",
        quadra: data.quadra || "",

        // Dependências (colunas diretas)
        quartos: data.quartos || 0,
        suites: data.suites || 0,
        banheiros: data.banheiros || 0,
        vagas: data.vagas || 0,
        area_total: data.area_total || 0,
        area_construida: data.area_construida || 0,
        area_privativa: data.area_privativa || 0,

        // Custos
        condominio_mensal: data.condominio_mensal || 0,
        iptu_anual: data.iptu_anual || 0,

        // Localização
        cep: data.cep || "",
        endereco: data.endereco || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
        exibirEnderecoSite: data.exibir_endereco_site || false,

        // Etiquetas (JSONB)
        etiquetas: data.etiquetas || {
          destaqueSemana: false,
          novoSite: false,
          baixouPreco: false,
          financivel: false,
        },

        // JSONBs
        caracteristicas: data.caracteristicas || {},
        infraestrutura: data.infraestrutura || {},
        acabamentos: data.acabamentos || {},
        areaLazer: data.area_lazer || {},
        localizacaoVizinhanca: data.localizacao_vizinhanca || {},
        seguranca: data.seguranca || {},
        armariosArmazenamento: data.armarios_armazenamento || {},
        servicosUtilidades: data.servicos_utilidades || {},
        diferenciais: data.diferenciais || {},

        // Textos
        descricao: data.descricao || "",
        observacoes: data.observacoes || "",

        precoAnterior: data.preco_anterior || "",
      });

      await carregarFinalidades(id);
      await carregarFotos(id);
    } catch (error) {
      console.error("Erro ao carregar imovel:", error);
      setSubmitMessage({
        type: "error",
        text: "Erro ao carregar dados do imovel. Tente novamente.",
      });
    } finally {
      setLoadingDados(false);
    }
  };

  // =============== FUNCOES DE BUSCA CEP ===============
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepError("CEP deve ter 8 digitos");
      return;
    }
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(
        `https://aqhiaherelldknfpscrd.supabase.co/functions/v1/buscar-cep/${cepLimpo}`,
      );

      const data = await response.json();

      if (data.error) {
        if (data.error === "CEP nao encontrado") {
          setCepError("CEP nao encontrado");
        } else if (data.error === "ViaCEP temporariamente indisponivel") {
          setCepError(
            "Servico de CEP esta fora do ar. Tente novamente em alguns minutos ou digite o endereco manualmente.",
          );
        } else {
          setCepError("Erro ao buscar CEP. Tente novamente.");
        }
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
      console.error("Erro:", error);
      setCepError("Erro ao buscar CEP. Verifique sua conexao.");
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

    // Campos de preço (já tratados pelo PriceInput)
    if (name === "preco_venda" || name === "preco_aluguel") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

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

    if (!formData.finalidade_venda && !formData.finalidade_aluguel) {
      setSubmitMessage({
        type: "error",
        text: "Selecione pelo menos uma finalidade (venda ou aluguel)",
      });
      setLoading(false);
      return;
    }

    if (formData.finalidade_venda && !formData.preco_venda) {
      setSubmitMessage({
        type: "error",
        text: "Preco de venda e obrigatorio quando a finalidade venda esta selecionada",
      });
      setLoading(false);
      return;
    }

    if (formData.finalidade_aluguel && !formData.preco_aluguel) {
      setSubmitMessage({
        type: "error",
        text: "Preco de aluguel e obrigatorio quando a finalidade aluguel esta selecionada",
      });
      setLoading(false);
      return;
    }

    const dadosParaSupabase = {
      codigo: formData.codigo,
      titulo: formData.titulo,
      finalidade_venda: formData.finalidade_venda,
      finalidade_aluguel: formData.finalidade_aluguel,
      tipo: formData.tipo,
      preco_venda: formData.finalidade_venda
        ? parseFloat(formData.preco_venda)
        : null,
      preco_aluguel: formData.finalidade_aluguel
        ? parseFloat(formData.preco_aluguel)
        : null,
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
      quartos: parseInt(formData.quartos) || 0,
      suites: parseInt(formData.suites) || 0,
      banheiros: parseInt(formData.banheiros) || 0,
      vagas: parseInt(formData.vagas) || 1,
      area_total: parseFloat(formData.area_total) || 0,
      area_construida: parseFloat(formData.area_construida) || 0,
      area_privativa: parseFloat(formData.area_privativa) || 0,
      condominio_mensal: parseFloat(formData.condominio_mensal) || 0,
      iptu_anual: parseFloat(formData.iptu_anual) || 0,
      cep: formData.cep || "",
      endereco: formData.endereco || "",
      numero: formData.numero || "",
      complemento: formData.complemento || "",
      bairro: formData.bairro || "",
      cidade: formData.cidade || "",
      estado: formData.estado || "",
      exibir_endereco_site: formData.exibirEnderecoSite || false,
      preco_anterior: formData.precoAnterior
        ? parseFloat(formData.precoAnterior)
        : null,
      etiquetas: formData.etiquetas,
      caracteristicas: formData.caracteristicas,
      infraestrutura: formData.infraestrutura || {},
      acabamentos: formData.acabamentos || {},
      area_lazer: formData.areaLazer || {},
      localizacao_vizinhanca: formData.localizacaoVizinhanca || {},
      seguranca: formData.seguranca || {},
      armarios_armazenamento: formData.armariosArmazenamento || {},
      servicos_utilidades: formData.servicosUtilidades || {},
      diferenciais: formData.diferenciais || {},
      descricao: formData.descricao || "",
      observacoes: formData.observacoes || "",
      updated_at: new Date(),
    };

    try {
      // Atualizar imóvel
      const { error } = await supabase
        .from("imoveis")
        .update(dadosParaSupabase)
        .eq("id", id);

      if (error) throw error;

      // Atualizar finalidades
      const { error: deleteError } = await supabase
        .from("imovel_finalidades")
        .delete()
        .eq("imovel_id", id);

      if (deleteError) throw deleteError;

      const finalidadesParaInserir = [];

      if (formData.finalidade_venda) {
        finalidadesParaInserir.push({
          imovel_id: id,
          tipo: "venda",
          preco: parseFloat(formData.preco_venda),
          status: "ativo",
        });
      }

      if (formData.finalidade_aluguel) {
        finalidadesParaInserir.push({
          imovel_id: id,
          tipo: "aluguel",
          preco: parseFloat(formData.preco_aluguel),
          status: "ativo",
        });
      }

      if (finalidadesParaInserir.length > 0) {
        const { error: insertError } = await supabase
          .from("imovel_finalidades")
          .insert(finalidadesParaInserir);

        if (insertError) throw insertError;
      }

      // Atualizar fotos
      try {
        const { error: deleteFotosError } = await supabase
          .from("fotos_imovel")
          .delete()
          .eq("imovel_id", id);

        if (deleteFotosError) throw deleteFotosError;

        if (fotos.length === 0) {
          console.log("Nenhuma foto para salvar");
          return;
        }

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
          const { error: insertFotosError } = await supabase
            .from("fotos_imovel")
            .insert(fotosParaInserir);

          if (insertFotosError) throw insertFotosError;
        }
      } catch (fotoError) {
        console.error("Erro nas fotos:", fotoError);
        throw fotoError;
      }

      setSubmitMessage({
        type: "success",
        text: `Imovel "${formData.titulo}" atualizado com sucesso!`,
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
        "Tem certeza que deseja cancelar? As alteracoes serao perdidas.",
      )
    ) {
      navigate("/admin/imoveis");
    }
  };

  // =============== FUNCOES DE CORES (TEMA) ===============
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
  const getCheckboxClass = () =>
    `appearance-none h-5 w-5 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/50 focus:ring-offset-2 ${
      isDark ? "bg-gray-800" : "bg-white"
    } ${getCheckboxBorderClass()} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:after:absolute checked:after:content-[''] checked:after:h-[0.625rem] checked:after:w-[0.3125rem] checked:after:rotate-45 checked:after:translate-x-[0.375rem] checked:after:translate-y-[0.125rem] checked:after:border-solid checked:after:border-white checked:after:border-width-0 checked:after:border-r-2 checked:after:border-b-2`;
  const getInputClasses = () =>
    `${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`;

  // =============== OPCOES PARA SELECTS ===============
  const tiposImovel = [
    { value: "apartamento", label: "Apartamento" },
    { value: "casa", label: "Casa" },
    { value: "terreno", label: "Terreno" },
    { value: "comercial", label: "Comercial" },
    { value: "sobrado", label: "Sobrado" },
    { value: "kitnet", label: "Kitnet" },
    { value: "fazenda", label: "Fazenda" },
    { value: "chacara", label: "Chacara" },
    { value: "sitio", label: "Sitio" },
    { value: "galpao", label: "Galpao" },
  ];

  const estadosBrasil = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapa" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceara" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espirito Santo" },
    { value: "GO", label: "Goias" },
    { value: "MA", label: "Maranhao" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Para" },
    { value: "PB", label: "Paraiba" },
    { value: "PR", label: "Parana" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piaui" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondonia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "Sao Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  const proprietarios = [
    { id: "1", nome: "Maria Silva" },
    { id: "2", nome: "Joao Santos" },
    { id: "3", nome: "Ana Oliveira" },
  ];

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
            Carregando dados do imovel...
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
      {/* ===== HEADER COM BOTOES FIXOS ===== */}
      <div
        className={`sticky top-0 z-50 border-b px-4 py-3 transition-colors duration-200 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                  Editar Imovel
                </h1>
                <p
                  className={`text-xs md:text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  {formData.codigo} • {formData.titulo?.substring(0, 40)}
                  {formData.titulo?.length > 40 ? "..." : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 md:space-x-3">
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
                  form="form-editar-imovel"
                  disabled={loading}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-[#D4A24D] hover:bg-[#C4933E] text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4A24D] focus:ring-offset-2 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Atualizar Imovel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteudo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form
          id="form-editar-imovel"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* ========== SECAO 1: INFORMACOES GERAIS ========== */}
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
                  Informacoes Gerais do Imovel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Dados para identificacao, comercializacao e gestao
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Codigo do Imovel *
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: APT-001"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Titulo do Anuncio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Casa moderna com piscina no Jardins"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Finalidade *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="finalidade_venda"
                        checked={formData.finalidade_venda}
                        onChange={handleChange}
                        className={getCheckboxClass()}
                      />
                      <span
                        className={`font-medium transition-colors ${getTextClass()}`}
                      >
                        Venda
                      </span>
                    </label>

                    {formData.finalidade_venda && (
                      <div className="ml-8">
                        <PriceInput
                          name="preco_venda"
                          value={formData.preco_venda}
                          onChange={handleChange}
                          label="Preco de Venda"
                          required={formData.finalidade_venda}
                          isDark={isDark}
                          getInputClasses={getInputClasses}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="finalidade_aluguel"
                        checked={formData.finalidade_aluguel}
                        onChange={handleChange}
                        className={getCheckboxClass()}
                      />
                      <span
                        className={`font-medium transition-colors ${getTextClass()}`}
                      >
                        Aluguel
                      </span>
                    </label>

                    {formData.finalidade_aluguel && (
                      <div className="ml-8">
                        <PriceInput
                          name="preco_aluguel"
                          value={formData.preco_aluguel}
                          onChange={handleChange}
                          label="Preco de Aluguel"
                          required={formData.finalidade_aluguel}
                          isDark={isDark}
                          getInputClasses={getInputClasses}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Tipo do Imovel *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Proprietario
                </label>
                <select
                  name="proprietarioId"
                  value={formData.proprietarioId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecionar proprietario
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
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Corretor Responsavel
                </label>
                <select
                  name="corretorId"
                  value={formData.corretorId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    {loadingCorretores
                      ? "Carregando corretores..."
                      : "Selecionar corretor"}
                  </option>
                  {corretoresReais.map((corretor) => (
                    <option
                      key={corretor.id}
                      value={corretor.id}
                      className={getOptionBgClass()}
                    >
                      {corretor.nome}{" "}
                      {corretor.creci ? `(CRECI: ${corretor.creci})` : ""}
                    </option>
                  ))}
                </select>
                {corretoresReais.length === 0 && !loadingCorretores && (
                  <p
                    className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                  >
                    Nenhum corretor ativo encontrado. Cadastre um corretor
                    primeiro.
                  </p>
                )}
              </div>
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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                >
                  <option value="disponivel" className={getOptionBgClass()}>
                    Disponivel
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
                  Imovel financiavel
                </label>
              </div>
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
                  Imovel em condominio
                </label>
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  name="ocultarPreco"
                  checked={formData.ocultarPreco}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <span className={`text-sm transition-colors ${getTextClass()}`}>
                  Ocultar preco na vitrine
                </span>
              </div>
            </div>

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
                    Vinculo com Empreendimento
                  </h3>
                  {formData.tipo === "apartamento" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Edificio obrigatorio
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
                      Condominio/Residencial
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  {formData.tipo === "casa" && (
                    <>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Lote/Numero
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

                {formData.tipo === "apartamento" &&
                  !formData.empreendimento_id && (
                    <p
                      className={`text-xs mt-3 flex items-center ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Apartamento precisa estar vinculado a um Edificio.
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
                      Casa em condominio precisa estar vinculada a um
                      Condominio/Residencial.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* ========== SECAO: DEPENDENCIAS DO IMOVEL ========== */}
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
                  Dependencias do Imovel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Quantidade de comodos, vagas e areas do imovel
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Dormitorios
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quartos: Math.max(0, (parseInt(prev.quartos) || 0) - 1),
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="quartos"
                    value={formData.quartos}
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
                        quartos: (parseInt(prev.quartos) || 0) + 1,
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
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
                        banheiros: Math.max(
                          0,
                          (parseInt(prev.banheiros) || 0) - 1,
                        ),
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="banheiros"
                    value={formData.banheiros}
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
                        banheiros: (parseInt(prev.banheiros) || 0) + 1,
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Suite
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        suites: Math.max(0, (parseInt(prev.suites) || 0) - 1),
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="suites"
                    value={formData.suites}
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
                        suites: (parseInt(prev.suites) || 0) + 1,
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
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
                        vagas: Math.max(0, (parseInt(prev.vagas) || 0) - 1),
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="vagas"
                    value={formData.vagas}
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
                        vagas: (parseInt(prev.vagas) || 0) + 1,
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Area Total (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="area_total"
                    value={formData.area_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Area Construida (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="area_construida"
                    value={formData.area_construida}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Area Privativa (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="area_privativa"
                    value={formData.area_privativa}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Condominio Mensal (R$)
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    name="condominio_mensal"
                    value={formData.condominio_mensal}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== SECAO: LOCALIZACAO DO IMOVEL ========== */}
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
                  Localizacao do Imovel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereco para controle interno e exibicao no site
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
                      CEP valido. Endereco preenchido automaticamente.
                    </p>
                  )}
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereco
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Ex: Rua das Flores"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Numero
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="Ex: 123"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

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
                  placeholder="Ex: Acailandia"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
                      Mostrar endereco completo no site
                    </div>
                    <div className={`text-sm ${getTextSecondaryClass()}`}>
                      Se marcado, o endereco (Rua, Numero) aparecera na pagina
                      publica do imovel.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========== SECAO: EXIBIR NA VITRINE ========== */}
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
                  Exibir na Vitrine
                </h2>
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  De destaque especial ao seu imovel na pagina principal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    Badge azul para imoveis recentes
                  </div>
                </div>
              </label>

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
                    📉 Baixou o Preco
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge vermelho indicando reducao
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.financivel"
                  checked={formData.etiquetas.financivel}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    💰 Financiavel
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge roxo para financiamento
                  </div>
                </div>
              </label>
            </div>

            {formData.etiquetas.baixouPreco && (
              <div className="mt-6 p-5 border-2 border-red-500/30 bg-red-500/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📉</div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-white mb-1">
                      Informe o preco anterior
                    </h4>
                    <p className="text-sm text-white/80 mb-4">
                      Este valor aparecera riscado ao lado do preco atual na
                      pagina do imovel.
                    </p>

                    <div className="max-w-md mb-4">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Preco anterior (R$)
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

                    {formData.preco_venda && formData.precoAnterior && (
                      <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-white/70 mb-2">
                          Preview do preco na pagina do imovel:
                        </p>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="text-gray-300 line-through text-sm">
                            {formatPrice(formData.precoAnterior)}
                          </span>
                          <span className="text-white font-bold text-base">
                            {formatPrice(formData.preco_venda)}
                          </span>
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -
                            {Math.round(
                              ((formData.precoAnterior - formData.preco_venda) /
                                formData.precoAnterior) *
                                100,
                            )}
                            % OFF
                          </span>
                        </div>
                        <p className="text-green-400 text-xs mt-2">
                          Economia de{" "}
                          {formatPrice(
                            formData.precoAnterior - formData.preco_venda,
                          )}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-white/60 mt-2">
                      Dica: Quanto maior o desconto aparente, mais atrativo o
                      imovel fica.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    {formData.titulo || "Titulo do Imovel"}
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
                    {formData.etiquetas.financivel && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium flex items-center gap-1">
                        💰 Financiavel
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
                <div className="mt-3 flex flex-wrap gap-4">
                  {formData.finalidade_venda && formData.preco_venda && (
                    <div className="text-sm">
                      <span className="text-gray-500">Venda: </span>
                      <span className="font-bold text-green-600">
                        {formatPrice(formData.preco_venda)}
                      </span>
                    </div>
                  )}
                  {formData.finalidade_aluguel && formData.preco_aluguel && (
                    <div className="text-sm">
                      <span className="text-gray-500">Aluguel: </span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(formData.preco_aluguel)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className={`text-xs mt-3 ${getTextSecondaryClass()}`}>
                Na vitrine, mostramos: Titulo + Badges + Bairro, Cidade/UF +
                Precos
              </p>
            </div>
          </div>

          {/* ========== SECAO: FOTOS DO IMOVEL ========== */}
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
                  Fotos do Imovel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Arraste para organizar • Clique na estrela para definir a capa
                  • Maximo 20 fotos
                </p>
              </div>
            </div>

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
                    PNG, JPG ou JPEG (max. 5MB cada)
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

            {fotos.length > 0 && (
              <div
                className={`mt-4 p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
              >
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  <span className="font-medium text-[#D4A24D]">
                    ⭐ Foto de capa:
                  </span>{" "}
                  Sera a primeira imagem do carrossel e a miniatura do imovel.
                </p>
                <p className={`text-sm ${getTextSecondaryClass()} mt-1`}>
                  <span className="font-medium"> Arraste:</span> As fotos podem
                  ser reorganizadas livremente.
                </p>
              </div>
            )}
          </div>

          {/* ========== SECAO: CUSTOS ADICIONAIS ========== */}
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
                  IPTU e outros custos do imovel
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO: ACCORDIONS ========== */}
          <div className="space-y-4">
            {/* CARACTERISTICAS DO IMOVEL */}
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
                      Caracteristicas do Imovel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Medidas, estrutura, infraestrutura e informacoes
                      estrategicas
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
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <CubeTransparentIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          Medidas e Dimensoes
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Area util (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaUtil"
                            value={formData.caracteristicas.areaUtil}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Area privativa (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaPrivativa"
                            value={formData.caracteristicas.areaPrivativa}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Pe direito (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.peDireito"
                            value={formData.caracteristicas.peDireito}
                            onChange={handleChange}
                            placeholder="Ex: 3,20m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <HomeIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          Estrutura do Imovel
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de construcao
                          </label>
                          <select
                            name="caracteristicas.tipoConstrucao"
                            value={formData.caracteristicas.tipoConstrucao}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            Ano de construcao
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.anoConstrucao"
                            value={formData.caracteristicas.anoConstrucao}
                            onChange={handleChange}
                            placeholder="Ex: 2020"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Numero de pavimentos
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.numeroPavimentos"
                            value={formData.caracteristicas.numeroPavimentos}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            Imovel averbado?
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
                            Financiavel?
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

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <LightBulbIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          Infraestrutura interna
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de iluminacao
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.tipoIluminacao"
                            value={formData.caracteristicas.tipoIluminacao}
                            onChange={handleChange}
                            placeholder="Ex: LED, Fluorescente"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            placeholder="Ex: Ceramica, Metalico"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Caixa d'agua (litros)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.caixaDAgua"
                            value={formData.caracteristicas.caixaDAgua}
                            onChange={handleChange}
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option
                              value="rede_publica"
                              className={getOptionBgClass()}
                            >
                              Rede Publica
                            </option>
                            <option
                              value="fossa_septica"
                              className={getOptionBgClass()}
                            >
                              Fossa Septica
                            </option>
                            <option
                              value="fossa_filtro"
                              className={getOptionBgClass()}
                            >
                              Fossa e Filtro
                            </option>
                            <option
                              value="sumidouro"
                              className={getOptionBgClass()}
                            >
                              Sumidouro
                            </option>
                            <option
                              value="fossa_ecologica"
                              className={getOptionBgClass()}
                            >
                              Fossa Ecologica/Biodigestor
                            </option>
                            <option
                              value="inexistente"
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
                            Aquecimento de agua
                          </label>
                          <select
                            name="caracteristicas.aquecimentoAgua"
                            value={formData.caracteristicas.aquecimentoAgua}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            <option value="gas" className={getOptionBgClass()}>
                              Gas
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
                              Eletrico
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
                            Sistema eletrico novo?
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPinIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          Informacoes estrategicas
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Posicao solar
                          </label>
                          <select
                            name="caracteristicas.posicaoSolar"
                            value={formData.caracteristicas.posicaoSolar}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            Condominio com taxa mensal (R$)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.condominioTaxaMensal"
                            value={
                              formData.caracteristicas.condominioTaxaMensal
                            }
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
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
                            Ventilacao cruzada
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
                            Rua sem saida
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

            {/* ACABAMENTOS */}
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
                    <div>
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        Pisos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "pisoPorcelanato", label: "Porcelanato" },
                          { key: "pisoCeramica", label: "Ceramica" },
                          { key: "pisoLaminado", label: "Piso laminado" },
                          { key: "pisoVinilico", label: "Piso vinilico" },
                          { key: "pisoMadeiraMaciça", label: "Madeira macica" },
                          { key: "pisoTaco", label: "Taco" },
                          {
                            key: "pisoCimentoQueimado",
                            label: "Cimento queimado",
                          },
                          { key: "pisoMarmore", label: "Marmore" },
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

                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        Revestimentos de parede
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

                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        Teto e forro
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

                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        Esquadrias e portas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            key: "portaMadeiraMaciça",
                            label: "Porta de madeira macica",
                          },
                          { key: "portaLaqueada", label: "Porta laqueada" },
                          {
                            key: "esquadriaAluminio",
                            label: "Esquadrias de aluminio",
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

                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        Bancadas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "bancadaGranito", label: "Granito" },
                          { key: "bancadaMarmore", label: "Marmore" },
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

            {/* AREA DE LAZER */}
            <CheckboxAccordion
              title="Area de Lazer"
              subtitle="Instalacoes de lazer e entretenimento"
              icon={SunIcon}
              section="areaLazer"
              isOpen={accordionOpen.areaLazer}
              onToggle={() => toggleAccordion("areaLazer")}
              items={[
                { key: "piscina", label: "Piscina" },
                { key: "churrasqueira", label: "Churrasqueira" },
                { key: "espacoGourmet", label: "Espaco gourmet" },
                { key: "salaoFestas", label: "Salao de festas" },
                { key: "salaoJogos", label: "Salao de jogos" },
                { key: "academia", label: "Academia" },
                { key: "playground", label: "Playground" },
                { key: "quadraPoliesportiva", label: "Quadra poliesportiva" },
                { key: "campoSociety", label: "Campo society" },
                { key: "areaVerde", label: "Area verde" },
                { key: "jardim", label: "Jardim" },
                { key: "deck", label: "Deck" },
                { key: "rooftop", label: "Rooftop" },
                { key: "sauna", label: "Sauna" },
                { key: "espacoPet", label: "Espaco pet" },
                { key: "brinquedoteca", label: "Brinquedoteca" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />

            {/* LOCALIZACAO E VIZINHANCA */}
            <CheckboxAccordion
              title="Localizacao e Vinhanca"
              subtitle="Proximidade de servicos e caracteristicas do entorno"
              icon={MapPinIcon}
              section="localizacaoVizinhanca"
              isOpen={accordionOpen.localizacaoVizinhanca}
              onToggle={() => toggleAccordion("localizacaoVizinhanca")}
              items={[
                { key: "proximoCentro", label: "Proximo ao centro" },
                { key: "proximoSupermercado", label: "Proximo a supermercado" },
                { key: "proximoEscola", label: "Proximo a escola" },
                { key: "proximoHospital", label: "Proximo a hospital" },
                { key: "proximoFarmacia", label: "Proximo a farmacia" },
                { key: "proximoOnibus", label: "Proximo a ponto de onibus" },
                { key: "proximoShopping", label: "Proximo a shopping" },
                { key: "proximoFaculdade", label: "Proximo a faculdade" },
                { key: "bairroResidencial", label: "Bairro residencial" },
                { key: "bairroComercial", label: "Bairro comercial" },
                { key: "ruaAsfaltada", label: "Rua asfaltada" },
                { key: "ruaTranquila", label: "Rua tranquila" },
                { key: "regiaoValorizada", label: "Regiao valorizada" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />

            {/* SEGURANCA */}
            <CheckboxAccordion
              title="Seguranca"
              subtitle="Sistemas de seguranca e protecao patrimonial"
              icon={ShieldCheckIcon}
              section="seguranca"
              isOpen={accordionOpen.seguranca}
              onToggle={() => toggleAccordion("seguranca")}
              items={[
                { key: "portaoEletronico", label: "Portao eletronico" },
                { key: "interfone", label: "Interfone" },
                { key: "cercaEletrica", label: "Cerca eletrica" },
                { key: "sistemaCameras", label: "Sistema de cameras" },
                { key: "alarme", label: "Alarme" },
                { key: "portaria24h", label: "Portaria 24h" },
                { key: "vigilancia24h", label: "Vigilancia 24h" },
                { key: "controleAcesso", label: "Controle de acesso" },
                { key: "fechaduraDigital", label: "Fechadura digital" },
                { key: "condominioFechado", label: "Condominio fechado" },
                { key: "murosAltos", label: "Muros altos" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />

            {/* ARMARIOS E ARMAZENAMENTO */}
            <CheckboxAccordion
              title="Armarios e Armazenamento"
              subtitle="Moveis planejados e solucoes de armazenamento"
              icon={BuildingStorefrontIcon}
              section="armariosArmazenamento"
              isOpen={accordionOpen.armariosArmazenamento}
              onToggle={() => toggleAccordion("armariosArmazenamento")}
              items={[
                {
                  key: "armarioCozinhaPlanejado",
                  label: "Armario de cozinha planejado",
                },
                { key: "armariosEmbutidos", label: "Armarios embutidos" },
                { key: "armariosQuarto", label: "Armarios no quarto" },
                { key: "armariosBanheiro", label: "Armarios no banheiro" },
                { key: "closet", label: "Closet" },
                { key: "despensa", label: "Despensa" },
                { key: "deposito", label: "Deposito" },
                { key: "roupeiro", label: "Roupeiro" },
                { key: "maleiro", label: "Maleiro" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />

            {/* SERVICOS E UTILIDADES */}
            <CheckboxAccordion
              title="Servicos e Utilidades"
              subtitle="Servicos coletivos, utilidades e infraestrutura urbana"
              icon={BoltIcon}
              section="servicosUtilidades"
              isOpen={accordionOpen.servicosUtilidades}
              onToggle={() => toggleAccordion("servicosUtilidades")}
              items={[
                { key: "aguaEncanada", label: "Agua encanada" },
                { key: "energiaEletrica", label: "Energia eletrica" },
                { key: "pocoArtesiano", label: "Poco artesiano" },
                { key: "aquecimentoGas", label: "Aquecimento a gas" },
                { key: "aquecimentoSolar", label: "Aquecimento solar" },
                { key: "gasEncanado", label: "Gas encanado" },
                {
                  key: "arCondicionadoInstalado",
                  label: "Ar-condicionado instalado",
                },
                {
                  key: "infraArCondicionado",
                  label: "Infra para ar-condicionado",
                },
                { key: "internetFibra", label: "Internet fibra disponivel" },
                { key: "iluminacaoLED", label: "Iluminacao em LED" },
                { key: "energiaSolar", label: "Sistema de energia solar" },
                { key: "elevador", label: "Elevador" },
                { key: "coletaLixo", label: "Coleta de lixo regular" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />

            {/* DIFERENCIAIS DO IMOVEL */}
            <CheckboxAccordion
              title="Diferenciais do Imovel"
              subtitle="Caracteristicas especiais que valorizam o imovel"
              icon={HeartIcon}
              section="diferenciais"
              isOpen={accordionOpen.diferenciais}
              onToggle={() => toggleAccordion("diferenciais")}
              items={[
                { key: "varanda", label: "Varanda" },
                { key: "sacada", label: "Sacada" },
                { key: "lavabo", label: "Lavabo" },
                { key: "banheira", label: "Banheira" },
                { key: "boxVidro", label: "Box de vidro" },
                {
                  key: "dependenciaEmpregada",
                  label: "Dependencia de empregada",
                },
                { key: "escritorio", label: "Escritorio" },
                { key: "peDireitoDuplo", label: "Pe direito duplo" },
                { key: "mezanino", label: "Mezanino" },
                { key: "vistaPanoramica", label: "Vista panoramica" },
              ]}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              isDark={isDark}
              getBorderClass={getBorderClass}
              getHoverBgClass={getHoverBgClass}
              getTextClass={getTextClass}
              getCheckboxClass={getCheckboxClass}
              getIconBgClass={getIconBgClass}
              getIconColorClass={getIconColorClass}
              getAccordionTitleClass={getAccordionTitleClass}
              getAccordionSubtitleClass={getAccordionSubtitleClass}
              getTextSecondaryClass={getTextSecondaryClass}
            />
          </div>

          {/* ========== SECAO: DESCRICAO E OBSERVACOES ========== */}
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
                  Descricao e Observacoes
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Informacoes detalhadas para clientes e uso interno
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Descricao do Imovel *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva o imovel com detalhes: acabamentos, diferenciais, localizacao, etc..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Observacoes Internas
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Observacoes para uso interno da imobiliaria (nao aparece para clientes)..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
                  Voce sera redirecionado para a lista de imoveis em alguns
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
