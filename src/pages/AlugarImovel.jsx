import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import CardImovel from "../componentes/CardImovel/CardImovel";
import ReactDOM from "react-dom";

// ===========================================
// BOTTOM SHEET (MOBILE)
// ===========================================
// ===========================================
// BOTTOM SHEET (MOBILE) - CORRIGIDO
// ===========================================
const BottomSheet = React.memo(
  ({
    show,
    onClose,
    formValues: propsFormValues,
    onInputChange,
    onClearFilters,
    onSearch,
    priceRangeOptions,
    garageOptions,
    suiteOptions,
    bathroomOptions,
    bedroomOptions,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
      console.log("📱 BOTTOM SHEET MONTADO");
      return () => {
        console.log("📱 BOTTOM SHEET DESMONTADO!");
      };
    }, []);

    // 🔥 Fechar dropdown ao clicar fora - CORRIGIDO
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          localDropdownOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setLocalDropdownOpen(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [localDropdownOpen]);

    const closeSheet = () => {
      onClose();
      setLocalDropdownOpen(null);
    };

    const handleOverlayClick = () => {
      closeSheet();
    };

    const toggleDropdown = (dropdownName, e) => {
      e.stopPropagation();
      e.preventDefault();
      setLocalDropdownOpen((prev) =>
        prev === dropdownName ? null : dropdownName,
      );
    };

    const selectOption = (field, value, e) => {
      e.stopPropagation();
      e.preventDefault();
      onInputChange(field, value);
      setLocalDropdownOpen(null);
    };

    const handleClear = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClearFilters();
    };

    const handleApply = (e) => {
      e.stopPropagation();
      e.preventDefault();
      closeSheet();
      onSearch(e);
    };

    const handleClose = (e) => {
      e.stopPropagation();
      e.preventDefault();
      closeSheet();
    };

    if (!show) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 bg-black/50 z-[999999] flex justify-center items-end md:hidden"
        onClick={handleOverlayClick}
      >
        <div
          ref={contentRef}
          className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100 z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Mais filtros</h3>
              <button
                onClick={handleClose}
                className="p-2 bg-[#D4A24D] text-white rounded-full hover:bg-[#c0903d] transition-colors shadow-sm"
              >
                <i className="fas fa-times text-white text-sm" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* FAIXA DE PREÇO */}
            <div
              className="relative"
              ref={localDropdownOpen === "priceRange" ? dropdownRef : null}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de preço
              </label>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("priceRange", e);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "priceRange"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.priceRange
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {propsFormValues.priceRange
                    ? priceRangeOptions.find(
                        (o) => o.id === propsFormValues.priceRange,
                      )?.label
                    : "Selecione"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                    localDropdownOpen === "priceRange"
                      ? "rotate-180 text-[#D4A24D]"
                      : ""
                  }`}
                />
              </div>

              {localDropdownOpen === "priceRange" && (
                <div
                  className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto">
                    {priceRangeOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("priceRange", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.priceRange === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.priceRange === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.priceRange === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GRID DE 2 COLUNAS */}
            <div className="grid grid-cols-2 gap-4">
              {/* VAGAS */}
              <div
                className="relative"
                ref={localDropdownOpen === "garage" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vagas
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("garage", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "garage"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                      propsFormValues.garage ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.garage
                      ? garageOptions.find(
                          (o) => o.id === propsFormValues.garage,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "garage"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "garage" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {garageOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("garage", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.garage === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.garage === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.garage === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUÍTES */}
              <div
                className="relative"
                ref={localDropdownOpen === "suite" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suítes
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("suite", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "suite"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                      propsFormValues.suite ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.suite
                      ? suiteOptions.find((o) => o.id === propsFormValues.suite)
                          ?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "suite"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "suite" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {suiteOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("suite", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.suite === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.suite === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.suite === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BANHEIROS */}
              <div
                className="relative"
                ref={localDropdownOpen === "bathrooms" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banheiros
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bathrooms", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "bathrooms"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                      propsFormValues.bathrooms
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.bathrooms
                      ? bathroomOptions.find(
                          (o) => o.id === propsFormValues.bathrooms,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "bathrooms"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "bathrooms" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bathroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bathrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.bathrooms === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.bathrooms === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.bathrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DORMITÓRIOS */}
              <div
                className="relative"
                ref={localDropdownOpen === "bedrooms" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitórios
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bedrooms", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "bedrooms"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                      propsFormValues.bedrooms
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.bedrooms
                      ? bedroomOptions.find(
                          (o) => o.id === propsFormValues.bedrooms,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "bedrooms"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "bedrooms" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bedroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bedrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.bedrooms === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.bedrooms === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.bedrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="grid grid-cols-2 gap-3 pt-4 sticky bottom-0 bg-white pb-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-3 bg-[#D4A24D] text-white font-bold rounded-lg hover:bg-[#c0903d] transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

// ===========================================
// MODAL DESKTOP - CORRIGIDO
// ===========================================
const DesktopModal = React.memo(
  ({
    show,
    onClose,
    formValues: propsFormValues,
    onInputChange,
    onClearFilters,
    onSearch,
    priceRangeOptions,
    garageOptions,
    suiteOptions,
    bathroomOptions,
    bedroomOptions,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);

    // 🔥 Fechar dropdown ao clicar fora - CORRIGIDO
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          localDropdownOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setLocalDropdownOpen(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [localDropdownOpen]);

    if (!show) return null;

    const closeModal = () => {
      onClose();
      setLocalDropdownOpen(null);
    };

    const toggleDropdown = (dropdownName, e) => {
      e.stopPropagation();
      e.preventDefault();
      setLocalDropdownOpen((prev) =>
        prev === dropdownName ? null : dropdownName,
      );
    };

    const selectOption = (field, value, e) => {
      e.stopPropagation();
      e.preventDefault();
      onInputChange(field, value);
      setLocalDropdownOpen(null);
    };

    const handleClear = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClearFilters();
    };

    const handleApply = (e) => {
      e.stopPropagation();
      e.preventDefault();
      closeModal();
      onSearch(e);
    };

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 bg-black/50 z-[999999] hidden md:flex items-center justify-center"
        onClick={closeModal}
      >
        <div
          ref={contentRef}
          className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">Mais filtros</h3>
            <button
              onClick={closeModal}
              className="p-2 bg-[#D4A24D] text-white rounded-full hover:bg-[#c0903d] transition-colors shadow-sm flex items-center justify-center w-8 h-8"
            >
              <i className="fas fa-times text-white text-sm" />
            </button>
          </div>

          <div className="p-6 max-h-[calc(95vh-80px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              {/* FAIXA DE PREÇO */}
              <div
                className="col-span-2 relative"
                ref={
                  localDropdownOpen === "priceRangeDesktop" ? dropdownRef : null
                }
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de preço
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("priceRangeDesktop", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "priceRangeDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm font-medium truncate ${
                      propsFormValues.priceRange
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.priceRange
                      ? priceRangeOptions.find(
                          (o) => o.id === propsFormValues.priceRange,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "priceRangeDesktop"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "priceRangeDesktop" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-[220px] overflow-y-auto">
                      {priceRangeOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => selectOption("priceRange", opt.id, e)}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            propsFormValues.priceRange === opt.id
                              ? "bg-[#D4A24D]/5"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              propsFormValues.priceRange === opt.id
                                ? "text-[#D4A24D] font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {opt.label}
                          </span>
                          {propsFormValues.priceRange === opt.id && (
                            <i className="fas fa-check text-[#D4A24D] text-sm" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* VAGAS */}
              <div
                className="relative"
                ref={localDropdownOpen === "garageDesktop" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vagas
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("garageDesktop", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "garageDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm font-medium truncate ${
                      propsFormValues.garage ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.garage
                      ? garageOptions.find(
                          (o) => o.id === propsFormValues.garage,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "garageDesktop"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "garageDesktop" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {garageOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("garage", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.garage === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.garage === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.garage === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUÍTES */}
              <div
                className="relative"
                ref={localDropdownOpen === "suiteDesktop" ? dropdownRef : null}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suítes
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("suiteDesktop", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "suiteDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm font-medium truncate ${
                      propsFormValues.suite ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.suite
                      ? suiteOptions.find((o) => o.id === propsFormValues.suite)
                          ?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "suiteDesktop"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "suiteDesktop" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {suiteOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("suite", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.suite === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.suite === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.suite === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BANHEIROS */}
              <div
                className="relative"
                ref={
                  localDropdownOpen === "bathroomsDesktop" ? dropdownRef : null
                }
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banheiros
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bathroomsDesktop", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "bathroomsDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm font-medium truncate ${
                      propsFormValues.bathrooms
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.bathrooms
                      ? bathroomOptions.find(
                          (o) => o.id === propsFormValues.bathrooms,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "bathroomsDesktop"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "bathroomsDesktop" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bathroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bathrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.bathrooms === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.bathrooms === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.bathrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DORMITÓRIOS */}
              <div
                className="relative"
                ref={
                  localDropdownOpen === "bedroomsDesktop" ? dropdownRef : null
                }
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitórios
                </label>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bedroomsDesktop", e);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                    localDropdownOpen === "bedroomsDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <span
                    className={`flex-1 text-left text-sm font-medium truncate ${
                      propsFormValues.bedrooms
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {propsFormValues.bedrooms
                      ? bedroomOptions.find(
                          (o) => o.id === propsFormValues.bedrooms,
                        )?.label
                      : "Selecione"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      localDropdownOpen === "bedroomsDesktop"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  />
                </div>

                {localDropdownOpen === "bedroomsDesktop" && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bedroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bedrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.bedrooms === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.bedrooms === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.bedrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-3 bg-[#D4A24D] text-white font-bold rounded-lg hover:bg-[#c0903d] transition-colors shadow-lg"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

// ===========================================
// COMPONENTE PRINCIPAL - ALUGAR IMÓVEL
// ===========================================
const AlugarImovel = () => {
  const location = useLocation();
  const [initialFilters, setInitialFilters] = useState({});

  // Estados
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(null);

  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 ESTADO PARA BAIRROS (vindo do banco)
  const [bairros, setBairros] = useState([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState([]);

  // Filtros ativos
  const [formValues, setFormValues] = useState({
    city: "",
    propertyType: "",
    neighborhood: "",
    bedrooms: "",
    minArea: "",
    maxArea: "",
    garage: "",
    suite: "",
    bathrooms: "",
    priceRange: "",
  });

  // =============== OPÇÕES ===============
  const cityOptions = [
    { id: "acailandia", label: "Açailândia" },
    { id: "imperatriz", label: "Imperatriz" },
    { id: "saoluis", label: "São Luís" },
    { id: "itinga", label: "Itinga" },
  ];

  const propertyOptions = [
    { id: "apartamento", label: "Apartamento" },
    { id: "casa", label: "Casa" },
    { id: "terreno", label: "Terreno" },
    { id: "comercial", label: "Comercial" },
    { id: "sobrado", label: "Sobrado" },
    { id: "kitnet", label: "Kitnet" },
    { id: "fazenda", label: "Fazenda" },
    { id: "chacara", label: "Chácara" },
    { id: "galpao", label: "Galpão" },
  ];

  const bedroomOptions = [
    { id: "1", label: "1 Dormitório" },
    { id: "2", label: "2 Dormitórios" },
    { id: "3", label: "3 Dormitórios" },
    { id: "4", label: "4+ Dormitórios" },
  ];

  const garageOptions = [
    { id: "1", label: "1 Vaga" },
    { id: "2", label: "2 Vagas" },
    { id: "3", label: "3+ Vagas" },
  ];

  const suiteOptions = [
    { id: "1", label: "1 Suíte" },
    { id: "2", label: "2 Suítes" },
    { id: "3", label: "3+ Suítes" },
  ];

  const bathroomOptions = [
    { id: "1", label: "1 Banheiro" },
    { id: "2", label: "2 Banheiros" },
    { id: "3", label: "3+ Banheiros" },
  ];

  const priceRangeOptions = [
    { id: "ate-170k", label: "Até R$ 170 mil" },
    { id: "170k-350k", label: "R$ 170 mil - R$ 350 mil" },
    { id: "350k-500k", label: "R$ 350 mil - R$ 500 mil" },
    { id: "500k-700k", label: "R$ 500 mil - R$ 700 mil" },
    { id: "700k-1m", label: "R$ 700 mil - R$ 1 milhão" },
    { id: "acima-1m", label: "Acima de R$ 1 milhão" },
  ];

  // Refs
  const cityRef = useRef(null);
  const propertyRef = useRef(null);
  const neighborhoodRef = useRef(null);

  // ===========================================
  // 🔥 CARREGAR BAIRROS DO BANCO
  // ===========================================
  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const { data, error } = await supabase
          .from("bairros")
          .select("id, nome, cidade_id, cidades(nome)")
          .order("nome");

        if (error) throw error;
        setBairros(data || []);
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
      }
    };

    fetchBairros();
  }, []);

  // 🔥 FILTRAR BAIRROS POR CIDADE SELECIONADA
  useEffect(() => {
    if (formValues.city && formValues.city !== "") {
      const cidadeSelecionada = cityOptions.find(
        (c) => c.id === formValues.city,
      )?.label;

      const filtrados = bairros.filter(
        (bairro) => bairro.cidades?.nome === cidadeSelecionada,
      );

      setBairrosFiltrados(filtrados);
    } else {
      setBairrosFiltrados([]);
    }
  }, [formValues.city, bairros]);

  // Efeito para carregar filtros iniciais
  // Efeito para carregar filtros iniciais
  useEffect(() => {
    const loadFiltersFromStorage = () => {
      try {
        const savedFilters = localStorage.getItem("hero_filters");
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);
          if (parsed.tipo === "alugar") {
            const heroFilters = {
              city: parsed.city || "",
              propertyType: parsed.propertyType || "",
              neighborhood: parsed.neighborhood || "",
              bedrooms: parsed.bedrooms || "",
              minArea: parsed.minArea || "",
              maxArea: parsed.maxArea || "",
              garage: parsed.garage || "",
              suite: parsed.suite || "",
              bathrooms: parsed.bathrooms || "",
              priceRange: parsed.priceRange || "",
            };
            setFormValues(heroFilters);
            setInitialFilters(heroFilters);
            return heroFilters;
          }
        }
      } catch (error) {
        console.error("Erro ao ler localStorage:", error);
      }
      return null;
    };

    const savedFilters = loadFiltersFromStorage();
    console.log("📋 savedFilters retornado:", savedFilters);

    // 🔥 AGUARDA BAIRROS CARREGAREM
    if (bairros.length > 0) {
      console.log(
        "🏁 Bairros carregados, iniciando busca com filtros:",
        savedFilters,
      );
      fetchImoveis(savedFilters || formValues);
    } else {
      console.log("⏳ Aguardando bairros carregarem...");
    }
  }, [bairros]); // ← DEPENDE de bairros

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreFilters) return;

      if (!openDropdown) return;

      const isOutside =
        cityRef.current &&
        !cityRef.current.contains(event.target) &&
        propertyRef.current &&
        !propertyRef.current.contains(event.target) &&
        neighborhoodRef.current &&
        !neighborhoodRef.current.contains(event.target);

      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, showMoreFilters]);

  // Buscar imóveis para aluguel
  const fetchImoveis = async (filtros = formValues) => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro, buscar os IDs dos imóveis que têm finalidade de aluguel ativa
      const { data: finalidadesData, error: finalidadesError } = await supabase
        .from("imovel_finalidades")
        .select("imovel_id, preco")
        .eq("tipo", "aluguel")
        .eq("status", "ativo");

      if (finalidadesError) throw finalidadesError;

      if (!finalidadesData || finalidadesData.length === 0) {
        setImoveis([]);
        setLoading(false);
        return;
      }

      // Extrair os IDs dos imóveis
      const imoveisIds = finalidadesData.map((f) => f.imovel_id);

      // Criar um mapa de preços por imóvel
      const precosMap = {};
      finalidadesData.forEach((f) => {
        precosMap[f.imovel_id] = f.preco;
      });

      // Agora buscar os imóveis com esses IDs
      let query = supabase
        .from("imoveis")
        .select("*")
        .in("id", imoveisIds)
        .in("status", ["disponivel", "reservado"]);

      // Aplicar filtros adicionais
      if (filtros.city) {
        const cidadeObj = cityOptions.find((c) => c.id === filtros.city);
        if (cidadeObj) {
          query = query.eq("cidade", cidadeObj.label);
        }
      }

      if (filtros.propertyType) {
        const tipoObj = propertyOptions.find(
          (t) => t.id === filtros.propertyType,
        );
        if (tipoObj) {
          query = query.eq("tipo", tipoObj.label.toLowerCase());
        }
      }

      // FILTRO POR BAIRRO - COM DEBUG
      if (filtros.neighborhood && filtros.neighborhood !== "") {
        console.log(
          "🎯 ALUGAR - Tentando filtrar por bairro ID:",
          filtros.neighborhood,
        );
        console.log("📋 ALUGAR - Bairros disponíveis:", bairros);

        const bairroObj = bairros.find((b) => b.id === filtros.neighborhood);
        console.log("🔍 ALUGAR - Bairro encontrado:", bairroObj);

        if (bairroObj) {
          query = query.eq("bairro", bairroObj.nome);
          console.log(
            "✅ ALUGAR - Filtro aplicado para bairro:",
            bairroObj.nome,
          );
        } else {
          console.log(
            "❌ ALUGAR - Bairro NÃO ENCONTRADO com ID:",
            filtros.neighborhood,
          );
        }
      }

      const { data: imoveisData, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      // Adicionar o preço de aluguel a cada imóvel
      let imoveisComPreco = (imoveisData || []).map((imovel) => ({
        ...imovel,
        preco: precosMap[imovel.id] || null,
      }));

      // Filtrar por preço
      if (filtros.priceRange && filtros.priceRange !== "") {
        const option = priceRangeOptions.find(
          (o) => o.id === filtros.priceRange,
        );
        if (option) {
          if (filtros.priceRange === "ate-170k") {
            imoveisComPreco = imoveisComPreco.filter(
              (imovel) => imovel.preco <= 170000,
            );
          } else if (filtros.priceRange === "acima-1m") {
            imoveisComPreco = imoveisComPreco.filter(
              (imovel) => imovel.preco >= 1000000,
            );
          } else {
            const [min, max] = filtros.priceRange
              .replace("k", "000")
              .split("-")
              .map(Number);
            if (min && max) {
              imoveisComPreco = imoveisComPreco.filter(
                (imovel) => imovel.preco >= min && imovel.preco <= max,
              );
            }
          }
        }
      }

      // Filtrar por quartos
      if (filtros.bedrooms && filtros.bedrooms !== "") {
        const quartosMin = parseInt(filtros.bedrooms) || 0;
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const qtdQuartos = parseInt(imovel.quartos || "0");
          return qtdQuartos >= quartosMin;
        });
      }

      if (filtros.garage && filtros.garage !== "") {
        const vagasMin = parseInt(filtros.garage) || 0;
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const qtdVagas = parseInt(imovel.vagas || "0");
          return qtdVagas >= vagasMin;
        });
      }

      if (filtros.bathrooms && filtros.bathrooms !== "") {
        const banheirosMin = parseInt(filtros.bathrooms) || 0;
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const qtdBanheiros = parseInt(imovel.banheiros || "0");
          return qtdBanheiros >= banheirosMin;
        });
      }

      if (filtros.suite && filtros.suite !== "") {
        const suitesMin = parseInt(filtros.suite) || 0;
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const qtdSuites = parseInt(imovel.suites || "0");
          return qtdSuites >= suitesMin;
        });
      }

      // Buscar fotos de capa
      const imoveisComFotos = await Promise.all(
        imoveisComPreco.map(async (imovel) => {
          try {
            const { data: fotos, error: fotosError } = await supabase
              .from("fotos_imovel")
              .select("url, is_capa, ordem")
              .eq("imovel_id", imovel.id)
              .order("ordem", { ascending: true });

            if (fotosError) throw fotosError;

            let fotoCapa = null;
            if (fotos && fotos.length > 0) {
              const capa = fotos.find((f) => f.is_capa === true);
              fotoCapa = capa ? capa.url : fotos[0].url;
            }

            return {
              ...imovel,
              fotos: fotos || [],
              fotoCapa:
                fotoCapa ||
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&h=300&q=60",
            };
          } catch (err) {
            return {
              ...imovel,
              fotos: [],
              fotoCapa:
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&h=300&q=60",
            };
          }
        }),
      );

      // 🔥 ORDENAR POR DATA DE CRIAÇÃO (mais novo primeiro)
      const imoveisOrdenados = [...imoveisComFotos].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setImoveis(imoveisOrdenados);
    } catch (err) {
      console.error("💥 Erro ao buscar imóveis para aluguel:", err);
      setError("Erro ao carregar os imóveis. Tente novamente.");
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImoveis(formValues);
  };

  const clearFilters = () => {
    setFormValues({
      city: "",
      propertyType: "",
      neighborhood: "",
      bedrooms: "",
      minArea: "",
      maxArea: "",
      garage: "",
      suite: "",
      bathrooms: "",
      priceRange: "",
    });
    fetchImoveis();
  };

  const handleOpenFilters = () => {
    setShowMoreFilters(true);
  };

  const handleCloseFilters = () => {
    setShowMoreFilters(false);
    setFilterDropdownOpen(null);
  };

  // Função para formatar preço
  const formatPrice = (price) => {
    if (!price || price === "0" || price === "0.00") {
      return "Preço sob consulta";
    }

    let valorNumerico;
    if (typeof price === "string") {
      const stringLimpa = price
        .replace(/[^\d,.-]/g, "")
        .replace(".", "")
        .replace(",", ".");
      valorNumerico = parseFloat(stringLimpa);
    } else {
      valorNumerico = Number(price);
    }

    if (isNaN(valorNumerico) || !isFinite(valorNumerico)) {
      return "Preço sob consulta";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  };

  const extrairDadosImovel = (imovel) => {
    return {
      quartos: imovel.quartos || "0",
      suites: imovel.suites || "0",
      banheiros: imovel.banheiros || "0",
      vagas: imovel.vagas || "0",
      areaTotal: imovel.area_total || "0",
      areaConstruida: imovel.area_construida || "0",
    };
  };

  const gerarTituloCard = (imovel) => {
    if (!imovel) return "Imóvel";

    const tipo = imovel.tipo || "imóvel";
    const bairro = imovel.bairro ? imovel.bairro.replace(/ /g, "-") : "";
    const cidade = imovel.cidade || "";
    const estado = imovel.estado || "";

    if (bairro && cidade && estado) {
      return `${tipo} ${bairro}-${cidade}-${estado}`;
    }
    if (cidade && estado) {
      return `${tipo} ${cidade}-${estado}`;
    }
    if (cidade) {
      return `${tipo} ${cidade}`;
    }
    if (estado) {
      return `${tipo} - ${estado}`;
    }
    return imovel.titulo || `${tipo} em localização privilegiada`;
  };

  const getStatus = (imovel) => {
    if (imovel.status === "vendido") return "sold";
    if (imovel.status === "destaque") return "price-drop";
    return "available";
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa]">
      {/* HEADER AMARELO COM TÍTULO BRANCO */}
      <header
        className="w-full mt-16 md:mt-20 lg:mt-24"
        style={{ backgroundColor: "#D4A24D" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[135px] md:h-[155px] lg:h-[175px] flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-center">
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></span>
                Carregando...
              </span>
            ) : (
              <>
                {imoveis.length} {imoveis.length === 1 ? "imóvel" : "imóveis"}{" "}
                disponíveis hoje
              </>
            )}
          </h1>
        </div>
      </header>

      {/* SEÇÃO DE FILTROS */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 🔥 TEXTO ACIMA - SÓ NO DESKTOP */}
          <div className="hidden md:block text-center mb-4 mt-6">
            <p className="text-gray-600 text-sm md:text-base">
              Use nossos filtros para encontrar o imóvel{" "}
              <span className="font-medium text-[#D4A24D]">
                ideal para você
              </span>
            </p>
          </div>

          <div className="relative mt-2 md:mt-4">
            {/* BORDA ULTRAFINA */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_0.25px_#31363E]"></div>

            {/* FUNDO COM DEGRADÊ HORIZONTAL */}
            <div className="absolute inset-[0.25px] rounded-2xl bg-gradient-to-r from-[#31363E]/30 via-[#D4A24D]/30 to-[#31363E]/30"></div>

            {/* CONTEÚDO */}
            <div className="relative rounded-2xl p-6 md:p-8 z-10 bg-white/70 backdrop-blur-[1px]">
              {/* VERSÃO MOBILE - TEXTO DENTRO DA BOX */}
              <div className="block md:hidden">
                <div className="flex flex-col items-center">
                  <p className="text-gray-600 text-sm text-center max-w-xs mx-auto mb-[18px]">
                    Use nossos filtros para encontrar o imóvel ideal para você
                  </p>
                  <button
                    onClick={handleOpenFilters}
                    className="bg-[#D4A24D] hover:bg-[#c0903d] text-white font-bold text-sm py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
                  >
                    <i className="fas fa-sliders-h"></i>
                    FILTROS DE BUSCA
                  </button>
                </div>
              </div>

              {/* VERSÃO DESKTOP - FILTROS PRINCIPAIS */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* CIDADE */}
                    <div className="relative col-span-3" ref={cityRef}>
                      <div
                        onClick={() => toggleDropdown("city")}
                        className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                          openDropdown === "city"
                            ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                            : "border-gray-200 hover:border-gray-300"
                        } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                      >
                        <i
                          className={`fas fa-map-marker-alt mr-2 text-sm ${formValues.city ? "text-[#D4A24D]" : "text-gray-400"}`}
                        />
                        <span
                          className={`flex-1 text-sm font-semibold truncate ${
                            formValues.city ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {formValues.city
                            ? cityOptions.find(
                                (opt) => opt.id === formValues.city,
                              )?.label
                            : "Cidade"}
                        </span>
                        <i
                          className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                            openDropdown === "city"
                              ? "rotate-180 text-[#D4A24D]"
                              : ""
                          }`}
                        />
                      </div>

                      {openDropdown === "city" && (
                        <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                          {cityOptions.map((opt) => (
                            <div
                              key={opt.id}
                              onClick={() => handleInputChange("city", opt.id)}
                              className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                                formValues.city === opt.id
                                  ? "bg-[#D4A24D]/5"
                                  : ""
                              }`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  formValues.city === opt.id
                                    ? "text-[#D4A24D] font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {opt.label}
                              </span>
                              {formValues.city === opt.id && (
                                <i className="fas fa-check text-[#D4A24D] text-sm" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* TIPO DE IMÓVEL */}
                    <div className="relative col-span-3" ref={propertyRef}>
                      <div
                        onClick={() => toggleDropdown("propertyType")}
                        className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                          openDropdown === "propertyType"
                            ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                            : "border-gray-200 hover:border-gray-300"
                        } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                      >
                        <i
                          className={`fas fa-building mr-2 text-sm ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                        />
                        <span
                          className={`flex-1 text-sm font-semibold truncate ${
                            formValues.propertyType
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {formValues.propertyType
                            ? propertyOptions.find(
                                (opt) => opt.id === formValues.propertyType,
                              )?.label
                            : "Tipo"}
                        </span>
                        <i
                          className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                            openDropdown === "propertyType"
                              ? "rotate-180 text-[#D4A24D]"
                              : ""
                          }`}
                        />
                      </div>

                      {openDropdown === "propertyType" && (
                        <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {propertyOptions.map((opt) => (
                              <div
                                key={opt.id}
                                onClick={() =>
                                  handleInputChange("propertyType", opt.id)
                                }
                                className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                                  formValues.propertyType === opt.id
                                    ? "bg-[#D4A24D]/5"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`text-sm font-medium ${
                                    formValues.propertyType === opt.id
                                      ? "text-[#D4A24D] font-semibold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {opt.label}
                                </span>
                                {formValues.propertyType === opt.id && (
                                  <i className="fas fa-check text-[#D4A24D] text-sm" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 🔥 BAIRRO */}
                    <div className="relative col-span-2" ref={neighborhoodRef}>
                      <div
                        onClick={() => toggleDropdown("neighborhood")}
                        className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                          openDropdown === "neighborhood"
                            ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                            : "border-gray-200 hover:border-gray-300"
                        } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${
                          !formValues.city
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <i
                          className={`fas fa-map-pin mr-2 text-sm ${formValues.neighborhood ? "text-[#D4A24D]" : "text-gray-400"}`}
                        />
                        <span
                          className={`flex-1 text-sm font-semibold truncate ${
                            formValues.neighborhood
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {formValues.neighborhood
                            ? bairros.find(
                                (b) => b.id === formValues.neighborhood,
                              )?.nome
                            : !formValues.city
                              ? "Selecione uma cidade"
                              : "Bairro"}
                        </span>
                        <i
                          className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                            openDropdown === "neighborhood"
                              ? "rotate-180 text-[#D4A24D]"
                              : ""
                          }`}
                        />
                      </div>

                      {openDropdown === "neighborhood" && (
                        <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {bairrosFiltrados.length > 0 ? (
                              bairrosFiltrados.map((bairro) => (
                                <div
                                  key={bairro.id}
                                  onClick={() =>
                                    handleInputChange("neighborhood", bairro.id)
                                  }
                                  className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                                    formValues.neighborhood === bairro.id
                                      ? "bg-[#D4A24D]/5"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`text-sm font-medium ${
                                      formValues.neighborhood === bairro.id
                                        ? "text-[#D4A24D] font-semibold"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {bairro.nome}
                                  </span>
                                  {formValues.neighborhood === bairro.id && (
                                    <i className="fas fa-check text-[#D4A24D] text-sm" />
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm">
                                {!formValues.city
                                  ? "Selecione uma cidade primeiro"
                                  : "Nenhum bairro cadastrado para esta cidade"}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BOTÃO MAIS FILTROS */}
                    <button
                      type="button"
                      onClick={handleOpenFilters}
                      className="col-span-2 bg-white border-2 border-[#D4A24D] text-[#D4A24D] font-extrabold text-sm rounded-xl h-[56px] flex items-center justify-center gap-2 hover:bg-[#D4A24D] hover:text-white transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
                    >
                      <i className="fas fa-sliders-h" />
                      MAIS FILTROS
                    </button>

                    {/* BOTÃO BUSCAR */}
                    <button
                      type="submit"
                      className="col-span-2 bg-[#D4A24D] text-white font-extrabold text-sm rounded-xl h-[56px] flex items-center justify-center gap-2 hover:bg-[#c0903d] transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
                    >
                      <i className="fas fa-search" />
                      BUSCAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDICADOR DE RESULTADOS */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex items-center gap-2 ml-[3px]">
            <div className="bg-[#D4A24D] w-1.5 h-5 rounded-full"></div>
            <span className="text-[#31363E] text-sm font-medium">
              {imoveis.length}{" "}
              {imoveis.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </span>
          </div>
        </div>
      )}

      {/* LISTAGEM DE IMÓVEIS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* LOADING */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D4A24D] border-t-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Buscando imóveis para aluguel...
            </p>
          </div>
        )}

        {/* ERRO */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-6"></i>
            <p className="text-xl text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchImoveis(formValues)}
              className="px-8 py-3 bg-[#D4A24D] text-white font-bold rounded-lg hover:bg-[#c0903d] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* LISTA DE IMÓVEIS */}
        {!loading && !error && (
          <>
            {imoveis.length > 0 ? (
              <div className="flex flex-col gap-8 md:gap-10">
                {imoveis.map((imovel) => {
                  const dados = extrairDadosImovel(imovel);
                  const tituloCard = gerarTituloCard(imovel);

                  return (
                    <CardImovel
                      key={imovel.id}
                      id={imovel.id}
                      slug={imovel.slug}
                      status={getStatus(imovel)}
                      tipo={imovel.tipo?.toUpperCase() || "CASA"}
                      finalidade="ALUGUEL"
                      preco={formatPrice(imovel.preco)}
                      titulo={tituloCard}
                      localizacao={`${imovel.bairro || ""}${imovel.bairro && imovel.cidade ? " • " : ""}${imovel.cidade || ""}${imovel.estado ? ` / ${imovel.estado}` : ""}`}
                      bairro={imovel.bairro}
                      cidade={imovel.cidade}
                      estado={imovel.estado}
                      quartos={dados.quartos}
                      suites={dados.suites}
                      banheiros={dados.banheiros}
                      vagas={dados.vagas}
                      areaTotal={dados.areaTotal}
                      areaConstruida={dados.areaConstruida}
                      emCondominio={imovel.em_condominio || false}
                      empreendimento={imovel.edificios || null}
                      unidade={imovel.unidade || ""}
                      andar={imovel.andar || ""}
                      bloco={imovel.bloco || ""}
                      imagem={
                        imovel.fotoCapa ||
                        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&h=300&q=60"
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <i className="fas fa-home text-7xl text-gray-300 mb-6"></i>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  Nenhum imóvel disponível
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Não encontramos imóveis para aluguel com os filtros
                  selecionados.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3 bg-[#D4A24D] text-white font-bold rounded-lg hover:bg-[#c0903d] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* BOTTOM SHEET (MOBILE) */}
      {showMoreFilters && (
        <BottomSheet
          show={showMoreFilters}
          onClose={handleCloseFilters}
          formValues={formValues}
          onInputChange={handleInputChange}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
          priceRangeOptions={priceRangeOptions}
          garageOptions={garageOptions}
          suiteOptions={suiteOptions}
          bathroomOptions={bathroomOptions}
          bedroomOptions={bedroomOptions}
        />
      )}

      {/* MODAL DESKTOP */}
      {showMoreFilters && (
        <DesktopModal
          show={showMoreFilters}
          onClose={handleCloseFilters}
          formValues={formValues}
          onInputChange={handleInputChange}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
          priceRangeOptions={priceRangeOptions}
          garageOptions={garageOptions}
          suiteOptions={suiteOptions}
          bathroomOptions={bathroomOptions}
          bedroomOptions={bedroomOptions}
        />
      )}
    </div>
  );
};

export default AlugarImovel;
