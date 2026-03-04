import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import CardImovel from "../componentes/CardImovel/CardImovel";
import ReactDOM from "react-dom";

// ===========================================
// BOTTOM SHEET (MOBILE)
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
    neighborhoodOptions,
    cityOptions,
    propertyOptions,
    bedroomOptions,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);

    useEffect(() => {
      console.log("📱 BOTTOM SHEET MONTADO");
      return () => {
        console.log("📱 BOTTOM SHEET DESMONTADO!");
      };
    }, []);

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
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100 z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Mais filtros</h3>
              <button
                onClick={handleClose}
                className="p-2 bg-[#D4A24D] text-white rounded-full hover:bg-[#c0903d] transition-colors shadow-sm flex items-center justify-center w-8 h-8"
              >
                <i className="fas fa-times text-white text-sm" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* CIDADE */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <div
                onClick={(e) => toggleDropdown("city", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "city"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.city ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {propsFormValues.city
                    ? cityOptions?.find((o) => o.id === propsFormValues.city)
                        ?.label
                    : "Selecione a cidade"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                    localDropdownOpen === "city"
                      ? "rotate-180 text-[#D4A24D]"
                      : ""
                  }`}
                />
              </div>

              {localDropdownOpen === "city" && (
                <div
                  className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto">
                    {cityOptions?.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("city", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.city === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.city === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.city === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TIPO DE IMÓVEL */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de imóvel
              </label>
              <div
                onClick={(e) => toggleDropdown("propertyType", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "propertyType"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.propertyType
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {propsFormValues.propertyType
                    ? propertyOptions?.find(
                        (o) => o.id === propsFormValues.propertyType,
                      )?.label
                    : "Selecione o tipo"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                    localDropdownOpen === "propertyType"
                      ? "rotate-180 text-[#D4A24D]"
                      : ""
                  }`}
                />
              </div>

              {localDropdownOpen === "propertyType" && (
                <div
                  className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto">
                    {propertyOptions?.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("propertyType", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.propertyType === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.propertyType === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.propertyType === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DORMITÓRIOS */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dormitórios
              </label>
              <div
                onClick={(e) => toggleDropdown("bedrooms", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "bedrooms"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.bedrooms ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {propsFormValues.bedrooms
                    ? bedroomOptions?.find(
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  {bedroomOptions?.map((opt) => (
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

            {/* BAIRRO */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <div
                onClick={(e) => toggleDropdown("neighborhood", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "neighborhood"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.neighborhood
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {propsFormValues.neighborhood
                    ? neighborhoodOptions?.find(
                        (o) => o.id === propsFormValues.neighborhood,
                      )?.label
                    : "Selecione o bairro"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                    localDropdownOpen === "neighborhood"
                      ? "rotate-180 text-[#D4A24D]"
                      : ""
                  }`}
                />
              </div>

              {localDropdownOpen === "neighborhood" && (
                <div
                  className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-[220px] overflow-y-auto">
                    {neighborhoodOptions?.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("neighborhood", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          propsFormValues.neighborhood === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            propsFormValues.neighborhood === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {propsFormValues.neighborhood === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FAIXA DE PREÇO */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de preço
              </label>
              <div
                onClick={(e) => toggleDropdown("priceRange", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "priceRange"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.priceRange
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {propsFormValues.priceRange
                    ? priceRangeOptions?.find(
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  {priceRangeOptions?.map((opt) => (
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
              )}
            </div>

            {/* VAGAS */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vagas
              </label>
              <div
                onClick={(e) => toggleDropdown("garage", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "garage"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.garage ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {propsFormValues.garage
                    ? garageOptions?.find(
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  {garageOptions?.map((opt) => (
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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suítes
              </label>
              <div
                onClick={(e) => toggleDropdown("suite", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "suite"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.suite ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {propsFormValues.suite
                    ? suiteOptions?.find((o) => o.id === propsFormValues.suite)
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  {suiteOptions?.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={(e) => selectOption("suite", opt.id, e)}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                        propsFormValues.suite === opt.id ? "bg-[#D4A24D]/5" : ""
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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banheiros
              </label>
              <div
                onClick={(e) => toggleDropdown("bathrooms", e)}
                className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                  localDropdownOpen === "bathrooms"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
              >
                <span
                  className={`flex-1 text-left text-sm md:text-base font-medium truncate ${
                    propsFormValues.bathrooms
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {propsFormValues.bathrooms
                    ? bathroomOptions?.find(
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
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  {bathroomOptions?.map((opt) => (
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

            {/* Botões */}
            <div className="grid grid-cols-2 gap-3 pt-4 sticky bottom-0 bg-white pb-6 border-t border-gray-100">
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
// MODAL DESKTOP
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
    neighborhoodOptions,
    cityOptions,
    propertyOptions,
    bedroomOptions,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);

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
              {/* CIDADE */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("cityDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "cityDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.city ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.city
                        ? cityOptions?.find(
                            (o) => o.id === propsFormValues.city,
                          )?.label
                        : "Selecione a cidade"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                        localDropdownOpen === "cityDesktop"
                          ? "rotate-180 text-[#D4A24D]"
                          : ""
                      }`}
                    />
                  </div>

                  {localDropdownOpen === "cityDesktop" && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[220px] overflow-y-auto">
                        {cityOptions?.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={(e) => selectOption("city", opt.id, e)}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                              propsFormValues.city === opt.id
                                ? "bg-[#D4A24D]/5"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                propsFormValues.city === opt.id
                                  ? "text-[#D4A24D] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {propsFormValues.city === opt.id && (
                              <i className="fas fa-check text-[#D4A24D] text-sm" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TIPO DE IMÓVEL */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de imóvel
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("propertyTypeDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "propertyTypeDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.propertyType
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.propertyType
                        ? propertyOptions?.find(
                            (o) => o.id === propsFormValues.propertyType,
                          )?.label
                        : "Selecione o tipo"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                        localDropdownOpen === "propertyTypeDesktop"
                          ? "rotate-180 text-[#D4A24D]"
                          : ""
                      }`}
                    />
                  </div>

                  {localDropdownOpen === "propertyTypeDesktop" && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[220px] overflow-y-auto">
                        {propertyOptions?.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={(e) =>
                              selectOption("propertyType", opt.id, e)
                            }
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                              propsFormValues.propertyType === opt.id
                                ? "bg-[#D4A24D]/5"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                propsFormValues.propertyType === opt.id
                                  ? "text-[#D4A24D] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {propsFormValues.propertyType === opt.id && (
                              <i className="fas fa-check text-[#D4A24D] text-sm" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DORMITÓRIOS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitórios
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("bedroomsDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "bedroomsDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.bedrooms
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.bedrooms
                        ? bedroomOptions?.find(
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
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      {bedroomOptions?.map((opt) => (
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

              {/* BAIRRO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("neighborhoodDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "neighborhoodDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.neighborhood
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.neighborhood
                        ? neighborhoodOptions?.find(
                            (o) => o.id === propsFormValues.neighborhood,
                          )?.label
                        : "Selecione o bairro"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                        localDropdownOpen === "neighborhoodDesktop"
                          ? "rotate-180 text-[#D4A24D]"
                          : ""
                      }`}
                    />
                  </div>

                  {localDropdownOpen === "neighborhoodDesktop" && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[220px] overflow-y-auto">
                        {neighborhoodOptions?.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={(e) =>
                              selectOption("neighborhood", opt.id, e)
                            }
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                              propsFormValues.neighborhood === opt.id
                                ? "bg-[#D4A24D]/5"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                propsFormValues.neighborhood === opt.id
                                  ? "text-[#D4A24D] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {propsFormValues.neighborhood === opt.id && (
                              <i className="fas fa-check text-[#D4A24D] text-sm" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FAIXA DE PREÇO */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de preço
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("priceRangeDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "priceRangeDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.priceRange
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.priceRange
                        ? priceRangeOptions?.find(
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
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      {priceRangeOptions?.map((opt) => (
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
                  )}
                </div>
              </div>

              {/* VAGAS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vagas
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("garageDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "garageDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.garage
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.garage
                        ? garageOptions?.find(
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
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      {garageOptions?.map((opt) => (
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
              </div>

              {/* SUÍTES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suítes
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("suiteDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "suiteDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.suite
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.suite
                        ? suiteOptions?.find(
                            (o) => o.id === propsFormValues.suite,
                          )?.label
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
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      {suiteOptions?.map((opt) => (
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
              </div>

              {/* BANHEIROS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banheiros
                </label>
                <div className="relative">
                  <div
                    onClick={(e) => toggleDropdown("bathroomsDesktop", e)}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border ${
                      localDropdownOpen === "bathroomsDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium truncate ${
                        propsFormValues.bathrooms
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {propsFormValues.bathrooms
                        ? bathroomOptions?.find(
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
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                      {bathroomOptions?.map((opt) => (
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
              </div>
            </div>

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
// COMPONENTE PRINCIPAL
// ===========================================
const ComprarImovel = () => {
  const location = useLocation();
  const [initialFilters, setInitialFilters] = useState({});

  // Estados
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(null);

  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros ativos
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

  // =============== OPÇÕES (DECLARADAS NO TOPO) ===============
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

  const neighborhoodOptions = [
    { id: "centro-acailandia", label: "Centro - Açailândia" },
    { id: "barra-azul", label: "Barra Azul - Açailândia" },
    { id: "jardim-gloria", label: "Jardim Glória - Açailândia" },
    { id: "getat", label: "Getat - Açailândia" },
    { id: "centro-imperatriz", label: "Centro - Imperatriz" },
    { id: "laranjeiras", label: "Laranjeiras - Imperatriz" },
    { id: "colinas-park", label: "Colinas Park - Imperatriz" },
    { id: "jardim-ala", label: "Jardim de Alá - Imperatriz" },
  ];

  // Refs
  const cityRef = useRef(null);
  const propertyRef = useRef(null);
  const bedroomRef = useRef(null);

  // Efeito para carregar filtros iniciais
  useEffect(() => {
    const loadFiltersFromStorage = () => {
      try {
        const savedFilters = localStorage.getItem("hero_filters");
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);
          if (parsed.tipo === "comprar") {
            const heroFilters = {
              city: parsed.city || "",
              propertyType: parsed.propertyType || "",
              bedrooms: parsed.bedrooms || "",
              minArea: parsed.minArea || "",
              maxArea: parsed.maxArea || "",
              neighborhood: parsed.neighborhood || "",
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
    fetchImoveis(savedFilters || formValues);
  }, []);

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
        bedroomRef.current &&
        !bedroomRef.current.contains(event.target);

      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, showMoreFilters]);

  // Buscar imóveis
  const fetchImoveis = async (filtros = formValues) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("imoveis")
        .select("*")
        .order("created_at", { ascending: false });

      query = query.in("status", ["disponivel", "reservado"]);

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

      if (filtros.priceRange && filtros.priceRange !== "") {
        const option = priceRangeOptions.find(
          (o) => o.id === filtros.priceRange,
        );
        if (option) {
          if (filtros.priceRange === "ate-170k") {
            query = query.lte("preco", 170000);
          } else if (filtros.priceRange === "acima-1m") {
            query = query.gte("preco", 1000000);
          } else {
            const [min, max] = filtros.priceRange
              .replace("k", "000")
              .split("-")
              .map(Number);
            if (min && max) {
              query = query.gte("preco", min).lte("preco", max);
            }
          }
        }
      }

      const { data: imoveisData, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      // Filtrar por quartos MANUALMENTE
      let imoveisFiltrados = imoveisData || [];

      if (filtros.bedrooms && filtros.bedrooms !== "") {
        const quartosMin = parseInt(filtros.bedrooms) || 0;
        imoveisFiltrados = imoveisFiltrados.filter((imovel) => {
          const dependencias = imovel.dependencias || {};
          const caracteristicas = imovel.caracteristicas || {};
          const qtdQuartos = parseInt(
            dependencias.dormitorios || caracteristicas.quartos || "0",
          );
          return qtdQuartos >= quartosMin;
        });
      }

      // Buscar fotos para cada imóvel
      const imoveisComFotos = await Promise.all(
        imoveisFiltrados.map(async (imovel) => {
          try {
            const { data: fotos, error: fotosError } = await supabase
              .from("fotos_imovel")
              .select("url, is_capa, ordem")
              .eq("imovel_id", imovel.id)
              .order("ordem", { ascending: true });

            if (fotosError) {
              return { ...imovel, fotos: [] };
            }

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

      setImoveis(imoveisComFotos || []);
    } catch (err) {
      console.error("💥 Erro ao buscar imóveis:", err);
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
      bedrooms: "",
      minArea: "",
      maxArea: "",
      neighborhood: "",
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
    const caracteristicas = imovel.caracteristicas || {};
    const dependencias = imovel.dependencias || {};

    return {
      quartos: dependencias.dormitorios || caracteristicas.quartos || "0",
      suites: dependencias.suites || caracteristicas.suites || "0",
      banheiros: dependencias.banheiros || caracteristicas.banheiros || "0",
      vagas: dependencias.vagas || caracteristicas.vagas || "0",
      areaTotal: dependencias.area_total || caracteristicas.areaTotal || "0",
      areaConstruida:
        dependencias.area_construida || caracteristicas.areaConstruida || "0",
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
      {/* HEADER AZUL COM TÍTULO BRANCO */}
      <header
        className="w-full mt-16 md:mt-20 lg:mt-24"
        style={{ backgroundColor: "#31363E" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[135px] md:h-[155px] lg:h-[175px] flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-center">
            Encontre o imóvel que você buscava
          </h1>
        </div>
      </header>

      {/* SEÇÃO DE FILTROS - SEM CONTAINER BRANCO EXTRA */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ÚNICA DIV COM FUNDO BRANCO E CANTOS ARREDONDADOS */}
          <div className="bg-white rounded-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.03)] p-6 md:p-8 relative z-10 border border-gray-100 mt-8 md:mt-10">
            {/* VERSÃO MOBILE */}
            <div className="block md:hidden">
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Use nossos filtros para encontrar o imóvel perfeito para você
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

            {/* VERSÃO DESKTOP */}
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
                              formValues.city === opt.id ? "bg-[#D4A24D]/5" : ""
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

                  {/* DORMITÓRIOS */}
                  <div className="relative col-span-2" ref={bedroomRef}>
                    <div
                      onClick={() => toggleDropdown("bedrooms")}
                      className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                        openDropdown === "bedrooms"
                          ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                          : "border-gray-200 hover:border-gray-300"
                      } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                    >
                      <i
                        className={`fas fa-bed mr-2 text-sm ${formValues.bedrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                      />
                      <span
                        className={`flex-1 text-sm font-semibold truncate ${
                          formValues.bedrooms
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {formValues.bedrooms
                          ? bedroomOptions.find(
                              (opt) => opt.id === formValues.bedrooms,
                            )?.label
                          : "Dormitórios"}
                      </span>
                      <i
                        className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                          openDropdown === "bedrooms"
                            ? "rotate-180 text-[#D4A24D]"
                            : ""
                        }`}
                      />
                    </div>

                    {openDropdown === "bedrooms" && (
                      <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                        {bedroomOptions.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={() =>
                              handleInputChange("bedrooms", opt.id)
                            }
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                              formValues.bedrooms === opt.id
                                ? "bg-[#D4A24D]/5"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                formValues.bedrooms === opt.id
                                  ? "text-[#D4A24D] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {formValues.bedrooms === opt.id && (
                              <i className="fas fa-check text-[#D4A24D] text-sm" />
                            )}
                          </div>
                        ))}
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e6a400] border-t-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Buscando imóveis...</p>
          </div>
        )}

        {/* ERRO */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-6"></i>
            <p className="text-xl text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchImoveis(formValues)}
              className="px-8 py-3 bg-[#e6a400] text-white font-bold rounded-lg hover:bg-[#d29400] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                      finalidade="VENDA"
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
                  Não encontramos imóveis para compra com os filtros
                  selecionados.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3 bg-[#e6a400] text-white font-bold rounded-lg hover:bg-[#d29400] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
          neighborhoodOptions={neighborhoodOptions}
          cityOptions={cityOptions}
          propertyOptions={propertyOptions}
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
          neighborhoodOptions={neighborhoodOptions}
          cityOptions={cityOptions}
          propertyOptions={propertyOptions}
          bedroomOptions={bedroomOptions}
        />
      )}
    </div>
  );
};

export default ComprarImovel;
