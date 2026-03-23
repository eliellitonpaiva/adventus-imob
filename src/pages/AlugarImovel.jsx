import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import CardImovel from "../componentes/CardImovel/CardImovel";
import ReactDOM from "react-dom";

// ===========================================
// FUNÇÕES AUXILIARES PARA CONVERSÃO DE FILTROS
// ===========================================
const getPriceRangeValues = (priceRangeId) => {
  switch (priceRangeId) {
    // Valores para COMPRA (já existentes)
    case "ate-170k":
      return { min: 0, max: 170000 };
    case "170k-350k":
      return { min: 170000, max: 350000 };
    case "350k-500k":
      return { min: 350000, max: 500000 };
    case "500k-700k":
      return { min: 500000, max: 700000 };
    case "700k-1m":
      return { min: 700000, max: 1000000 };
    case "acima-1m":
      return { min: 1000000, max: null };

    // Valores para ALUGUEL
    case "ate-600":
      return { min: 0, max: 600 };
    case "600-1000":
      return { min: 600, max: 1000 };
    case "1000-1500":
      return { min: 1000, max: 1500 };
    case "1500-2000":
      return { min: 1500, max: 2000 };
    case "2000-2500":
      return { min: 2000, max: 2500 };
    case "2500-3000":
      return { min: 2500, max: 3000 };
    case "3000-3500":
      return { min: 3000, max: 3500 };
    case "3500-4000":
      return { min: 3500, max: 4000 };
    case "4000-5000":
      return { min: 4000, max: 5000 };
    case "5000-7000":
      return { min: 5000, max: 7000 };
    case "7000-10000":
      return { min: 7000, max: 10000 };
    case "acima-10000":
      return { min: 10000, max: null };
    case "acima-15000":
      return { min: 15000, max: null };
    default:
      return { min: null, max: null };
  }
};

const parseNumericValue = (value) => {
  if (!value || value === "") return null;
  return parseInt(value.replace("+", "")) || null;
};

