import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import ReactDOM from "react-dom";

// ===========================================
// BOTTOM SHEET (MOBILE) - IGUAL AO COMPRAIMOVEL
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

    // 🔥 Fechar dropdown ao clicar fora
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
// MODAL DESKTOP - IGUAL AO COMPRAIMOVEL
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

    // Fechar dropdown ao clicar fora
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
// COMPONENTE HERO
// ===========================================
const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comprar");
  const [touchStart, setTouchStart] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // ESTADOS COMPLETAMENTE INDEPENDENTES
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [formValues, setFormValues] = useState({
    city: "",
    propertyType: "",
    bedrooms: "",
    minArea: "",
    maxArea: "",
    neighborhood: "",
    garage: "",
    suite: "",
    bathrooms: "",
    priceRange: "",
  });

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(null);

  // 🔥 ESTADO PARA BAIRROS (vindo do banco)
  const [bairros, setBairros] = useState([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState([]);

  console.log("🔥 PAI RENDERIZOU", {
    timestamp: Date.now(),
    showMoreFilters,
    formValues,
  });

  // LOGS DO PAI
  useEffect(() => {
    console.log("🔄 PAI MONTADO");
    return () => {
      console.log("💀 PAI DESMONTADO!");
    };
  }, []);

  useEffect(() => {
    console.log("🔄 showMoreFilters mudou:", showMoreFilters);
  }, [showMoreFilters]);

  // Refs
  const cityRef = useRef(null);
  const propertyRef = useRef(null);
  const neighborhoodRef = useRef(null);

  const cityOptions = [
    { id: "acailandia", label: "Açailândia" },
    { id: "imperatriz", label: "Imperatriz" },
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
    { id: "2", label: "2+ Dormitórios" },
    { id: "3", label: "3+ Dormitórios" },
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

  // ===========================================
  // 🔥 FILTRAR BAIRROS POR CIDADE
  // ===========================================
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

  // Fechar dropdown principal ao clicar fora
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
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openDropdown, showMoreFilters]);

  // Bloqueio de scroll
  useEffect(() => {
    if (showMoreFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMoreFilters]);

  const handleInputChange = (field, value) => {
    console.log("📝 handleInputChange:", { field, value });
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchEnd - touchStart;
    if (swipeDistance > 40) setActiveTab("alugar");
    else if (swipeDistance < -40) setActiveTab("comprar");
    setTouchStart(null);
  };

  // ✅ HANDLE SEARCH CORRIGIDO - IGUAL AO COMPRAIMOVEL
  const handleSearch = (e) => {
    e.preventDefault();

    console.log("🔍 Bairro selecionado ID:", formValues.neighborhood); // ← ADICIONE

    const searchParams = {
      tipo: activeTab,
      city: formValues.city || "",
      propertyType: formValues.propertyType || "",
      bedrooms: formValues.bedrooms || "",
      minArea: formValues.minArea || "",
      maxArea: formValues.maxArea || "",
      neighborhood: formValues.neighborhood || "", // ← TEM QUE SER O UUID!
      garage: formValues.garage || "",
      suite: formValues.suite || "",
      bathrooms: formValues.bathrooms || "",
      priceRange: formValues.priceRange || "",
    };

    localStorage.setItem("hero_filters", JSON.stringify(searchParams));
    navigate(`/${activeTab}`);
  };

  const clearFilters = () => {
    console.log("🧹 clearFilters");
    setFormValues({
      city: "",
      propertyType: "",
      bedrooms: "",
      minArea: "",
      maxArea: "",
      neighborhood: "",
      garage: "",
      suite: "",
      bathrooms: "",
      priceRange: "",
    });
  };

  const handleOpenFilters = () => {
    console.log("🔘 Abrindo filtros");
    setShowMoreFilters(true);
  };

  const handleCloseFilters = () => {
    console.log("❌ Fechando filtros");
    setShowMoreFilters(false);
    setFilterDropdownOpen(null);
  };

  return (
    <section className="w-full relative" style={{ backgroundColor: "#31363E" }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(212, 162, 77, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4A24D; border-radius: 20px; }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes dropdown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-dropdown { animation: dropdown 0.2s ease-out; }
      `}</style>

      {/* IMAGEM */}
      <div className="absolute top-0 left-0 w-full h-[400px] md:h-[500px] lg:h-[580px]">
        <img
          src="https://adventusimobiliaria.com.br/img/banner/image/20/Equipe.jpg"
          alt="Equipe Adventus Imobiliária"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#31363E]"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="relative top-[220px] md:top-[280px] lg:top-[330px] z-20 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="mb-3 md:mb-4 text-center px-4">
          <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-extrabold text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] tracking-tight leading-tight">
            Encontre seu lar ideal
          </h1>
        </div>

        {/* BOX DO FORMULÁRIO */}
        <div className="bg-white/90 backdrop-blur-md rounded-none md:rounded-2xl p-6 md:p-7 lg:p-8 border border-white/20 shadow-md w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] md:static md:w-full md:max-w-6xl md:mx-auto">
          {/* SELETOR - PÍLULA */}
          <div className="mb-6 w-full px-0 md:px-0">
            <div className="max-w-[280px] md:max-w-[300px] mx-auto lg:mx-0">
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative bg-gray-900/95 rounded-full h-12 md:h-14 w-full p-1.5 flex items-center border border-gray-300 shadow-inner overflow-hidden cursor-pointer touch-pan-x"
              >
                <div
                  className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-[#D4A24D] rounded-full shadow-md transition-all duration-300 ease-out z-0 ${
                    activeTab === "comprar"
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                  style={{ left: "6px" }}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab("comprar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${
                    activeTab === "comprar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Comprar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("alugar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${
                    activeTab === "alugar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Alugar
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-2 lg:gap-3">
              {/* DROPDOWN CIDADE */}
              <div className="relative w-full md:col-span-1" ref={cityRef}>
                <div
                  onClick={() => toggleDropdown("city")}
                  className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border ${
                    openDropdown === "city"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-map-marker-alt mr-2 text-sm ${formValues.city ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-semibold truncate ${
                      formValues.city ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {formValues.city
                      ? cityOptions.find((opt) => opt.id === formValues.city)
                          ?.label
                      : "Cidade"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      openDropdown === "city" ? "rotate-180 text-[#D4A24D]" : ""
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
                          formValues.city === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm md:text-base font-medium ${
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

              {/* DROPDOWN TIPO */}
              <div className="relative w-full md:col-span-1" ref={propertyRef}>
                <div
                  onClick={() => toggleDropdown("propertyType")}
                  className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border ${
                    openDropdown === "propertyType"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-building mr-2 text-sm ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-semibold truncate ${
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
                            className={`text-sm md:text-base font-medium ${
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

              {/* DROPDOWN BAIRRO */}
              <div
                className="relative w-full md:col-span-1"
                ref={neighborhoodRef}
              >
                <div
                  onClick={() => toggleDropdown("neighborhood")}
                  className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border ${
                    openDropdown === "neighborhood"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    !formValues.city ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <i
                    className={`fas fa-map-pin mr-2 text-sm ${formValues.neighborhood ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-semibold truncate ${
                      formValues.neighborhood
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {formValues.neighborhood
                      ? bairros.find((b) => b.id === formValues.neighborhood)
                          ?.nome
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
                className="w-full bg-white border-2 border-[#D4A24D] text-[#D4A24D] font-extrabold text-sm md:text-base rounded-xl h-[56px] md:h-[60px] flex items-center justify-center gap-2 hover:bg-[#D4A24D] hover:text-white transition-all shadow-lg active:scale-95 outline-none focus:outline-none md:col-span-1"
              >
                <i className="fas fa-sliders-h" />
                <span className="hidden sm:inline">MAIS FILTROS</span>
                <span className="sm:hidden">FILTROS</span>
              </button>

              {/* BOTÃO BUSCAR */}
              <button
                type="submit"
                className="w-full bg-[#D4A24D] text-white font-extrabold text-sm md:text-base rounded-xl h-[56px] md:h-[60px] flex items-center justify-center gap-2 hover:bg-[#c0903d] transition-all shadow-lg active:scale-95 outline-none focus:outline-none md:col-span-1"
              >
                <i className="fas fa-search" />
                <span>BUSCAR</span>
              </button>
            </div>
          </form>

          <p className="text-sm md:text-base text-gray-700 text-center mt-6 flex items-center justify-center gap-2 font-light italic">
            <i className="fas fa-check-circle text-[#D4A24D]" />
            Mais de 500 imóveis disponíveis
          </p>
        </div>
      </div>

      <div className="h-[200px] md:h-[315px] lg:h-[375px]" />

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
    </section>
  );
};

export default Hero;
