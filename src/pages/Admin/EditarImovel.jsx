// E:\DEV\react\adventus-imob\src\pages\Admin\EditarImovel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  SunIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  BoltIcon,
  SparklesIcon,
  HeartIcon,
  CubeTransparentIcon,
  BeakerIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  PlusIcon,
  CameraIcon,
  StarIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import { slugify } from "../../lib/slugify";

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

const formatPriceWithSeparators = (value) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  const amount = (parseInt(numbers, 10) / 100).toFixed(2);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CustomCheckboxGroup = ({
  title,
  icon: Icon,
  items,
  section,
  formData,
  setFormData,
  isDark,
  getBorderClass,
  getHoverBgClass,
  getTextClass,
  getCheckboxClass,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  useEffect(() => {
    const sectionData = getNestedValue(formData, section);
    if (
      sectionData?.personalizados &&
      Array.isArray(sectionData.personalizados)
    ) {
      setCustomItems(sectionData.personalizados);
    }
  }, [formData, section]);

  const allItems = [
    ...items,
    ...customItems.map((c) => ({ key: c.id, label: c.name })),
  ];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCheckboxChange = (key, checked) => {
    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [key]: checked,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...prev[parent]?.[child1]?.[child2],
                [key]: checked,
              },
            },
          },
        };
      }
      return prev;
    });
  };

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;

    const nomeLower = newItemName.trim().toLowerCase();
    const sectionData = getNestedValue(formData, section) || {};
    const currentPersonalizados = sectionData.personalizados || [];

    const jaExiste = currentPersonalizados.some(
      (item) => item.name.toLowerCase() === nomeLower,
    );

    if (jaExiste) {
      setNewItemName("");
      setShowAddForm(false);
      return;
    }

    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { id: newItemId, name: newItemName.trim() };

    const updatedCustomItems = [...currentPersonalizados, newItem];
    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [newItemId]: false,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...prev[parent]?.[child1]?.[child2],
                [newItemId]: false,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
    });

    setNewItemName("");
    setShowAddForm(false);
  };

  const handleRemoveCustomItem = (itemId) => {
    const updatedCustomItems = customItems.filter((item) => item.id !== itemId);
    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const newSection = { ...prev[parent]?.[child] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...newSection,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        const newSection = { ...prev[parent]?.[child1]?.[child2] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...newSection,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Icon && (
            <Icon
              className={`w-5 h-5 ${isDark ? "text-[#D4A24D]" : "text-[#D4A24D]"}`}
            />
          )}
          <h4 className={`text-md font-semibold ${getTextClass()}`}>{title}</h4>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Adicionar item</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>

      {showAddForm && (
        <div
          className={`p-4 border rounded-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nome do item (ex: Piscina aquecida)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomItem()}
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="p-2 bg-[#D4A24D] hover:bg-[#c0913c] text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
        {filteredItems.map((item) => {
          const isCustom = item.key.toString().startsWith("custom-");
          const sectionData = getNestedValue(formData, section) || {};
          const isChecked = sectionData[item.key] || false;

          return (
            <div key={item.key} className="relative group">
              <label
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleCheckboxChange(item.key, e.target.checked)
                  }
                  className={getCheckboxClass()}
                />
                <span className={`transition-colors flex-1 ${getTextClass()}`}>
                  {item.label}
                </span>
              </label>

              {isCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustomItem(item.key);
                  }}
                  className={`absolute -top-2 -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                  title="Remover item"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div
            className={`col-span-3 p-8 text-center border rounded-lg ${getBorderClass()}`}
          >
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Nenhum item encontrado.{" "}
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="text-[#D4A24D] hover:underline font-medium"
              >
                Adicionar agora
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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
        <input
          type="text"
          name={name}
          value={displayValue}
          onChange={handlePriceChange}
          required={required}
          placeholder="R$ 0,00"
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
        />
      </div>
    </div>
  );
};

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

        <div
          className={`absolute top-2 left-2 ${isCapa ? "bg-[#D4A24D]" : "bg-black/70"} text-white text-xs font-bold px-2 py-1 rounded-full`}
        >
          {isCapa ? "⭐ CAPA" : `#${index + 1}`}
        </div>

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

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  useEffect(() => {
    const sectionData = getNestedValue(formData, section);
    if (
      sectionData?.personalizados &&
      Array.isArray(sectionData.personalizados)
    ) {
      setCustomItems(sectionData.personalizados);
    }
  }, [formData, section]);

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;

    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { id: newItemId, name: newItemName.trim() };

    const sectionData = getNestedValue(formData, section) || {};
    const currentPersonalizados = sectionData.personalizados || [];
    const updatedCustomItems = [...currentPersonalizados, newItem];

    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [newItemId]: false,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...prev[parent]?.[child1]?.[child2],
                [newItemId]: false,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
    });

    setNewItemName("");
    setShowAddForm(false);
  };

  const handleRemoveCustomItem = (itemId) => {
    const updatedCustomItems = customItems.filter((item) => item.id !== itemId);
    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const newSection = { ...prev[parent]?.[child] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...newSection,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        const newSection = { ...prev[parent]?.[child1]?.[child2] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...newSection,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
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
              {items.map(({ key, label }) => {
                const sectionData = getNestedValue(formData, section) || {};
                const isChecked = sectionData[key] || false;

                return (
                  <label
                    key={key}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
                  >
                    <input
                      type="checkbox"
                      name={`${section}.${key}`}
                      checked={isChecked}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span className={getTextClass()}>{label}</span>
                  </label>
                );
              })}

              {customItems.map((item) => {
                const sectionData = getNestedValue(formData, section) || {};
                const isChecked = sectionData[item.id] || false;

                return (
                  <div key={item.id} className="relative group">
                    <label
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
                    >
                      <input
                        type="checkbox"
                        name={`${section}.${item.id}`}
                        checked={isChecked}
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
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  useEffect(() => {
    const sectionData = getNestedValue(formData, section);
    if (
      sectionData?.personalizados &&
      Array.isArray(sectionData.personalizados)
    ) {
      setCustomItems(sectionData.personalizados);
    } else {
      setCustomItems([]);
    }
  }, [formData, section]);

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) return;

    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { id: newItemId, name: newItemName.trim() };

    const sectionData = getNestedValue(formData, section) || {};
    const currentPersonalizados = sectionData.personalizados || [];
    const updatedCustomItems = [...currentPersonalizados, newItem];

    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [newItemId]: false,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...prev[parent]?.[child1]?.[child2],
                [newItemId]: false,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
    });

    setNewItemName("");
    setShowAddForm(false);
  };

  const handleRemoveCustomItem = (itemId) => {
    const updatedCustomItems = customItems.filter((item) => item.id !== itemId);
    setCustomItems(updatedCustomItems);

    setFormData((prev) => {
      const parts = section.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const newSection = { ...prev[parent]?.[child] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...newSection,
              personalizados: updatedCustomItems,
            },
          },
        };
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        const newSection = { ...prev[parent]?.[child1]?.[child2] };
        delete newSection[itemId];
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child1]: {
              ...prev[parent]?.[child1],
              [child2]: {
                ...newSection,
                personalizados: updatedCustomItems,
              },
            },
          },
        };
      }
      return prev;
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
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomItem()}
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="px-3 py-2 bg-[#D4A24D] text-white rounded-lg"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg"
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(({ key, label }) => {
          const sectionData = getNestedValue(formData, section) || {};
          const isChecked = sectionData[key] || false;

          return (
            <label
              key={key}
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
            >
              <input
                type="checkbox"
                name={`${section}.${key}`}
                checked={isChecked}
                onChange={handleChange}
                className={getCheckboxClass()}
              />
              <span className={getTextClass()}>{label}</span>
            </label>
          );
        })}

        {customItems.map((item) => {
          const sectionData = getNestedValue(formData, section) || {};
          const isChecked = sectionData[item.id] || false;

          return (
            <div key={item.id} className="relative group">
              <label
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name={`${section}.${item.id}`}
                  checked={isChecked}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <span className={getTextClass()}>{item.name}</span>
              </label>
              <button
                type="button"
                onClick={() => handleRemoveCustomItem(item.id)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SelectCidade = ({
  value,
  onChange,
  required,
  isDark,
  getInputClasses,
}) => {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCidades = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("cidades")
          .select("id, nome, uf")
          .order("nome");

        if (error) throw error;
        setCidades(data || []);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCidades();
  }, []);

  return (
    <select
      name="cidade"
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
    >
      <option value="" className={isDark ? "bg-gray-800" : "bg-white"}>
        {loading ? "Carregando cidades..." : "Selecione a cidade"}
      </option>
      {cidades.map((cidade) => (
        <option
          key={cidade.id}
          value={cidade.nome}
          className={isDark ? "bg-gray-800" : "bg-white"}
        >
          {cidade.nome} - {cidade.uf}
        </option>
      ))}
    </select>
  );
};

const SelectBairro = ({
  value,
  onChange,
  cidadeSelecionada,
  required,
  isDark,
  getInputClasses,
}) => {
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBairros = async () => {
      if (!cidadeSelecionada) {
        setBairros([]);
        return;
      }

      setLoading(true);
      try {
        const { data: cidadeData, error: cidadeError } = await supabase
          .from("cidades")
          .select("id")
          .eq("nome", cidadeSelecionada)
          .single();

        if (cidadeError) throw cidadeError;

        if (cidadeData) {
          const { data, error } = await supabase
            .from("bairros")
            .select("id, nome")
            .eq("cidade_id", cidadeData.id)
            .order("nome");

          if (error) throw error;
          setBairros(data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar bairros:", error);
        setBairros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBairros();
  }, [cidadeSelecionada]);

  return (
    <select
      name="bairro"
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
      disabled={!cidadeSelecionada}
    >
      <option value="" className={isDark ? "bg-gray-800" : "bg-white"}>
        {!cidadeSelecionada
          ? "Selecione uma cidade primeiro"
          : loading
            ? "Carregando bairros..."
            : "Selecione o bairro"}
      </option>
      {bairros.map((bairro) => (
        <option
          key={bairro.id}
          value={bairro.nome}
          className={isDark ? "bg-gray-800" : "bg-white"}
        >
          {bairro.nome}
        </option>
      ))}
    </select>
  );
};

const EditarImovel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const [fotos, setFotos] = useState([]);
  const [uploadingFotos, setUploadingFotos] = useState(false);
  const [fotosError, setFotosError] = useState("");
  const [fotosCarregadas, setFotosCarregadas] = useState(false);

  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [corretoresReais, setCorretoresReais] = useState([]);
  const [loadingCorretores, setLoadingCorretores] = useState(false);

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

  const [isRural, setIsRural] = useState(false);
  const [showRuralFields, setShowRuralFields] = useState(false);

  const [formData, setFormData] = useState({
    codigo: "",
    titulo: "",
    slug: "",
    tipo: "",
    status: "disponivel",
    financiado: false,
    em_condominio: false,
    proprietario_id: "",
    corretor_id: "",
    ocultar_preco: false,

    finalidade_venda: false,
    finalidade_aluguel: false,
    preco_venda: "",
    preco_aluguel: "",

    // Preço anterior para a funcionalidade "Baixou o Preço"
    precoAnterior: "",

    id_edificios: "",
    unidade: "",
    andar: "",
    lote: "",
    bloco: "",
    quadra: "",

    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,
    area_total: 0,
    area_construida: 0,
    area_privativa: 0,

    condominio_mensal: 0,
    iptu_anual: 0,

    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    exibir_endereco_site: false,

    descricao: "",
    observacoes: "",

    etiquetas: {
      destaque_semana: false,
      novo_site: false,
      baixou_preco: false,
    },

    caracteristicas: {
      // MEDIDAS E DIMENSÕES
      area_util: "",
      frente_terreno: "",
      fundo: "",
      lateral_esquerda: "",
      lateral_direita: "",
      pe_direito: "",
      topografia: "",
      esquina: false,

      // ESTRUTURA DO IMÓVEL
      tipo_construcao: "",
      ano_construcao: "",
      numero_pavimentos: "",
      reformado_recentemente: false,
      imovel_averbado: false,
      financiavel: false,
      aceita_permuta: false,
      permuta_imovel: false,
      permuta_terreno: false,
      permuta_veiculo: false,
      permuta_outros: false,
      permuta_descricao: "",

      // INFRAESTRUTURA INTERNA
      tipo_iluminacao: "",
      tipo_telhado: "",
      forro_laje: false,
      sistema_eletrico_novo: false,
      caixa_dagua: "",
      sistema_esgoto: "",
      aquecimento_agua: "",

      // CARACTERÍSTICAS ESTRATÉGICAS
      posicao_solar: "",
      ventilacao_cruzada: false,
      vista_livre: false,
      vista_permanente: false,
      rua_sem_saida: false,

      // DADOS RURAIS
      area_total_hectares: "",
      area_agricultavel_hectares: "",
      area_preservacao_hectares: "",
      area_reflorestamento_hectares: "",
      proximidade_br: "",
      municipio_distrito: "",
      solo_topografia_rural: "",
      benfeitorias: "",
      plantacao_fruticultura: "",
      tipo_cultura: "",
      sistemas_irrigacao: "",
      tipo_pecuaria: "",
      numero_cabecas: "",
      racas_gado: "",
      area_pastagem_hectares: "",
      capacidade_suporte: "",
      estruturas_pecuarias: "",
      tem_agudada: false,
      tem_cerca_eletrificada: false,
      tem_sala_ordenha: false,
      tipo_confinamento: "",
      tem_agude: false,
      tem_represa: false,
      tem_cacimba: false,
      tem_poco_artesiano: false,
      tem_riacho: false,
      fontes_agua: "",
      tem_extrativismo: false,
      tipo_extrativismo: "",
      tem_ecoturismo: false,
      atividades_complementares: "",
    },

    infraestrutura: {
      agua: false,
      energia: false,
      esgoto: false,
      internet: false,
      gas: false,
    },

    acabamentos: {
      pisos: {
        piso_porcelanato: false,
        piso_ceramica: false,
        piso_laminado: false,
        piso_vinilico: false,
        piso_madeira_macica: false,
        piso_taco: false,
        piso_cimento_queimado: false,
        piso_marmore: false,
        piso_granito: false,
        piso_frio: false,
        personalizados: [],
      },
      revestimentos: {
        revestimento_azulejo: false,
        revestimento_pastilha: false,
        revestimento_porcelanato: false,
        revestimento_pedra_natural: false,
        revestimento_papel_parede: false,
        revestimento_3d: false,
        personalizados: [],
      },
      teto: {
        teto_gesso_rebaixado: false,
        teto_sanca_gesso: false,
        teto_forro_pvc: false,
        teto_laje: false,
        personalizados: [],
      },
      esquadrias: {
        porta_madeira_macica: false,
        porta_laqueada: false,
        esquadria_aluminio: false,
        esquadria_pvc: false,
        porta_pivotante: false,
        personalizados: [],
      },
      bancadas: {
        bancada_granito: false,
        bancada_marmore: false,
        bancada_quartzo: false,
        bancada_nanoglass: false,
        personalizados: [],
      },
    },

    area_lazer: {
      piscina: false,
      churrasqueira: false,
      espaco_gourmet: false,
      salao_festas: false,
      salao_jogos: false,
      academia: false,
      playground: false,
      quadra_poliesportiva: false,
      campo_society: false,
      area_verde: false,
      jardim: false,
      deck: false,
      rooftop: false,
      sauna: false,
      espaco_pet: false,
      brinquedoteca: false,
      personalizados: [],
    },

    localizacao_vizinhanca: {
      proximo_centro: false,
      proximo_supermercado: false,
      proximo_escola: false,
      proximo_hospital: false,
      proximo_farmacia: false,
      proximo_onibus: false,
      proximo_shopping: false,
      proximo_faculdade: false,
      bairro_residencial: false,
      bairro_comercial: false,
      rua_asfaltada: false,
      rua_tranquila: false,
      regiao_valorizada: false,
      personalizados: [],
    },

    seguranca: {
      portao_eletronico: false,
      interfone: false,
      cerca_eletrica: false,
      sistema_cameras: false,
      alarme: false,
      portaria_24h: false,
      vigilancia_24h: false,
      controle_acesso: false,
      fechadura_digital: false,
      condominio_fechado: false,
      muros_altos: false,
      personalizados: [],
    },

    armarios_armazenamento: {
      armario_cozinha_planejado: false,
      armarios_embutidos: false,
      armarios_quarto: false,
      armarios_banheiro: false,
      closet: false,
      despensa: false,
      deposito: false,
      roupeiro: false,
      maleiro: false,
      personalizados: [],
    },

    servicos_utilidades: {
      agua_encanada: false,
      energia_eletrica: false,
      poco_artesiano: false,
      aquecimento_gas: false,
      aquecimento_solar: false,
      gas_encanado: false,
      ar_condicionado_instalado: false,
      infra_ar_condicionado: false,
      internet_fibra: false,
      energia_solar: false,
      elevador: false,
      coleta_lixo: false,
      personalizados: [],
    },

    diferenciais: {
      varanda: false,
      sacada: false,
      lavabo: false,
      banheira: false,
      box_vidro: false,
      dependencia_empregada: false,
      escritorio: false,
      pe_direito_duplo: false,
      mezanino: false,
      vista_panoramica: false,
      personalizados: [],
    },
  });

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

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

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

  const topografiaOpcoes = [
    { value: "plano", label: "Plano" },
    { value: "aclive", label: "Aclive" },
    { value: "declive", label: "Declive" },
    { value: "montanhoso", label: "Montanhoso" },
    { value: "ondulado", label: "Ondulado" },
  ];

  const tipoConstrucaoOpcoes = [
    { value: "alvenaria_estrutural", label: "Alvenaria Estrutural" },
    { value: "concreto_armado", label: "Concreto Armado" },
    { value: "steel_frame", label: "Steel Frame" },
    { value: "wood_frame", label: "Wood Frame" },
    { value: "container", label: "Container" },
    { value: "madeira", label: "Madeira" },
    { value: "taipa", label: "Taipa" },
  ];

  const proprietarios = [
    { id: "1", nome: "Maria Silva" },
    { id: "2", nome: "João Santos" },
    { id: "3", nome: "Ana Oliveira" },
  ];

  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
        `https://aqhiaherelldknfpscrd.supabase.co/functions/v1/buscar-cep/${cepLimpo}`,
      );

      const data = await response.json();

      if (data.error) {
        if (data.error === "CEP não encontrado") {
          setCepError("CEP não encontrado");
        } else if (data.error === "ViaCEP temporariamente indisponível") {
          setCepError(
            "Serviço de CEP está fora do ar. Tente novamente em alguns minutos ou digite o endereço manualmente.",
          );
        } else {
          setCepError("Erro ao buscar CEP. Tente novamente.");
        }
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        complemento: data.complemento || prev.complemento,
      }));
    } catch (error) {
      console.error("❌ Erro:", error);
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "preco_venda" ||
      name === "preco_aluguel" ||
      name === "precoAnterior"
    ) {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name.includes(".")) {
      const parts = name.split(".");

      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        }));
      } else if (parts.length === 3) {
        const [parent, child1, child2] = parts;
        setFormData((prev) => {
          const newData = {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child1]: {
                ...prev[parent]?.[child1],
                [child2]: type === "checkbox" ? checked : value,
              },
            },
          };
          return newData;
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCounterChange = (field, increment) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, (parseInt(prev[field]) || 0) + increment),
    }));
  };

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const carregarEmpreendimentos = async () => {
    const { data } = await supabase
      .from("edificios")
      .select("id, nome, tipo, bairro, cidade")
      .order("nome");
    setEmpreendimentos(data || []);
  };

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
        slug: data.slug || "",
        tipo: data.tipo || "",
        status: data.status || "disponivel",
        financiado: data.financiado || false,
        em_condominio: data.em_condominio || false,
        proprietario_id: data.proprietario_id || "",
        corretor_id: data.corretor_id || "",
        ocultar_preco: data.ocultar_preco || false,

        finalidade_venda: false,
        finalidade_aluguel: false,
        preco_venda: "",
        preco_aluguel: "",

        precoAnterior: data.preco_anterior || "",

        id_edificios: data.id_edificios || "",
        unidade: data.unidade || "",
        andar: data.andar || "",
        lote: data.lote || "",
        bloco: data.bloco || "",
        quadra: data.quadra || "",

        quartos: data.quartos || 0,
        suites: data.suites || 0,
        banheiros: data.banheiros || 0,
        vagas: data.vagas || 0,
        area_total: data.area_total || 0,
        area_construida: data.area_construida || 0,
        area_privativa: data.area_privativa || 0,

        condominio_mensal: data.condominio_mensal || 0,
        iptu_anual: data.iptu_anual || 0,

        cep: data.cep || "",
        endereco: data.endereco || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
        exibir_endereco_site: data.exibir_endereco_site || false,

        descricao: data.descricao || "",
        observacoes: data.observacoes || "",

        etiquetas: {
          destaque_semana: data.etiquetas?.destaque_semana || false,
          novo_site: data.etiquetas?.novo_site || false,
          baixou_preco: data.etiquetas?.baixou_preco || false,
        },

        caracteristicas: data.caracteristicas || {},
        infraestrutura: data.infraestrutura || {},
        acabamentos: data.acabamentos || {},
        area_lazer: data.area_lazer || {},
        localizacao_vizinhanca: data.localizacao_vizinhanca || {},
        seguranca: data.seguranca || {},
        armarios_armazenamento: data.armarios_armazenamento || {},
        servicos_utilidades: data.servicos_utilidades || {},
        diferenciais: data.diferenciais || {},
      });

      await carregarFinalidades(id);
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

  useEffect(() => {
    carregarImovel();
    carregarEmpreendimentos();
  }, [id]);

  useEffect(() => {
    const tiposRurais = ["fazenda", "chacara", "sitio", "terreno"];
    const rural = tiposRurais.includes(formData.tipo);
    setIsRural(rural);
    setShowRuralFields(rural);
  }, [formData.tipo]);

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

    if (formData.finalidade_venda) {
      const precoVendaNumero = parseFloat(formData.preco_venda);
      if (
        !formData.preco_venda ||
        isNaN(precoVendaNumero) ||
        precoVendaNumero <= 0
      ) {
        setSubmitMessage({
          type: "error",
          text: "Preço de venda é obrigatório e deve ser maior que zero",
        });
        setLoading(false);
        return;
      }
    }

    if (formData.finalidade_aluguel) {
      const precoAluguelNumero = parseFloat(formData.preco_aluguel);
      if (
        !formData.preco_aluguel ||
        isNaN(precoAluguelNumero) ||
        precoAluguelNumero <= 0
      ) {
        setSubmitMessage({
          type: "error",
          text: "Preço de aluguel é obrigatório e deve ser maior que zero",
        });
        setLoading(false);
        return;
      }
    }

    const slug = slugify(
      formData.titulo || `${formData.tipo} ${formData.cidade}`,
    );

    const dadosParaSupabase = {
      codigo: formData.codigo,
      titulo: formData.titulo,
      slug: slug,
      tipo: formData.tipo,
      status: formData.status,
      financiado: formData.financiado,
      em_condominio: isRural ? false : formData.em_condominio,
      proprietario_id: formData.proprietario_id || null,
      corretor_id: formData.corretor_id || null,
      ocultar_preco: formData.ocultar_preco,
      preco_anterior: formData.precoAnterior
        ? parseFloat(formData.precoAnterior)
        : null,

      id_edificios: isRural ? null : formData.id_edificios || null,
      unidade: isRural ? "" : formData.unidade || "",
      andar: isRural ? 0 : formData.andar ? parseInt(formData.andar) : 0,
      lote: formData.lote || "",
      bloco: isRural ? "" : formData.bloco || "",
      quadra: formData.quadra || "",

      quartos: isRural ? 0 : parseInt(formData.quartos) || 0,
      suites: isRural ? 0 : parseInt(formData.suites) || 0,
      banheiros: isRural ? 0 : parseInt(formData.banheiros) || 0,
      vagas: isRural ? 0 : parseInt(formData.vagas) || 1,
      area_total: parseFloat(formData.area_total) || 0,
      area_construida: parseFloat(formData.area_construida) || 0,
      area_privativa: parseFloat(formData.area_privativa) || 0,

      condominio_mensal: parseFloat(formData.condominio_mensal) || 0,
      iptu_anual: parseFloat(formData.iptu_anual) || 0,

      cep: formData.cep || "",
      endereco: formData.endereco || "",
      numero: formData.numero || "",
      complemento: formData.complemento || "",
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      exibir_endereco_site: formData.exibir_endereco_site || false,

      descricao: formData.descricao || "",
      observacoes: formData.observacoes || "",

      etiquetas: {
        destaque_semana: formData.etiquetas.destaque_semana || false,
        novo_site: formData.etiquetas.novo_site || false,
        baixou_preco: formData.etiquetas.baixou_preco || false,
      },

      caracteristicas: {
        ...formData.caracteristicas,
        ano_construcao: formData.caracteristicas.ano_construcao
          ? parseInt(formData.caracteristicas.ano_construcao)
          : null,
        numero_pavimentos: formData.caracteristicas.numero_pavimentos
          ? parseInt(formData.caracteristicas.numero_pavimentos)
          : 0,
        caixa_dagua: formData.caracteristicas.caixa_dagua
          ? parseInt(formData.caracteristicas.caixa_dagua)
          : 0,
      },

      infraestrutura: formData.infraestrutura || {},
      acabamentos: formData.acabamentos || {},
      area_lazer: formData.area_lazer || {},
      localizacao_vizinhanca: formData.localizacao_vizinhanca || {},
      seguranca: formData.seguranca || {},
      armarios_armazenamento: formData.armarios_armazenamento || {},
      servicos_utilidades: formData.servicos_utilidades || {},
      diferenciais: formData.diferenciais || {},
    };

    try {
      const { error } = await supabase
        .from("imoveis")
        .update(dadosParaSupabase)
        .eq("id", id);

      if (error) throw error;

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

      try {
        const { error: deleteFotosError } = await supabase
          .from("fotos_imovel")
          .delete()
          .eq("imovel_id", id);

        if (deleteFotosError) throw deleteFotosError;

        if (fotos.length === 0) {
          setSubmitMessage({
            type: "success",
            text: `Imóvel "${formData.titulo}" atualizado com sucesso!`,
          });
          setTimeout(() => {
            navigate("/admin/imoveis");
          }, 2000);
          setLoading(false);
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
  const getCheckboxClass = () =>
    `appearance-none h-5 w-5 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/50 focus:ring-offset-2 ${isDark ? "bg-gray-800" : "bg-white"} ${getCheckboxBorderClass()} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:after:absolute checked:after:content-[''] checked:after:h-[0.625rem] checked:after:w-[0.3125rem] checked:after:rotate-45 checked:after:translate-x-[0.375rem] checked:after:translate-y-[0.125rem] checked:after:border-solid checked:after:border-white checked:after:border-width-0 checked:after:border-r-2 checked:after:border-b-2`;
  const getOptionBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getInputClasses = () =>
    `${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`;

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
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-[#D4A24D]/5 to-[#31353E]/5"}`}
    >
      <div
        className={`sticky top-0 z-50 border-b px-4 py-3 transition-colors duration-200 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/admin/imoveis")}
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
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
                  {loading ? "Salvando..." : "Atualizar Imóvel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <form
          id="form-editar-imovel"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* ========== SEÇÃO: INFORMAÇÕES GERAIS ========== */}
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
                  Código do Imóvel *
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
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder={
                    isRural
                      ? "Ex: Fazenda com 500 hectares e gado nelore"
                      : "Ex: Casa moderna com piscina no Jardins"
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Finalidade *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={`p-4 border rounded-xl transition-all duration-300 ${formData.finalidade_venda ? "border-[#D4A24D] shadow-md" : getBorderClass()}`}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="finalidade_venda"
                        checked={formData.finalidade_venda}
                        onChange={handleChange}
                        className={getCheckboxClass()}
                      />
                      <span
                        className={`font-medium text-base transition-colors ${formData.finalidade_venda ? "text-[#D4A24D]" : getTextClass()}`}
                      >
                        🏷️ Venda
                      </span>
                    </label>

                    {formData.finalidade_venda && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                        <PriceInput
                          name="preco_venda"
                          value={formData.preco_venda}
                          onChange={handleChange}
                          label="Preço de Venda"
                          required={formData.finalidade_venda}
                          isDark={isDark}
                          getInputClasses={getInputClasses}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-4 border rounded-xl transition-all duration-300 ${formData.finalidade_aluguel ? "border-[#D4A24D] shadow-md" : getBorderClass()}`}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="finalidade_aluguel"
                        checked={formData.finalidade_aluguel}
                        onChange={handleChange}
                        className={getCheckboxClass()}
                      />
                      <span
                        className={`font-medium text-base transition-colors ${formData.finalidade_aluguel ? "text-[#D4A24D]" : getTextClass()}`}
                      >
                        🔑 Aluguel
                      </span>
                    </label>

                    {formData.finalidade_aluguel && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                        <PriceInput
                          name="preco_aluguel"
                          value={formData.preco_aluguel}
                          onChange={handleChange}
                          label="Preço de Aluguel"
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
                  Proprietário
                </label>
                <select
                  name="proprietario_id"
                  value={formData.proprietario_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Corretor Responsável
                </label>
                <select
                  name="corretor_id"
                  value={formData.corretor_id}
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
                    ⚠️ Nenhum corretor ativo encontrado. Cadastre um corretor
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
              {!isRural && (
                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="em_condominio"
                    name="em_condominio"
                    checked={formData.em_condominio}
                    onChange={handleChange}
                    className={getCheckboxClass()}
                  />
                  <label
                    htmlFor="em_condominio"
                    className={`text-sm transition-colors ${getTextClass()}`}
                  >
                    Imóvel em condomínio
                  </label>
                </div>
              )}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  name="ocultar_preco"
                  checked={formData.ocultar_preco}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <span className={`text-sm transition-colors ${getTextClass()}`}>
                  Ocultar preço na vitrine
                </span>
              </div>
            </div>

            {!isRural && formData.em_condominio && (
              <div
                className={`col-span-3 mt-6 p-5 border rounded-lg transition-colors duration-200 ${
                  isDark
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingOfficeIcon
                    className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-700"}`}
                  />
                  <h3
                    className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-700"}`}
                  >
                    Vínculo com Empreendimento
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label
                      className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Nome do Empreendimento *
                    </label>
                    <select
                      name="id_edificios"
                      value={formData.id_edificios}
                      onChange={handleChange}
                      required={formData.em_condominio}
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
                          </option>
                        ))}
                    </select>
                  </div>

                  {formData.tipo === "apartamento" && (
                    <>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                          className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                          className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                          className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                          className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
              </div>
            )}
          </div>

          {/* ========== SEÇÃO: DEPENDÊNCIAS DO IMÓVEL ========== */}
          {!isRural && (
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
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Dormitórios
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCounterChange("quartos", -1)}
                      className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quartos"
                      value={formData.quartos === 0 ? "" : formData.quartos}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCounterChange("quartos", 1)}
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
                      onClick={() => handleCounterChange("banheiros", -1)}
                      className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="banheiros"
                      value={formData.banheiros === 0 ? "" : formData.banheiros}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCounterChange("banheiros", 1)}
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
                    Suíte
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCounterChange("suites", -1)}
                      className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="suites"
                      value={formData.suites === 0 ? "" : formData.suites}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCounterChange("suites", 1)}
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
                      onClick={() => handleCounterChange("vagas", -1)}
                      className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="vagas"
                      value={formData.vagas === 0 ? "" : formData.vagas}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCounterChange("vagas", 1)}
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
                    Área Total (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="area_total"
                      value={
                        formData.area_total === 0 ? "" : formData.area_total
                      }
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
                    Área Construída (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="area_construida"
                      value={
                        formData.area_construida === 0
                          ? ""
                          : formData.area_construida
                      }
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
                    Área Privativa (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="area_privativa"
                      value={
                        formData.area_privativa === 0
                          ? ""
                          : formData.area_privativa
                      }
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
              </div>
            </div>
          )}

          {/* ========== SEÇÃO: LOCALIZAÇÃO DO IMÓVEL ========== */}
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
              </div>

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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>

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
                  Cidade *
                </label>
                <SelectCidade
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  isDark={isDark}
                  getInputClasses={getInputClasses}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Bairro *
                </label>
                <SelectBairro
                  value={formData.bairro}
                  onChange={handleChange}
                  cidadeSelecionada={formData.cidade}
                  required
                  isDark={isDark}
                  getInputClasses={getInputClasses}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Estado * (UF)
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
                  <option value="AC" className={getOptionBgClass()}>
                    Acre
                  </option>
                  <option value="AL" className={getOptionBgClass()}>
                    Alagoas
                  </option>
                  <option value="AP" className={getOptionBgClass()}>
                    Amapá
                  </option>
                  <option value="AM" className={getOptionBgClass()}>
                    Amazonas
                  </option>
                  <option value="BA" className={getOptionBgClass()}>
                    Bahia
                  </option>
                  <option value="CE" className={getOptionBgClass()}>
                    Ceará
                  </option>
                  <option value="DF" className={getOptionBgClass()}>
                    Distrito Federal
                  </option>
                  <option value="ES" className={getOptionBgClass()}>
                    Espírito Santo
                  </option>
                  <option value="GO" className={getOptionBgClass()}>
                    Goiás
                  </option>
                  <option value="MA" className={getOptionBgClass()}>
                    Maranhão
                  </option>
                  <option value="MT" className={getOptionBgClass()}>
                    Mato Grosso
                  </option>
                  <option value="MS" className={getOptionBgClass()}>
                    Mato Grosso do Sul
                  </option>
                  <option value="MG" className={getOptionBgClass()}>
                    Minas Gerais
                  </option>
                  <option value="PA" className={getOptionBgClass()}>
                    Pará
                  </option>
                  <option value="PB" className={getOptionBgClass()}>
                    Paraíba
                  </option>
                  <option value="PR" className={getOptionBgClass()}>
                    Paraná
                  </option>
                  <option value="PE" className={getOptionBgClass()}>
                    Pernambuco
                  </option>
                  <option value="PI" className={getOptionBgClass()}>
                    Piauí
                  </option>
                  <option value="RJ" className={getOptionBgClass()}>
                    Rio de Janeiro
                  </option>
                  <option value="RN" className={getOptionBgClass()}>
                    Rio Grande do Norte
                  </option>
                  <option value="RS" className={getOptionBgClass()}>
                    Rio Grande do Sul
                  </option>
                  <option value="RO" className={getOptionBgClass()}>
                    Rondônia
                  </option>
                  <option value="RR" className={getOptionBgClass()}>
                    Roraima
                  </option>
                  <option value="SC" className={getOptionBgClass()}>
                    Santa Catarina
                  </option>
                  <option value="SP" className={getOptionBgClass()}>
                    São Paulo
                  </option>
                  <option value="SE" className={getOptionBgClass()}>
                    Sergipe
                  </option>
                  <option value="TO" className={getOptionBgClass()}>
                    Tocantins
                  </option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-[#D4A24D]">
                  <input
                    type="checkbox"
                    name="exibir_endereco_site"
                    checked={formData.exibir_endereco_site}
                    onChange={handleChange}
                    className={getCheckboxClass()}
                  />
                  <div>
                    <div className={`font-medium ${getTextClass()}`}>
                      🌐 Mostrar endereço completo no site
                    </div>
                    <div className={`text-sm ${getTextSecondaryClass()}`}>
                      Se marcado, o endereço (Rua, Número) aparecerá na página
                      pública do imóvel.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO: EXIBIR NA VITRINE (COM BAIXOU O PREÇO INTACTO) ========== */}
          <div
            className={`rounded-xl border p-6 ${getBgClass()} ${getBorderClass()}`}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destaque da Semana */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.destaque_semana"
                  checked={formData.etiquetas.destaque_semana}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    ⭐ Destaque da Semana
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Aparece como badge dourado na vitrine
                  </div>
                </div>
              </label>

              {/* Novo no Site */}
              <label
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-lg ${getBorderClass()} ${getHoverBgClass()}`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.novo_site"
                  checked={formData.etiquetas.novo_site}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
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
                  name="etiquetas.baixou_preco"
                  checked={formData.etiquetas.baixou_preco}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium flex items-center gap-1 group-hover:text-[#D4A24D] ${getTextClass()}`}
                  >
                    📉 Baixou o Preço
                  </div>
                  <div className={`text-xs ${getTextSecondaryClass()}`}>
                    Badge verde indicando redução
                  </div>
                </div>
              </label>
            </div>

            {/* Campo de Preço Anterior quando Baixou o Preço está marcado */}
            {formData.etiquetas.baixou_preco && (
              <div className="mt-6 p-5 border-2 border-red-500/30 bg-red-500/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📉</div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-white mb-1">
                      Informe o preço anterior
                    </h4>
                    <p className="text-sm text-white/80 mb-4">
                      Este valor aparecerá riscado ao lado do preço atual na
                      página do imóvel.
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

                    {formData.preco_venda && formData.precoAnterior && (
                      <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-white/70 mb-2">
                          Preview do preço na página do imóvel:
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
                          💰 Você economiza{" "}
                          {formatPrice(
                            formData.precoAnterior - formData.preco_venda,
                          )}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-white/60 mt-2">
                      Dica: Quanto maior o desconto aparente, mais atrativo o
                      imóvel fica.
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
                    {formData.titulo || "Título do Imóvel"}
                  </h3>
                  <div className="flex gap-1 flex-wrap">
                    {formData.etiquetas.destaque_semana && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium flex items-center gap-1">
                        ⭐ Destaque
                      </span>
                    )}
                    {formData.etiquetas.novo_site && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex items-center gap-1">
                        🆕 Novo
                      </span>
                    )}
                    {formData.etiquetas.baixou_preco && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex items-center gap-1">
                        📉 Baixou
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
                Na vitrine, mostramos: Título + Badges + Bairro, Cidade/UF +
                Preços
              </p>
            </div>
          </div>

          {/* ========== SEÇÃO: FOTOS DO IMÓVEL ========== */}
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
                    {fotos.length}/20 fotos selecionadas
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
          </div>

          {/* ========== SEÇÃO: CUSTOS ADICIONAIS ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <CurrencyDollarIcon
                  className={`w-6 h-6 ${getIconColorClass()}`}
                />
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
              {!isRural && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Condomínio Mensal (R$)
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
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                    />
                  </div>
                </div>
              )}

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

          {/* ========== SEÇÃO: CARACTERÍSTICAS DO IMÓVEL (ACCORDION) ========== */}
          {!isRural && (
            <div className="space-y-4">
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
                      <div>
                        <h4
                          className={`text-md font-semibold mb-4 ${getTextClass()}`}
                        >
                          📐 Medidas e Dimensões
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Área útil (m²)
                            </label>
                            <input
                              type="number"
                              name="caracteristicas.area_util"
                              value={formData.caracteristicas.area_util}
                              onChange={handleChange}
                              placeholder="0,00"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Frente do terreno (m)
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.frente_terreno"
                              value={formData.caracteristicas.frente_terreno}
                              onChange={handleChange}
                              placeholder="Ex: 10m"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
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
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Lateral esquerda (m)
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.lateral_esquerda"
                              value={formData.caracteristicas.lateral_esquerda}
                              onChange={handleChange}
                              placeholder="Ex: 30m"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Lateral direita (m)
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.lateral_direita"
                              value={formData.caracteristicas.lateral_direita}
                              onChange={handleChange}
                              placeholder="Ex: 30m"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Pé direito (m)
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.pe_direito"
                              value={formData.caracteristicas.pe_direito}
                              onChange={handleChange}
                              placeholder="Ex: 3,20m"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
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
                              {topografiaOpcoes.map((opcao) => (
                                <option
                                  key={opcao.value}
                                  value={opcao.value}
                                  className={getOptionBgClass()}
                                >
                                  {opcao.label}
                                </option>
                              ))}
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
                        <h4
                          className={`text-md font-semibold mb-4 ${getTextClass()}`}
                        >
                          🏗 Estrutura do Imóvel
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Tipo de construção
                            </label>
                            <select
                              name="caracteristicas.tipo_construcao"
                              value={formData.caracteristicas.tipo_construcao}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            >
                              <option value="" className={getOptionBgClass()}>
                                Selecione
                              </option>
                              {tipoConstrucaoOpcoes.map((opcao) => (
                                <option
                                  key={opcao.value}
                                  value={opcao.value}
                                  className={getOptionBgClass()}
                                >
                                  {opcao.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Ano de construção
                            </label>
                            <input
                              type="number"
                              name="caracteristicas.ano_construcao"
                              value={formData.caracteristicas.ano_construcao}
                              onChange={handleChange}
                              placeholder="Ex: 2020"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Número de pavimentos
                            </label>
                            <input
                              type="number"
                              name="caracteristicas.numero_pavimentos"
                              value={formData.caracteristicas.numero_pavimentos}
                              onChange={handleChange}
                              min="0"
                              placeholder="0"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.reformado_recentemente"
                              checked={
                                formData.caracteristicas.reformado_recentemente
                              }
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Reformado recentemente?
                            </span>
                          </label>

                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.imovel_averbado"
                              checked={formData.caracteristicas.imovel_averbado}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Imóvel averbado?
                            </span>
                          </label>

                          <div className="flex flex-col p-3 border rounded-lg transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="caracteristicas.aceita_permuta"
                                checked={
                                  formData.caracteristicas.aceita_permuta
                                }
                                onChange={handleChange}
                                className={getCheckboxClass()}
                              />
                              <span
                                className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                              >
                                Aceita permuta?
                              </span>
                            </label>

                            {formData.caracteristicas.aceita_permuta && (
                              <div className="mt-3 ml-7 animate-fadeIn">
                                <label
                                  className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                                >
                                  Tipos de permuta aceitos
                                </label>
                                <div className="flex flex-wrap gap-3">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      name="caracteristicas.permuta_imovel"
                                      checked={
                                        formData.caracteristicas
                                          .permuta_imovel || false
                                      }
                                      onChange={handleChange}
                                      className={getCheckboxClass()}
                                    />
                                    <span className={getTextClass()}>
                                      🏠 Imóvel
                                    </span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      name="caracteristicas.permuta_terreno"
                                      checked={
                                        formData.caracteristicas
                                          .permuta_terreno || false
                                      }
                                      onChange={handleChange}
                                      className={getCheckboxClass()}
                                    />
                                    <span className={getTextClass()}>
                                      🌳 Terreno
                                    </span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      name="caracteristicas.permuta_veiculo"
                                      checked={
                                        formData.caracteristicas
                                          .permuta_veiculo || false
                                      }
                                      onChange={handleChange}
                                      className={getCheckboxClass()}
                                    />
                                    <span className={getTextClass()}>
                                      🚗 Veículo
                                    </span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      name="caracteristicas.permuta_outros"
                                      checked={
                                        formData.caracteristicas
                                          .permuta_outros || false
                                      }
                                      onChange={handleChange}
                                      className={getCheckboxClass()}
                                    />
                                    <span className={getTextClass()}>
                                      📝 Outros
                                    </span>
                                  </label>
                                </div>

                                {formData.caracteristicas.permuta_outros && (
                                  <div className="mt-3">
                                    <input
                                      type="text"
                                      name="caracteristicas.permuta_descricao"
                                      value={
                                        formData.caracteristicas
                                          .permuta_descricao || ""
                                      }
                                      onChange={handleChange}
                                      placeholder="Descreva o que aceita (ex: moto, equipamentos, etc.)"
                                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${getInputClasses()}`}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4
                          className={`text-md font-semibold mb-4 ${getTextClass()}`}
                        >
                          💡 Infraestrutura Interna
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Tipo de iluminação
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.tipo_iluminacao"
                              value={formData.caracteristicas.tipo_iluminacao}
                              onChange={handleChange}
                              placeholder="Ex: LED, Fluorescente"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Tipo de telhado
                            </label>
                            <input
                              type="text"
                              name="caracteristicas.tipo_telhado"
                              value={formData.caracteristicas.tipo_telhado}
                              onChange={handleChange}
                              placeholder="Ex: Cerâmica, Metálico"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Caixa d'água (litros)
                            </label>
                            <input
                              type="number"
                              name="caracteristicas.caixa_dagua"
                              value={formData.caracteristicas.caixa_dagua}
                              onChange={handleChange}
                              placeholder="0"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Sistema de esgoto
                            </label>
                            <select
                              name="caracteristicas.sistema_esgoto"
                              value={formData.caracteristicas.sistema_esgoto}
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
                                value="sumidouro"
                                className={getOptionBgClass()}
                              >
                                Sumidouro
                              </option>
                              <option
                                value="fossa_ecologica"
                                className={getOptionBgClass()}
                              >
                                Fossa Ecológica/Biodigestor
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
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Aquecimento de água
                            </label>
                            <select
                              name="caracteristicas.aquecimento_agua"
                              value={formData.caracteristicas.aquecimento_agua}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                            >
                              <option value="" className={getOptionBgClass()}>
                                Selecione
                              </option>
                              <option
                                value="gas"
                                className={getOptionBgClass()}
                              >
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
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.forro_laje"
                              checked={formData.caracteristicas.forro_laje}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Forro em laje?
                            </span>
                          </label>

                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.sistema_eletrico_novo"
                              checked={
                                formData.caracteristicas.sistema_eletrico_novo
                              }
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Sistema elétrico novo?
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4
                          className={`text-md font-semibold mb-4 ${getTextClass()}`}
                        >
                          📍 Características Estratégicas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                            >
                              Posição solar
                            </label>
                            <select
                              name="caracteristicas.posicao_solar"
                              value={formData.caracteristicas.posicao_solar}
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
                              <option
                                value="sul"
                                className={getOptionBgClass()}
                              >
                                Sul
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.ventilacao_cruzada"
                              checked={
                                formData.caracteristicas.ventilacao_cruzada
                              }
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Ventilação cruzada
                            </span>
                          </label>

                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.vista_livre"
                              checked={formData.caracteristicas.vista_livre}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Vista livre
                            </span>
                          </label>

                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.vista_permanente"
                              checked={
                                formData.caracteristicas.vista_permanente
                              }
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Vista permanente
                            </span>
                          </label>

                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[#D4A24D]/50">
                            <input
                              type="checkbox"
                              name="caracteristicas.rua_sem_saida"
                              checked={formData.caracteristicas.rua_sem_saida}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors group-hover:text-[#D4A24D] ${getTextClass()}`}
                            >
                              Rua sem saída
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ========== SEÇÃO: ACABAMENTOS (ACCORDION) ========== */}
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
                    {/* Pisos */}
                    <SecaoAcabamento
                      titulo="Pisos"
                      section="acabamentos.pisos"
                      items={[
                        { key: "piso_porcelanato", label: "Porcelanato" },
                        { key: "piso_ceramica", label: "Cerâmica" },
                        { key: "piso_laminado", label: "Piso laminado" },
                        { key: "piso_vinilico", label: "Piso vinílico" },
                        { key: "piso_madeira_macica", label: "Madeira maciça" },
                        { key: "piso_taco", label: "Taco" },
                        {
                          key: "piso_cimento_queimado",
                          label: "Cimento queimado",
                        },
                        { key: "piso_marmore", label: "Mármore" },
                        { key: "piso_granito", label: "Granito" },
                        { key: "piso_frio", label: "Piso frio" },
                      ]}
                      formData={formData}
                      setFormData={setFormData}
                      handleChange={handleChange}
                      isDark={isDark}
                      getBorderClass={getBorderClass}
                      getHoverBgClass={getHoverBgClass}
                      getTextClass={getTextClass}
                      getCheckboxClass={getCheckboxClass}
                    />

                    <div className="pt-6 border-t mt-6">
                      <SecaoAcabamento
                        titulo="Revestimentos de parede"
                        section="acabamentos.revestimentos"
                        items={[
                          { key: "revestimento_azulejo", label: "Azulejo" },
                          { key: "revestimento_pastilha", label: "Pastilha" },
                          {
                            key: "revestimento_porcelanato",
                            label: "Porcelanato em parede",
                          },
                          {
                            key: "revestimento_pedra_natural",
                            label: "Pedra natural",
                          },
                          {
                            key: "revestimento_papel_parede",
                            label: "Papel de parede",
                          },
                          { key: "revestimento_3d", label: "Revestimento 3D" },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        isDark={isDark}
                        getBorderClass={getBorderClass}
                        getHoverBgClass={getHoverBgClass}
                        getTextClass={getTextClass}
                        getCheckboxClass={getCheckboxClass}
                      />
                    </div>

                    <div className="pt-6 border-t mt-6">
                      <SecaoAcabamento
                        titulo="Teto e forro"
                        section="acabamentos.teto"
                        items={[
                          {
                            key: "teto_gesso_rebaixado",
                            label: "Gesso rebaixado",
                          },
                          { key: "teto_sanca_gesso", label: "Sanca de gesso" },
                          { key: "teto_forro_pvc", label: "Forro de PVC" },
                          { key: "teto_laje", label: "Laje" },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        isDark={isDark}
                        getBorderClass={getBorderClass}
                        getHoverBgClass={getHoverBgClass}
                        getTextClass={getTextClass}
                        getCheckboxClass={getCheckboxClass}
                      />
                    </div>

                    <div className="pt-6 border-t mt-6">
                      <SecaoAcabamento
                        titulo="Esquadrias e portas"
                        section="acabamentos.esquadrias"
                        items={[
                          {
                            key: "porta_madeira_macica",
                            label: "Porta de madeira maciça",
                          },
                          { key: "porta_laqueada", label: "Porta laqueada" },
                          {
                            key: "esquadria_aluminio",
                            label: "Esquadrias de alumínio",
                          },
                          { key: "esquadria_pvc", label: "Esquadrias de PVC" },
                          { key: "porta_pivotante", label: "Porta pivotante" },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        isDark={isDark}
                        getBorderClass={getBorderClass}
                        getHoverBgClass={getHoverBgClass}
                        getTextClass={getTextClass}
                        getCheckboxClass={getCheckboxClass}
                      />
                    </div>

                    <div className="pt-6 border-t mt-6">
                      <SecaoAcabamento
                        titulo="Bancadas"
                        section="acabamentos.bancadas"
                        items={[
                          { key: "bancada_granito", label: "Granito" },
                          { key: "bancada_marmore", label: "Mármore" },
                          { key: "bancada_quartzo", label: "Quartzo" },
                          { key: "bancada_nanoglass", label: "Nanoglass" },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        isDark={isDark}
                        getBorderClass={getBorderClass}
                        getHoverBgClass={getHoverBgClass}
                        getTextClass={getTextClass}
                        getCheckboxClass={getCheckboxClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              <CheckboxAccordion
                title="Área de Lazer"
                subtitle="Instalações de lazer e entretenimento"
                icon={SunIcon}
                section="area_lazer"
                isOpen={accordionOpen.areaLazer}
                onToggle={() => toggleAccordion("areaLazer")}
                items={[
                  { key: "piscina", label: "Piscina" },
                  { key: "churrasqueira", label: "Churrasqueira" },
                  { key: "espaco_gourmet", label: "Espaço gourmet" },
                  { key: "salao_festas", label: "Salão de festas" },
                  { key: "salao_jogos", label: "Salão de jogos" },
                  { key: "academia", label: "Academia" },
                  { key: "playground", label: "Playground" },
                  {
                    key: "quadra_poliesportiva",
                    label: "Quadra poliesportiva",
                  },
                  { key: "campo_society", label: "Campo society" },
                  { key: "area_verde", label: "Área verde" },
                  { key: "jardim", label: "Jardim" },
                  { key: "deck", label: "Deck" },
                  { key: "rooftop", label: "Rooftop" },
                  { key: "sauna", label: "Sauna" },
                  { key: "espaco_pet", label: "Espaço pet" },
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

              <CheckboxAccordion
                title="Localização e Vizinhança"
                subtitle="Proximidade de serviços e características do entorno"
                icon={MapPinIcon}
                section="localizacao_vizinhanca"
                isOpen={accordionOpen.localizacaoVizinhanca}
                onToggle={() => toggleAccordion("localizacaoVizinhanca")}
                items={[
                  { key: "proximo_centro", label: "Próximo ao centro" },
                  {
                    key: "proximo_supermercado",
                    label: "Próximo a supermercado",
                  },
                  { key: "proximo_escola", label: "Próximo a escola" },
                  { key: "proximo_hospital", label: "Próximo a hospital" },
                  { key: "proximo_farmacia", label: "Próximo a farmácia" },
                  { key: "proximo_onibus", label: "Próximo a ponto de ônibus" },
                  { key: "proximo_shopping", label: "Próximo a shopping" },
                  { key: "proximo_faculdade", label: "Próximo a faculdade" },
                  { key: "bairro_residencial", label: "Bairro residencial" },
                  { key: "bairro_comercial", label: "Bairro comercial" },
                  { key: "rua_asfaltada", label: "Rua asfaltada" },
                  { key: "rua_tranquila", label: "Rua tranquila" },
                  { key: "regiao_valorizada", label: "Região valorizada" },
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

              <CheckboxAccordion
                title="Segurança"
                subtitle="Sistemas de segurança e proteção patrimonial"
                icon={ShieldCheckIcon}
                section="seguranca"
                isOpen={accordionOpen.seguranca}
                onToggle={() => toggleAccordion("seguranca")}
                items={[
                  { key: "portao_eletronico", label: "Portão eletrônico" },
                  { key: "interfone", label: "Interfone" },
                  { key: "cerca_eletrica", label: "Cerca elétrica" },
                  { key: "sistema_cameras", label: "Sistema de câmeras" },
                  { key: "alarme", label: "Alarme" },
                  { key: "portaria_24h", label: "Portaria 24h" },
                  { key: "vigilancia_24h", label: "Vigilância 24h" },
                  { key: "controle_acesso", label: "Controle de acesso" },
                  { key: "fechadura_digital", label: "Fechadura digital" },
                  { key: "condominio_fechado", label: "Condomínio fechado" },
                  { key: "muros_altos", label: "Muros altos" },
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

              <CheckboxAccordion
                title="Armários e Armazenamento"
                subtitle="Móveis planejados e soluções de armazenamento"
                icon={BuildingStorefrontIcon}
                section="armarios_armazenamento"
                isOpen={accordionOpen.armariosArmazenamento}
                onToggle={() => toggleAccordion("armariosArmazenamento")}
                items={[
                  {
                    key: "armario_cozinha_planejado",
                    label: "Armário de cozinha planejado",
                  },
                  { key: "armarios_embutidos", label: "Armários embutidos" },
                  { key: "armarios_quarto", label: "Armários no quarto" },
                  { key: "armarios_banheiro", label: "Armários no banheiro" },
                  { key: "closet", label: "Closet" },
                  { key: "despensa", label: "Despensa" },
                  { key: "deposito", label: "Depósito" },
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

              <CheckboxAccordion
                title="Serviços e Utilidades"
                subtitle="Serviços coletivos, utilidades e infraestrutura urbana"
                icon={BoltIcon}
                section="servicos_utilidades"
                isOpen={accordionOpen.servicosUtilidades}
                onToggle={() => toggleAccordion("servicosUtilidades")}
                items={[
                  { key: "agua_encanada", label: "Água encanada" },
                  { key: "energia_eletrica", label: "Energia elétrica" },
                  { key: "poco_artesiano", label: "Poço artesiano" },
                  { key: "aquecimento_gas", label: "Aquecimento a gás" },
                  { key: "aquecimento_solar", label: "Aquecimento solar" },
                  { key: "gas_encanado", label: "Gás encanado" },
                  {
                    key: "ar_condicionado_instalado",
                    label: "Ar-condicionado instalado",
                  },
                  {
                    key: "infra_ar_condicionado",
                    label: "Infra para ar-condicionado",
                  },
                  { key: "internet_fibra", label: "Internet fibra disponível" },
                  { key: "energia_solar", label: "Sistema de energia solar" },
                  { key: "elevador", label: "Elevador" },
                  { key: "coleta_lixo", label: "Coleta de lixo regular" },
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

              <CheckboxAccordion
                title="Diferenciais do Imóvel"
                subtitle="Características especiais que valorizam o imóvel"
                icon={HeartIcon}
                section="diferenciais"
                isOpen={accordionOpen.diferenciais}
                onToggle={() => toggleAccordion("diferenciais")}
                items={[
                  { key: "varanda", label: "Varanda" },
                  { key: "sacada", label: "Sacada" },
                  { key: "lavabo", label: "Lavabo" },
                  { key: "banheira", label: "Banheira" },
                  { key: "box_vidro", label: "Box de vidro" },
                  {
                    key: "dependencia_empregada",
                    label: "Dependência de empregada",
                  },
                  { key: "escritorio", label: "Escritório" },
                  { key: "pe_direito_duplo", label: "Pé direito duplo" },
                  { key: "mezanino", label: "Mezanino" },
                  { key: "vista_panoramica", label: "Vista panorâmica" },
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
          )}

          {/* ========== SEÇÃO: IMÓVEL RURAL ========== */}
          {isRural && showRuralFields && (
            <div
              className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                  <BeakerIcon className={`w-6 h-6 ${getIconColorClass()}`} />
                </div>
                <div>
                  <h2
                    className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                  >
                    Informações do Imóvel Rural
                  </h2>
                  <p
                    className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    Dados específicos para propriedades rurais
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Área total (hectares) *
                  </label>
                  <input
                    type="number"
                    name="caracteristicas.area_total_hectares"
                    value={formData.caracteristicas.area_total_hectares}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                    required={isRural}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Área agricultável (ha)
                  </label>
                  <input
                    type="number"
                    name="caracteristicas.area_agricultavel_hectares"
                    value={formData.caracteristicas.area_agricultavel_hectares}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Área de preservação (ha)
                  </label>
                  <input
                    type="number"
                    name="caracteristicas.area_preservacao_hectares"
                    value={formData.caracteristicas.area_preservacao_hectares}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Proximidade BR
                  </label>
                  <input
                    type="text"
                    name="caracteristicas.proximidade_br"
                    value={formData.caracteristicas.proximidade_br}
                    onChange={handleChange}
                    placeholder="Ex: Próximo à BR-101, km 45"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Município/Distrito
                  </label>
                  <input
                    type="text"
                    name="caracteristicas.municipio_distrito"
                    value={formData.caracteristicas.municipio_distrito}
                    onChange={handleChange}
                    placeholder="Ex: Distrito de São João"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Benfeitorias
                  </label>
                  <input
                    type="text"
                    name="caracteristicas.benfeitorias"
                    value={formData.caracteristicas.benfeitorias}
                    onChange={handleChange}
                    placeholder="Ex: Curral, cercas, açude, casa sede"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Tipo de Cultura
                  </label>
                  <input
                    type="text"
                    name="caracteristicas.tipo_cultura"
                    value={formData.caracteristicas.tipo_cultura}
                    onChange={handleChange}
                    placeholder="Ex: Soja, milho, café"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Tipo de Pecuária
                  </label>
                  <input
                    type="text"
                    name="caracteristicas.tipo_pecuaria"
                    value={formData.caracteristicas.tipo_pecuaria}
                    onChange={handleChange}
                    placeholder="Ex: Corte, leite"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Número de Cabeças
                  </label>
                  <input
                    type="number"
                    name="caracteristicas.numero_cabecas"
                    value={formData.caracteristicas.numero_cabecas}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputClasses()}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========== SEÇÃO: DESCRIÇÃO E OBSERVAÇÕES ========== */}
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
                  placeholder={
                    isRural
                      ? "Descreva a fazenda, suas atividades, potenciais, etc..."
                      : "Descreva o imóvel com detalhes: acabamentos, diferenciais, localização, etc..."
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
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
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputClasses()}`}
                />
              </div>
            </div>
          </div>

          {/* ========== MENSAGEM DE FEEDBACK ========== */}
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

          {/* ========== BOTÕES ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-8"
                disabled={loading}
              >
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Atualizar Imóvel</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarImovel;