// ===========================================
// BOTTOM SHEET (MOBILE)
// ===========================================
const BottomSheet = React.memo(
  ({
    show,
    onClose,
    formValues,
    onInputChange,
    onClearFilters,
    onSearch,
    priceRangeOptions,
    garageOptions,
    suiteOptions,
    bathroomOptions,
    bedroomOptions,
    cityOptions,
    propertyOptions,
    bairros,
    bairrosFiltrados,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);

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

    if (!show) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 bg-black/50 z-[999999] flex justify-center items-end md:hidden"
        onClick={closeSheet}
      >
        <div
          ref={contentRef}
          className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b border-gray-100 z-10">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Mais filtros</h3>
              <button
                onClick={closeSheet}
                className="p-2 bg-[#D4A24D] text-white rounded-full hover:bg-[#c0903d] transition-colors shadow-sm"
              >
                <i className="fas fa-times text-white text-sm" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* GRID 2 COLUNAS PARA OS PRIMEIROS CAMPOS */}
            <div className="grid grid-cols-2 gap-3">
              {/* CIDADE */}
              <div
                className="relative col-span-1"
                ref={localDropdownOpen === "cityMobile" ? dropdownRef : null}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("cityMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "cityMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-map-marker-alt mr-2 text-sm ${formValues.cityId ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.cityId ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.cityId
                      ? cityOptions.find((o) => o.id === formValues.cityId)
                          ?.label
                      : "Cidade"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "cityMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "cityMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cityOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("cityId", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.cityId === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.cityId === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.cityId === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TIPO */}
              <div
                className="relative col-span-1"
                ref={
                  localDropdownOpen === "propertyTypeMobile"
                    ? dropdownRef
                    : null
                }
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("propertyTypeMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "propertyTypeMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-building mr-2 text-sm ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.propertyType ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.propertyType
                      ? propertyOptions.find(
                          (o) => o.id === formValues.propertyType,
                        )?.label
                      : "Tipo"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "propertyTypeMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "propertyTypeMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {propertyOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("propertyType", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.propertyType === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.propertyType === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.propertyType === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* BAIRRO - LINHA INTEIRA */}
            <div className="mt-3">
              <div
                className="relative"
                ref={
                  localDropdownOpen === "neighborhoodMobile"
                    ? dropdownRef
                    : null
                }
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("neighborhoodMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "neighborhoodMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm ${!formValues.cityId ? "opacity-50" : ""}`}
                >
                  <i
                    className={`fas fa-map-pin mr-2 text-sm ${formValues.neighborhood ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.neighborhood ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.neighborhood
                      ? bairros.find((b) => b.id === formValues.neighborhood)
                          ?.nome
                      : "Bairro"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "neighborhoodMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "neighborhoodMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bairrosFiltrados.length > 0 ? (
                      bairrosFiltrados.map((bairro) => (
                        <div
                          key={bairro.id}
                          onClick={(e) =>
                            selectOption("neighborhood", bairro.id, e)
                          }
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            formValues.neighborhood === bairro.id
                              ? "bg-[#D4A24D]/5"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${formValues.neighborhood === bairro.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
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
                        {!formValues.cityId
                          ? "Selecione uma cidade primeiro"
                          : "Nenhum bairro cadastrado para esta cidade"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* LINHA DIVISÓRIA */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* FAIXA DE PREÇO - LINHA INTEIRA */}
            <div
              className="relative"
              ref={
                localDropdownOpen === "priceRangeMobile" ? dropdownRef : null
              }
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("priceRangeMobile", e);
                }}
                className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                  localDropdownOpen === "priceRangeMobile"
                    ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                    : "border-gray-200 hover:border-gray-300"
                } rounded-xl cursor-pointer transition-all shadow-sm`}
              >
                <i
                  className={`fas fa-tag mr-2 text-sm ${formValues.priceRange ? "text-[#D4A24D]" : "text-gray-400"}`}
                />
                <span
                  className={`flex-1 text-sm font-semibold truncate ${formValues.priceRange ? "text-gray-800" : "text-gray-400"}`}
                >
                  {formValues.priceRange
                    ? priceRangeOptions.find(
                        (o) => o.id === formValues.priceRange,
                      )?.label
                    : "Faixa de preço"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "priceRangeMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "priceRangeMobile" && (
                <div
                  className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  {priceRangeOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={(e) => selectOption("priceRange", opt.id, e)}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                        formValues.priceRange === opt.id ? "bg-[#D4A24D]/5" : ""
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${formValues.priceRange === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                      >
                        {opt.label}
                      </span>
                      {formValues.priceRange === opt.id && (
                        <i className="fas fa-check text-[#D4A24D] text-sm" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GRID 2 COLUNAS PARA CARACTERÍSTICAS */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* VAGAS */}
              <div
                className="relative col-span-1"
                ref={localDropdownOpen === "garageMobile" ? dropdownRef : null}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("garageMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "garageMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-car mr-2 text-sm ${formValues.garage ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.garage ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.garage
                      ? garageOptions.find((o) => o.id === formValues.garage)
                          ?.label
                      : "Vagas"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "garageMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "garageMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {garageOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("garage", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.garage === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.garage === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.garage === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUÍTES */}
              <div
                className="relative col-span-1"
                ref={localDropdownOpen === "suiteMobile" ? dropdownRef : null}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("suiteMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "suiteMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-crown mr-2 text-sm ${formValues.suite ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.suite ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.suite
                      ? suiteOptions.find((o) => o.id === formValues.suite)
                          ?.label
                      : "Suítes"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "suiteMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "suiteMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {suiteOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("suite", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.suite === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.suite === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.suite === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BANHEIROS */}
              <div
                className="relative col-span-1"
                ref={
                  localDropdownOpen === "bathroomsMobile" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bathroomsMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "bathroomsMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-bath mr-2 text-sm ${formValues.bathrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.bathrooms ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.bathrooms
                      ? bathroomOptions.find(
                          (o) => o.id === formValues.bathrooms,
                        )?.label
                      : "Banheiros"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bathroomsMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "bathroomsMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bathroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bathrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.bathrooms === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.bathrooms === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.bathrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DORMITÓRIOS */}
              <div
                className="relative col-span-1"
                ref={
                  localDropdownOpen === "bedroomsMobile" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("bedroomsMobile", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-3 bg-white border ${
                    localDropdownOpen === "bedroomsMobile"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-bed mr-2 text-sm ${formValues.bedrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.bedrooms ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.bedrooms
                      ? bedroomOptions.find((o) => o.id === formValues.bedrooms)
                          ?.label
                      : "Dormitórios"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bedroomsMobile" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "bedroomsMobile" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bedroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("bedrooms", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.bedrooms === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.bedrooms === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
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
            </div>

            {/* BOTÕES */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClearFilters}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => {
                  closeSheet();
                  onSearch();
                }}
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
// MODAL DESKTOP
// ===========================================
const DesktopModal = React.memo(
  ({
    show,
    onClose,
    formValues,
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
            <div className="space-y-4">
              {/* FAIXA DE PREÇO - LINHA INTEIRA */}
              <div
                className="relative"
                ref={
                  localDropdownOpen === "priceRangeDesktop" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("priceRangeDesktop", e);
                  }}
                  className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                    localDropdownOpen === "priceRangeDesktop"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200 hover:border-gray-300"
                  } rounded-xl cursor-pointer transition-all shadow-sm`}
                >
                  <i
                    className={`fas fa-tag mr-3 text-sm ${formValues.priceRange ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-semibold truncate ${formValues.priceRange ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.priceRange
                      ? priceRangeOptions.find(
                          (o) => o.id === formValues.priceRange,
                        )?.label
                      : "Faixa de preço"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "priceRangeDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "priceRangeDesktop" && (
                  <div
                    className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {priceRangeOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => selectOption("priceRange", opt.id, e)}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                          formValues.priceRange === opt.id
                            ? "bg-[#D4A24D]/5"
                            : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${formValues.priceRange === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                        >
                          {opt.label}
                        </span>
                        {formValues.priceRange === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GRID 2 COLUNAS PARA CARACTERÍSTICAS */}
              <div className="grid grid-cols-2 gap-4">
                {/* VAGAS */}
                <div
                  className="relative"
                  ref={
                    localDropdownOpen === "garageDesktop" ? dropdownRef : null
                  }
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("garageDesktop", e);
                    }}
                    className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                      localDropdownOpen === "garageDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm`}
                  >
                    <i
                      className={`fas fa-car mr-3 text-sm ${formValues.garage ? "text-[#D4A24D]" : "text-gray-400"}`}
                    />
                    <span
                      className={`flex-1 text-sm font-semibold truncate ${formValues.garage ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {formValues.garage
                        ? garageOptions.find((o) => o.id === formValues.garage)
                            ?.label
                        : "Vagas"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "garageDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>

                  {localDropdownOpen === "garageDesktop" && (
                    <div
                      className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {garageOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => selectOption("garage", opt.id, e)}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            formValues.garage === opt.id ? "bg-[#D4A24D]/5" : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${formValues.garage === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                          >
                            {opt.label}
                          </span>
                          {formValues.garage === opt.id && (
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
                  ref={
                    localDropdownOpen === "suiteDesktop" ? dropdownRef : null
                  }
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("suiteDesktop", e);
                    }}
                    className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                      localDropdownOpen === "suiteDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm`}
                  >
                    <i
                      className={`fas fa-crown mr-3 text-sm ${formValues.suite ? "text-[#D4A24D]" : "text-gray-400"}`}
                    />
                    <span
                      className={`flex-1 text-sm font-semibold truncate ${formValues.suite ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {formValues.suite
                        ? suiteOptions.find((o) => o.id === formValues.suite)
                            ?.label
                        : "Suítes"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "suiteDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>

                  {localDropdownOpen === "suiteDesktop" && (
                    <div
                      className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {suiteOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => selectOption("suite", opt.id, e)}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            formValues.suite === opt.id ? "bg-[#D4A24D]/5" : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${formValues.suite === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                          >
                            {opt.label}
                          </span>
                          {formValues.suite === opt.id && (
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
                    localDropdownOpen === "bathroomsDesktop"
                      ? dropdownRef
                      : null
                  }
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("bathroomsDesktop", e);
                    }}
                    className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                      localDropdownOpen === "bathroomsDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm`}
                  >
                    <i
                      className={`fas fa-bath mr-3 text-sm ${formValues.bathrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                    />
                    <span
                      className={`flex-1 text-sm font-semibold truncate ${formValues.bathrooms ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {formValues.bathrooms
                        ? bathroomOptions.find(
                            (o) => o.id === formValues.bathrooms,
                          )?.label
                        : "Banheiros"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bathroomsDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>

                  {localDropdownOpen === "bathroomsDesktop" && (
                    <div
                      className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {bathroomOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => selectOption("bathrooms", opt.id, e)}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            formValues.bathrooms === opt.id
                              ? "bg-[#D4A24D]/5"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${formValues.bathrooms === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
                          >
                            {opt.label}
                          </span>
                          {formValues.bathrooms === opt.id && (
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
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown("bedroomsDesktop", e);
                    }}
                    className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                      localDropdownOpen === "bedroomsDesktop"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } rounded-xl cursor-pointer transition-all shadow-sm`}
                  >
                    <i
                      className={`fas fa-bed mr-3 text-sm ${formValues.bedrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                    />
                    <span
                      className={`flex-1 text-sm font-semibold truncate ${formValues.bedrooms ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {formValues.bedrooms
                        ? bedroomOptions.find(
                            (o) => o.id === formValues.bedrooms,
                          )?.label
                        : "Dormitórios"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bedroomsDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>

                  {localDropdownOpen === "bedroomsDesktop" && (
                    <div
                      className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {bedroomOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => selectOption("bedrooms", opt.id, e)}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 ${
                            formValues.bedrooms === opt.id
                              ? "bg-[#D4A24D]/5"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${formValues.bedrooms === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
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
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClearFilters}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  onSearch();
                }}
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

  // Estados para cidades e bairros
  const [bairros, setBairros] = useState([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Filtros ativos - AGORA COM cityId, cityName, cityUf
  const [formValues, setFormValues] = useState({
    cityId: "",
    cityName: "",
    cityUf: "",
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
    { id: "ate-600", label: "Até R$ 600" },
    { id: "600-1000", label: "R$ 600 - R$ 1.000" },
    { id: "1000-1500", label: "R$ 1.000 - R$ 1.500" },
    { id: "1500-2000", label: "R$ 1.500 - R$ 2.000" },
    { id: "2000-2500", label: "R$ 2.000 - R$ 2.500" },
    { id: "2500-3000", label: "R$ 2.500 - R$ 3.000" },
    { id: "3000-3500", label: "R$ 3.000 - R$ 3.500" },
    { id: "3500-4000", label: "R$ 3.500 - R$ 4.000" },
    { id: "4000-5000", label: "R$ 4.000 - R$ 5.000" },
    { id: "5000-7000", label: "R$ 5.000 - R$ 7.000" },
    { id: "7000-10000", label: "R$ 7.000 - R$ 10.000" },
    { id: "acima-10000", label: "Acima de R$ 10.000" },
    { id: "acima-15000", label: "Acima de R$ 15.000" },
  ];

  // Refs
  const cityRef = useRef(null);
  const propertyRef = useRef(null);
  const neighborhoodRef = useRef(null);

  // ===========================================
  // 🔥 CARREGAR CIDADES ATIVAS DO BANCO
  // ===========================================
  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const { data, error } = await supabase
          .from("cidades")
          .select("id, nome, uf, cidade_estado")
          .eq("ativo", true)
          .order("nome");

        if (error) throw error;

        const options = data.map((cidade) => ({
          id: cidade.id,
          label: cidade.nome,
          uf: cidade.uf,
          cidade_estado: cidade.cidade_estado || `${cidade.nome}, ${cidade.uf}`,
        }));

        setCityOptions(options);
      } catch (err) {
        console.error("Erro ao carregar cidades:", err);
      }
    };

    fetchCidades();
  }, []);

  // ===========================================
  // 🔥 CARREGAR BAIRROS DO BANCO
  // ===========================================
  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const { data, error } = await supabase
          .from("bairros")
          .select("id, nome, cidade_id")
          .order("nome");

        if (error) throw error;
        setBairros(data || []);
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
      }
    };

    fetchBairros();
  }, []);

  // 🔥 FILTRAR BAIRROS POR CIDADE SELECIONADA (usando cityId)
  useEffect(() => {
    if (formValues.cityId && formValues.cityId !== "") {
      const filtrados = bairros.filter(
        (bairro) => bairro.cidade_id === formValues.cityId,
      );
      setBairrosFiltrados(filtrados);
    } else {
      setBairrosFiltrados([]);
    }
  }, [formValues.cityId, bairros]);

  // Efeito para carregar filtros iniciais
  useEffect(() => {
    const loadFiltersFromStorage = () => {
      try {
        const savedFilters = localStorage.getItem("hero_filters");
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);
          if (parsed.tipo === "alugar") {
            const heroFilters = {
              cityId: parsed.cityId || "",
              cityName: parsed.cityName || "",
              cityUf: parsed.cityUf || "",
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
    if (bairros.length > 0 && cityOptions.length > 0) {
      fetchImoveis(savedFilters || formValues);
    }
  }, [bairros, cityOptions]);

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
      // CONVERTER VALORES DOS FILTROS
      const priceValues = getPriceRangeValues(filtros.priceRange);
      const bedroomsValue = parseNumericValue(filtros.bedrooms);
      const garageValue = parseNumericValue(filtros.garage);
      const bathroomsValue = parseNumericValue(filtros.bathrooms);
      const suiteValue = parseNumericValue(filtros.suite);

      // Buscar cidade pelo ID para pegar o nome
      let cidadeNome = null;
      if (filtros.cityId) {
        const cidadeEncontrada = cityOptions.find(
          (c) => c.id === filtros.cityId,
        );
        if (cidadeEncontrada) {
          cidadeNome = cidadeEncontrada.label;
        }
      }

      // Buscar bairro pelo ID para pegar o nome
      let bairroNome = null;
      if (filtros.neighborhood) {
        const bairroEncontrado = bairros.find(
          (b) => b.id === filtros.neighborhood,
        );
        if (bairroEncontrado) {
          bairroNome = bairroEncontrado.nome;
        }
      }

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

      // Aplicar filtros adicionais - usando nome da cidade (campo texto)
      if (cidadeNome) {
        query = query.eq("cidade", cidadeNome);
      }

      if (filtros.propertyType) {
        const tipoObj = propertyOptions.find(
          (t) => t.id === filtros.propertyType,
        );
        if (tipoObj) {
          query = query.eq("tipo", tipoObj.label.toLowerCase());
        }
      }

      // FILTRO POR BAIRRO - usando nome do bairro (campo texto)
      if (bairroNome) {
        query = query.eq("bairro", bairroNome);
      }

      const { data: imoveisData, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      // Adicionar o preço de aluguel a cada imóvel
      let imoveisComPreco = (imoveisData || []).map((imovel) => ({
        ...imovel,
        preco: precosMap[imovel.id] || null,
      }));

      // 🔥 FILTROS NO FRONTEND

      // Filtrar por preço
      if (priceValues.min !== null) {
        imoveisComPreco = imoveisComPreco.filter(
          (imovel) => imovel.preco >= priceValues.min,
        );
      }
      if (priceValues.max !== null) {
        imoveisComPreco = imoveisComPreco.filter(
          (imovel) => imovel.preco <= priceValues.max,
        );
      }

      // Filtrar por dormitórios
      if (bedroomsValue !== null) {
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const valor = parseInt(
            imovel.caracteristicas?.dormitorios || imovel.quartos || "0",
          );
          return valor >= bedroomsValue;
        });
      }

      // Filtrar por vagas
      if (garageValue !== null) {
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const valor = parseInt(
            imovel.caracteristicas?.vagas || imovel.vagas || "0",
          );
          if (garageValue === 3) {
            return valor >= 3;
          } else {
            return valor === garageValue;
          }
        });
      }

      // Filtrar por banheiros
      if (bathroomsValue !== null) {
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const valor = parseInt(
            imovel.caracteristicas?.banheiros || imovel.banheiros || "0",
          );
          if (bathroomsValue === 3) {
            return valor >= 3;
          } else {
            return valor === bathroomsValue;
          }
        });
      }

      // Filtrar por suítes
      if (suiteValue !== null) {
        imoveisComPreco = imoveisComPreco.filter((imovel) => {
          const valor = parseInt(
            imovel.caracteristicas?.suites || imovel.suites || "0",
          );
          if (suiteValue === 3) {
            return valor >= 3;
          } else {
            return valor === suiteValue;
          }
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
    // Se for chamado sem evento (vindo do modal)
    if (!e || !e.preventDefault) {
      fetchImoveis(formValues);
      return;
    }

    // Se for chamado com evento (vindo do formulário)
    e.preventDefault();
    fetchImoveis(formValues);
  };

  const clearFilters = () => {
    setFormValues({
      cityId: "",
      cityName: "",
      cityUf: "",
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
                          className={`fas fa-map-marker-alt mr-2 text-sm ${formValues.cityId ? "text-[#D4A24D]" : "text-gray-400"}`}
                        />
                        <span
                          className={`flex-1 text-sm font-semibold truncate ${
                            formValues.cityId
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {formValues.cityId
                            ? cityOptions.find(
                                (opt) => opt.id === formValues.cityId,
                              )?.label
                            : formValues.cityName
                              ? `${formValues.cityName}${formValues.cityUf ? ` (${formValues.cityUf})` : ""}`
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
                              onClick={() => {
                                handleInputChange("cityId", opt.id);
                                handleInputChange("cityName", opt.label);
                                handleInputChange("cityUf", opt.uf);
                              }}
                              className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                                formValues.cityId === opt.id
                                  ? "bg-[#D4A24D]/5"
                                  : ""
                              }`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  formValues.cityId === opt.id
                                    ? "text-[#D4A24D] font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {opt.label}
                              </span>
                              {formValues.cityId === opt.id && (
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
                          !formValues.cityId
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
                            : !formValues.cityId
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
                                {!formValues.cityId
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
                      codigo={imovel.codigo}
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
          cityOptions={cityOptions}
          propertyOptions={propertyOptions}
          bairros={bairros}
          bairrosFiltrados={bairrosFiltrados}
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
