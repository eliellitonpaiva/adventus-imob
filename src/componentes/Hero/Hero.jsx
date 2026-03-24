import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ReactDOM from "react-dom";

const PRICE_RANGE_OPTIONS = {
  comprar: [
    { id: "ate-170k", label: "Até R$ 170 mil", min: 0, max: 170000 },
    {
      id: "170k-350k",
      label: "R$ 170 mil - R$ 350 mil",
      min: 170000,
      max: 350000,
    },
    {
      id: "350k-500k",
      label: "R$ 350 mil - R$ 500 mil",
      min: 350000,
      max: 500000,
    },
    {
      id: "500k-700k",
      label: "R$ 500 mil - R$ 700 mil",
      min: 500000,
      max: 700000,
    },
    {
      id: "700k-1m",
      label: "R$ 700 mil - R$ 1 milhão",
      min: 700000,
      max: 1000000,
    },
    { id: "acima-1m", label: "Acima de R$ 1 milhão", min: 1000000, max: null },
    { id: "acima-2m", label: "Acima de R$ 2 milhões", min: 2000000, max: null },
  ],
  alugar: [
    { id: "ate-600", label: "Até R$ 600", min: 0, max: 600 },
    { id: "600-1000", label: "R$ 600 - R$ 1.000", min: 600, max: 1000 },
    { id: "1000-1500", label: "R$ 1.000 - R$ 1.500", min: 1000, max: 1500 },
    { id: "1500-2000", label: "R$ 1.500 - R$ 2.000", min: 1500, max: 2000 },
    { id: "2000-2500", label: "R$ 2.000 - R$ 2.500", min: 2000, max: 2500 },
    { id: "2500-3000", label: "R$ 2.500 - R$ 3.000", min: 2500, max: 3000 },
    { id: "3000-3500", label: "R$ 3.000 - R$ 3.500", min: 3000, max: 3500 },
    { id: "3500-4000", label: "R$ 3.500 - R$ 4.000", min: 3500, max: 4000 },
    { id: "4000-5000", label: "R$ 4.000 - R$ 5.000", min: 4000, max: 5000 },
    { id: "5000-7000", label: "R$ 5.000 - R$ 7.000", min: 5000, max: 7000 },
    { id: "7000-10000", label: "R$ 7.000 - R$ 10.000", min: 7000, max: 10000 },
    { id: "acima-10000", label: "Acima de R$ 10.000", min: 10000, max: null },
    { id: "acima-15000", label: "Acima de R$ 15.000", min: 15000, max: null },
  ],
};

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
    activeTab,
  }) => {
    const contentRef = useRef(null);
    const [localDropdownOpen, setLocalDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);
    const isScrollingRef = useRef(false);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (isScrollingRef.current) return;
        if (!localDropdownOpen) return;

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setLocalDropdownOpen(null);
        }
      };

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [localDropdownOpen]);

    const closeSheet = () => {
      onClose();
      setLocalDropdownOpen(null);
    };

    const toggleDropdown = (dropdownName, e) => {
      e.stopPropagation();
      setLocalDropdownOpen((prev) =>
        prev === dropdownName ? null : dropdownName,
      );
    };

    const selectOption = (field, value) => {
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

          <div className="p-6 space-y-4">
            {/* Faixa de Preço */}
            <div
              className="relative"
              ref={localDropdownOpen === "priceRange" ? dropdownRef : null}
            >
              <div
                onClick={(e) => toggleDropdown("priceRange", e)}
                className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                  localDropdownOpen === "priceRange"
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
                    : activeTab === "comprar"
                      ? "Faixa de preço (compra)"
                      : "Faixa de preço (aluguel)"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "priceRange" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "priceRange" && (
                <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={() => {
                      isScrollingRef.current = false;
                    }}
                    onTouchMove={() => {
                      isScrollingRef.current = true;
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 100);
                    }}
                  >
                    {priceRangeOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption("priceRange", opt.id);
                        }}
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
                </div>
              )}
            </div>

            {/* Vagas */}
            <div
              className="relative"
              ref={localDropdownOpen === "garage" ? dropdownRef : null}
            >
              <div
                onClick={(e) => toggleDropdown("garage", e)}
                className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                  localDropdownOpen === "garage"
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
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "garage" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "garage" && (
                <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={() => {
                      isScrollingRef.current = false;
                    }}
                    onTouchMove={() => {
                      isScrollingRef.current = true;
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 100);
                    }}
                  >
                    {garageOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption("garage", opt.id);
                        }}
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
                </div>
              )}
            </div>

            {/* Suítes */}
            <div
              className="relative"
              ref={localDropdownOpen === "suite" ? dropdownRef : null}
            >
              <div
                onClick={(e) => toggleDropdown("suite", e)}
                className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                  localDropdownOpen === "suite"
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
                    ? suiteOptions.find((o) => o.id === formValues.suite)?.label
                    : "Suítes"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "suite" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "suite" && (
                <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={() => {
                      isScrollingRef.current = false;
                    }}
                    onTouchMove={() => {
                      isScrollingRef.current = true;
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 100);
                    }}
                  >
                    {suiteOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption("suite", opt.id);
                        }}
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
                </div>
              )}
            </div>

            {/* Banheiros */}
            <div
              className="relative"
              ref={localDropdownOpen === "bathrooms" ? dropdownRef : null}
            >
              <div
                onClick={(e) => toggleDropdown("bathrooms", e)}
                className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                  localDropdownOpen === "bathrooms"
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
                    ? bathroomOptions.find((o) => o.id === formValues.bathrooms)
                        ?.label
                    : "Banheiros"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bathrooms" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "bathrooms" && (
                <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={() => {
                      isScrollingRef.current = false;
                    }}
                    onTouchMove={() => {
                      isScrollingRef.current = true;
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 100);
                    }}
                  >
                    {bathroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption("bathrooms", opt.id);
                        }}
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
                </div>
              )}
            </div>

            {/* Dormitórios */}
            <div
              className="relative"
              ref={localDropdownOpen === "bedrooms" ? dropdownRef : null}
            >
              <div
                onClick={(e) => toggleDropdown("bedrooms", e)}
                className={`flex items-center w-full h-[56px] px-4 bg-white border ${
                  localDropdownOpen === "bedrooms"
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
                    ? bedroomOptions.find((o) => o.id === formValues.bedrooms)
                        ?.label
                    : "Dormitórios"}
                </span>
                <i
                  className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bedrooms" ? "rotate-180 text-[#D4A24D]" : ""}`}
                />
              </div>

              {localDropdownOpen === "bedrooms" && (
                <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={() => {
                      isScrollingRef.current = false;
                    }}
                    onTouchMove={() => {
                      isScrollingRef.current = true;
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 100);
                    }}
                  >
                    {bedroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption("bedrooms", opt.id);
                        }}
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
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 sticky bottom-0 bg-white pb-6 border-t border-gray-100">
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
    activeTab,
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
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [localDropdownOpen]);

    if (!show) return null;

    const closeModal = () => {
      onClose();
      setLocalDropdownOpen(null);
    };

    const toggleDropdown = (dropdownName, e) => {
      e.stopPropagation();
      setLocalDropdownOpen((prev) =>
        prev === dropdownName ? null : dropdownName,
      );
    };

    const selectOption = (field, value) => {
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
            <div className="grid grid-cols-2 gap-4">
              <div
                className="col-span-2 relative"
                ref={
                  localDropdownOpen === "priceRangeDesktop" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => toggleDropdown("priceRangeDesktop", e)}
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
                      : activeTab === "comprar"
                        ? "Faixa de preço (compra)"
                        : "Faixa de preço (aluguel)"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "priceRangeDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "priceRangeDesktop" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {priceRangeOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOption("priceRange", opt.id);
                          }}
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
                  </div>
                )}
              </div>

              <div
                className="relative"
                ref={localDropdownOpen === "garageDesktop" ? dropdownRef : null}
              >
                <div
                  onClick={(e) => toggleDropdown("garageDesktop", e)}
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
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {garageOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOption("garage", opt.id);
                          }}
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
                  </div>
                )}
              </div>

              <div
                className="relative"
                ref={localDropdownOpen === "suiteDesktop" ? dropdownRef : null}
              >
                <div
                  onClick={(e) => toggleDropdown("suiteDesktop", e)}
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
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {suiteOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOption("suite", opt.id);
                          }}
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
                  </div>
                )}
              </div>

              <div
                className="relative"
                ref={
                  localDropdownOpen === "bathroomsDesktop" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => toggleDropdown("bathroomsDesktop", e)}
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
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {bathroomOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOption("bathrooms", opt.id);
                          }}
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
                  </div>
                )}
              </div>

              <div
                className="relative"
                ref={
                  localDropdownOpen === "bedroomsDesktop" ? dropdownRef : null
                }
              >
                <div
                  onClick={(e) => toggleDropdown("bedroomsDesktop", e)}
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
                      ? bedroomOptions.find((o) => o.id === formValues.bedrooms)
                          ?.label
                      : "Dormitórios"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${localDropdownOpen === "bedroomsDesktop" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>

                {localDropdownOpen === "bedroomsDesktop" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {bedroomOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectOption("bedrooms", opt.id);
                          }}
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
                  </div>
                )}
              </div>
            </div>

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

const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comprar");
  const [touchStart, setTouchStart] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const isScrollingRef = useRef(false);

  const [buscaCidade, setBuscaCidade] = useState("");
  const [sugestoesCidades, setSugestoesCidades] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(true);

  const [imagemHero, setImagemHero] = useState({
    url: null,
    titulo: null,
    loading: true,
  });

  const [formValues, setFormValues] = useState({
    city: "",
    cityName: "",
    cityUf: "",
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

  const [bairros, setBairros] = useState([]);
  const [bairrosFiltrados, setBairrosFiltrados] = useState([]);

  const currentPriceOptions = PRICE_RANGE_OPTIONS[activeTab];

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

  const propertyRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const searchInputRef = useRef(null);
  const overflowRef = useRef(null);

  const fetchCidades = async () => {
    try {
      setLoadingCidades(true);
      const { data, error } = await supabase
        .from("cidades")
        .select("id, nome, uf, slug, cidade_estado")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;

      const cidadesFormatadas = data.map((cidade) => ({
        id: cidade.id,
        nome: cidade.nome,
        uf: cidade.uf,
        slug: cidade.slug,
        cidade_estado: cidade.cidade_estado || `${cidade.nome}, ${cidade.uf}`,
      }));

      setCidades(cidadesFormatadas || []);
    } catch (error) {
      console.error("❌ Erro ao buscar cidades:", error);
    } finally {
      setLoadingCidades(false);
    }
  };

  const buscarCidadesPorTexto = async (texto) => {
    if (!texto || texto.length < 2) {
      setSugestoesCidades([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cidades")
        .select("id, nome, uf, slug, cidade_estado")
        .eq("ativo", true)
        .ilike("cidade_estado", `%${texto}%`)
        .limit(10);

      if (error) throw error;

      const resultados = data.map((cidade) => ({
        id: cidade.id,
        nome: cidade.nome,
        uf: cidade.uf,
        slug: cidade.slug,
        cidade_estado: cidade.cidade_estado || `${cidade.nome}, ${cidade.uf}`,
      }));

      setSugestoesCidades(resultados);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      setSugestoesCidades([]);
    }
  };

  const handleBuscaCidadeChange = (e) => {
    const texto = e.target.value;
    setBuscaCidade(texto);
    buscarCidadesPorTexto(texto);
    setMostrarSugestoes(texto.length >= 2);
  };

  const selecionarCidade = (cidade) => {
    setBuscaCidade(cidade.cidade_estado);
    setFormValues((prev) => ({
      ...prev,
      city: cidade.id,
      cityName: cidade.nome,
      cityUf: cidade.uf,
    }));
    setMostrarSugestoes(false);
    setSugestoesCidades([]);
  };

  const limparCidadeSelecionada = () => {
    setBuscaCidade("");
    setFormValues((prev) => ({
      ...prev,
      city: "",
      cityName: "",
      cityUf: "",
    }));
    setSugestoesCidades([]);
    setMostrarSugestoes(false);
  };

  const buscarImagemHero = async () => {
    try {
      const hoje = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .eq("ativo", true)
        .lte("data_inicio", hoje)
        .gte("data_fim", hoje)
        .order("ordem")
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const imagem = data[0];
        const {
          data: { publicUrl },
        } = supabase.storage.from("hero").getPublicUrl(imagem.image_path);

        setImagemHero({
          url: publicUrl,
          titulo: imagem.titulo,
          loading: false,
        });
      } else {
        setImagemHero({
          url: null,
          titulo: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao buscar imagem do hero:", error);
      setImagemHero({ url: null, titulo: null, loading: false });
    }
  };

  useEffect(() => {
    buscarImagemHero();
    fetchCidades();
  }, []);

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const { data, error } = await supabase
          .from("bairros")
          .select("id, nome, cidade_id, cidades(nome, uf)")
          .order("nome");
        if (error) throw error;
        setBairros(data || []);
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
      }
    };
    fetchBairros();
  }, []);

  useEffect(() => {
    if (formValues.city && formValues.city !== "") {
      const filtrados = bairros.filter(
        (bairro) => bairro.cidade_id === formValues.city,
      );
      setBairrosFiltrados(filtrados);
    } else {
      setBairrosFiltrados([]);
    }
  }, [formValues.city, bairros]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isScrollingRef.current) return;

      if (!openDropdown && !mostrarSugestoes) return;

      const target = event.target;

      if (
        propertyRef.current?.contains(target) ||
        neighborhoodRef.current?.contains(target) ||
        searchInputRef.current?.contains(target)
      ) {
        return;
      }

      setOpenDropdown(null);
      setMostrarSugestoes(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown, mostrarSugestoes]);

  useEffect(() => {
    if (overflowRef.current === showMoreFilters) return;
    overflowRef.current = showMoreFilters;

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
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  // 🔥 CORREÇÃO CRÍTICA: toggleDropdown com evento e stopPropagation
  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleTouchStartSwipe = (e) =>
    setTouchStart(e.targetTouches[0].clientX);

  const handleTouchEndSwipe = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchEnd - touchStart;
    if (swipeDistance > 40) setActiveTab("alugar");
    else if (swipeDistance < -40) setActiveTab("comprar");
    setTouchStart(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormValues((prev) => ({ ...prev, priceRange: "" }));
  };

  const getPriceRangeValues = (priceRangeId) => {
    const found = currentPriceOptions.find((opt) => opt.id === priceRangeId);
    return found
      ? { min: found.min, max: found.max }
      : { min: null, max: null };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const priceValues = getPriceRangeValues(formValues.priceRange);

    const cidadeSelecionada = cidades.find((c) => c.id === formValues.city);

    const searchParams = {
      tipo: activeTab,
      cityId: formValues.city || "",
      cityName: cidadeSelecionada?.nome || formValues.cityName || "",
      cityUf: cidadeSelecionada?.uf || formValues.cityUf || "",
      propertyType: formValues.propertyType || "",
      bedrooms: formValues.bedrooms || "",
      minArea: formValues.minArea || "",
      maxArea: formValues.maxArea || "",
      neighborhood: formValues.neighborhood || "",
      garage: formValues.garage || "",
      suite: formValues.suite || "",
      bathrooms: formValues.bathrooms || "",
      priceRange: formValues.priceRange || "",
      priceMin: priceValues.min,
      priceMax: priceValues.max,
    };
    localStorage.setItem("hero_filters", JSON.stringify(searchParams));
    navigate(`/${activeTab}`);
  };

  const clearFilters = () => {
    setFormValues({
      city: "",
      cityName: "",
      cityUf: "",
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
    setBuscaCidade("");
    setSugestoesCidades([]);
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

      <div className="absolute top-0 left-0 w-full h-[400px] md:h-[700px] lg:h-[800px]">
        <img
          src={
            imagemHero.url ||
            "https://adventusimobiliaria.com.br/img/banner/image/20/Equipe.jpg"
          }
          alt="Hero"
          className="w-full h-full object-cover object-center transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#31363E]"></div>
      </div>

      {/* MOBILE */}
      <div className="relative top-[220px] md:hidden z-20 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="mb-3 md:mb-4 text-center px-4">
          <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-extrabold text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] tracking-tight leading-tight">
            {imagemHero.titulo || "Encontre seu lar ideal"}
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-none md:rounded-2xl p-6 md:p-7 lg:p-8 border border-white/20 shadow-md w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] md:static md:w-full md:max-w-6xl md:mx-auto">
          <div className="mb-6 w-full px-0 md:px-0">
            <div className="max-w-[280px] md:max-w-[300px] mx-auto lg:mx-0">
              <div
                onTouchStart={handleTouchStartSwipe}
                onTouchEnd={handleTouchEndSwipe}
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
                  onClick={() => handleTabChange("comprar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${activeTab === "comprar" ? "text-white" : "text-gray-300"}`}
                >
                  Comprar
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("alugar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${activeTab === "alugar" ? "text-white" : "text-gray-300"}`}
                >
                  Alugar
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-2 lg:gap-3">
              {/* Campo de Cidade */}
              <div
                className="relative w-full md:col-span-1"
                ref={searchInputRef}
              >
                <div className="flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <i
                    className={`fas fa-map-marker-alt mr-3 text-sm ${formValues.city ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <input
                    type="text"
                    value={buscaCidade}
                    onChange={handleBuscaCidadeChange}
                    placeholder={
                      loadingCidades
                        ? "Carregando cidades..."
                        : "Digite cidade e estado"
                    }
                    className="flex-1 text-sm md:text-base outline-none bg-transparent placeholder-gray-400"
                    disabled={loadingCidades}
                  />
                  {buscaCidade && (
                    <button
                      type="button"
                      onClick={limparCidadeSelecionada}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="fas fa-times text-sm" />
                    </button>
                  )}
                </div>

                {mostrarSugestoes && sugestoesCidades.length > 0 && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[1000] overflow-hidden animate-dropdown">
                    <div
                      className="max-h-[300px] overflow-y-auto custom-scrollbar"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-y",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={() => {
                        isScrollingRef.current = false;
                      }}
                      onTouchMove={() => {
                        isScrollingRef.current = true;
                      }}
                      onTouchEnd={() => {
                        setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 100);
                      }}
                    >
                      {sugestoesCidades.map((cidade) => (
                        <div
                          key={cidade.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selecionarCidade(cidade);
                          }}
                          className="px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-800">
                                {cidade.nome}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {cidade.uf}
                              </span>
                            </div>
                            <i className="fas fa-chevron-right text-gray-300 text-xs" />
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {cidade.cidade_estado}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tipo de Imóvel - CORRIGIDO */}
              <div className="relative w-full md:col-span-1" ref={propertyRef}>
                <div
                  onClick={(e) => toggleDropdown("propertyType", e)}
                  className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border ${openDropdown === "propertyType" ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20" : "border-gray-200 hover:border-gray-300"} rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-building mr-3 text-sm ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-semibold truncate ${formValues.propertyType ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.propertyType
                      ? propertyOptions.find(
                          (opt) => opt.id === formValues.propertyType,
                        )?.label
                      : "Tipo"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${openDropdown === "propertyType" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>
                {openDropdown === "propertyType" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div
                      className="max-h-[300px] overflow-y-auto custom-scrollbar"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-y",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={() => {
                        isScrollingRef.current = false;
                      }}
                      onTouchMove={() => {
                        isScrollingRef.current = true;
                      }}
                      onTouchEnd={() => {
                        setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 100);
                      }}
                    >
                      {propertyOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange("propertyType", opt.id);
                          }}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${formValues.propertyType === opt.id ? "bg-[#D4A24D]/5" : ""}`}
                        >
                          <span
                            className={`text-sm md:text-base font-medium ${formValues.propertyType === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
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

              {/* Bairro - CORRIGIDO */}
              <div
                className="relative w-full md:col-span-1"
                ref={neighborhoodRef}
              >
                <div
                  onClick={(e) => toggleDropdown("neighborhood", e)}
                  className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white border ${openDropdown === "neighborhood" ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20" : "border-gray-200 hover:border-gray-300"} rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${!formValues.city ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <i
                    className={`fas fa-map-pin mr-3 text-sm ${formValues.neighborhood ? "text-[#D4A24D]" : "text-gray-400"}`}
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-semibold truncate ${formValues.neighborhood ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formValues.neighborhood
                      ? bairros.find((b) => b.id === formValues.neighborhood)
                          ?.nome
                      : !formValues.city
                        ? "Selecione uma cidade"
                        : "Bairro"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${openDropdown === "neighborhood" ? "rotate-180 text-[#D4A24D]" : ""}`}
                  />
                </div>
                {openDropdown === "neighborhood" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-dropdown">
                    <div
                      className="max-h-[300px] overflow-y-auto custom-scrollbar"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-y",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={() => {
                        isScrollingRef.current = false;
                      }}
                      onTouchMove={() => {
                        isScrollingRef.current = true;
                      }}
                      onTouchEnd={() => {
                        setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 100);
                      }}
                    >
                      {bairrosFiltrados.length > 0 ? (
                        bairrosFiltrados.map((bairro) => (
                          <div
                            key={bairro.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputChange("neighborhood", bairro.id);
                            }}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${formValues.neighborhood === bairro.id ? "bg-[#D4A24D]/5" : ""}`}
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
                          {!formValues.city
                            ? "Selecione uma cidade primeiro"
                            : "Nenhum bairro cadastrado para esta cidade"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowMoreFilters(true)}
                className="w-full bg-white border-2 border-[#D4A24D] text-[#D4A24D] font-extrabold text-sm md:text-base rounded-xl h-[56px] md:h-[60px] flex items-center justify-center gap-2 hover:bg-[#D4A24D] hover:text-white transition-all shadow-lg active:scale-95 outline-none focus:outline-none md:col-span-1"
              >
                <i className="fas fa-sliders-h" />
                <span className="hidden sm:inline">MAIS FILTROS</span>
                <span className="sm:hidden">FILTROS</span>
              </button>

              <div className="md:hidden w-full mt-2">
                <button
                  type="submit"
                  className="w-full bg-[#D4A24D] text-white font-extrabold text-sm rounded-xl h-[56px] flex items-center justify-center gap-2 hover:bg-[#c0903d] transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
                >
                  <i className="fas fa-search" />
                  <span>BUSCAR</span>
                </button>
              </div>
            </div>

            <div className="hidden md:block mt-4">
              <button
                type="submit"
                className="w-full bg-[#D4A24D] text-white font-extrabold text-sm rounded-xl h-[56px] flex items-center justify-center gap-2 hover:bg-[#c0903d] transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
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

      {/* DESKTOP */}
      <div className="hidden md:block relative z-20 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="absolute top-[128px] left-[40px] w-[400px] lg:w-[450px]">
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 md:p-7 border border-white/30 shadow-2xl">
            <div className="mb-6 w-full flex justify-start">
              <div className="w-[200px] md:w-[220px]">
                <div
                  onTouchStart={handleTouchStartSwipe}
                  onTouchEnd={handleTouchEndSwipe}
                  className="relative bg-gray-900/95 rounded-full h-12 md:h-14 w-full p-1.5 flex items-center shadow-lg overflow-hidden cursor-pointer touch-pan-x"
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
                    onClick={() => handleTabChange("comprar")}
                    className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${activeTab === "comprar" ? "text-white" : "text-gray-300"}`}
                  >
                    Comprar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("alugar")}
                    className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none ${activeTab === "alugar" ? "text-white" : "text-gray-300"}`}
                  >
                    Alugar
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch}>
              <div className="flex flex-col space-y-3">
                <div className="relative w-full" ref={searchInputRef}>
                  <div className="flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <i
                      className={`fas fa-map-marker-alt mr-3 text-sm ${formValues.city ? "text-[#D4A24D]" : "text-gray-600"}`}
                    />
                    <input
                      type="text"
                      value={buscaCidade}
                      onChange={handleBuscaCidadeChange}
                      placeholder={
                        loadingCidades
                          ? "Carregando cidades..."
                          : "Digite cidade e estado"
                      }
                      className="flex-1 text-sm md:text-base outline-none bg-transparent placeholder-gray-500"
                      disabled={loadingCidades}
                    />
                    {buscaCidade && (
                      <button
                        type="button"
                        onClick={limparCidadeSelecionada}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <i className="fas fa-times text-sm" />
                      </button>
                    )}
                  </div>

                  {mostrarSugestoes && sugestoesCidades.length > 0 && (
                    <div className="absolute top-[105%] left-0 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {sugestoesCidades.map((cidade) => (
                          <div
                            key={cidade.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              selecionarCidade(cidade);
                            }}
                            className="px-4 py-3 hover:bg-[#D4A24D]/20 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-gray-800">
                                  {cidade.nome}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {cidade.uf}
                                </span>
                              </div>
                              <i className="fas fa-chevron-right text-gray-300 text-xs" />
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {cidade.cidade_estado}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tipo de Imóvel Desktop - CORRIGIDO */}
                <div className="relative w-full" ref={propertyRef}>
                  <div
                    onClick={(e) => toggleDropdown("propertyType", e)}
                    className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white/30 backdrop-blur-sm border ${
                      openDropdown === "propertyType"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-300 hover:border-gray-400"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                  >
                    <i
                      className={`fas fa-building mr-3 text-sm ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-600"}`}
                    />
                    <span
                      className={`flex-1 text-sm md:text-base font-semibold truncate ${formValues.propertyType ? "text-gray-800" : "text-gray-600"}`}
                    >
                      {formValues.propertyType
                        ? propertyOptions.find(
                            (opt) => opt.id === formValues.propertyType,
                          )?.label
                        : "Tipo"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-600 text-xs transition-all duration-300 ${openDropdown === "propertyType" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>
                  {openDropdown === "propertyType" && (
                    <div className="absolute top-[105%] left-0 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {propertyOptions.map((opt) => (
                          <div
                            key={opt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputChange("propertyType", opt.id);
                            }}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/20 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${formValues.propertyType === opt.id ? "bg-[#D4A24D]/10" : ""}`}
                          >
                            <span
                              className={`text-sm md:text-base font-medium ${formValues.propertyType === opt.id ? "text-[#D4A24D] font-semibold" : "text-gray-700"}`}
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

                {/* Bairro Desktop - CORRIGIDO */}
                <div className="relative w-full" ref={neighborhoodRef}>
                  <div
                    onClick={(e) => toggleDropdown("neighborhood", e)}
                    className={`flex items-center w-full h-[56px] md:h-[60px] px-4 bg-white/30 backdrop-blur-sm border ${
                      openDropdown === "neighborhood"
                        ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                        : "border-gray-300 hover:border-gray-400"
                    } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${!formValues.city ? "opacity-50" : ""}`}
                  >
                    <i
                      className={`fas fa-map-pin mr-3 text-sm ${formValues.neighborhood ? "text-[#D4A24D]" : "text-gray-600"}`}
                    />
                    <span
                      className={`flex-1 text-sm md:text-base font-semibold truncate ${formValues.neighborhood ? "text-gray-800" : "text-gray-600"}`}
                    >
                      {formValues.neighborhood
                        ? bairros.find((b) => b.id === formValues.neighborhood)
                            ?.nome
                        : !formValues.city
                          ? "Selecione uma cidade"
                          : "Bairro"}
                    </span>
                    <i
                      className={`fas fa-chevron-down text-gray-600 text-xs transition-all duration-300 ${openDropdown === "neighborhood" ? "rotate-180 text-[#D4A24D]" : ""}`}
                    />
                  </div>
                  {openDropdown === "neighborhood" && (
                    <div className="absolute top-[105%] left-0 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-[100] overflow-hidden animate-dropdown">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {bairrosFiltrados.length > 0 ? (
                          bairrosFiltrados.map((bairro) => (
                            <div
                              key={bairro.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange("neighborhood", bairro.id);
                              }}
                              className={`flex items-center justify-between px-4 py-3 hover:bg-[#D4A24D]/20 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${formValues.neighborhood === bairro.id ? "bg-[#D4A24D]/10" : ""}`}
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
                            {!formValues.city
                              ? "Selecione uma cidade primeiro"
                              : "Nenhum bairro cadastrado para esta cidade"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMoreFilters(true)}
                    className="flex-1 bg-white/30 backdrop-blur-sm border-2 border-gray-300 text-gray-700 font-extrabold text-sm md:text-base rounded-xl h-[56px] md:h-[60px] flex items-center justify-center gap-2 hover:bg-white/50 hover:border-gray-400 transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
                  >
                    <i className="fas fa-sliders-h" />
                    <span>MAIS FILTROS</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-[#D4A24D]/80 backdrop-blur-sm text-white font-extrabold text-sm rounded-xl h-[56px] md:h-[60px] flex items-center justify-center gap-2 hover:bg-[#D4A24D] transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
                  >
                    <i className="fas fa-search" />
                    <span>BUSCAR</span>
                  </button>
                </div>
              </div>

              <p className="text-sm md:text-base text-gray-700 text-center mt-6 flex items-center justify-center gap-2 font-light italic">
                <i className="fas fa-check-circle text-[#D4A24D]" />
                Mais de 500 imóveis disponíveis
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="h-[250px] md:h-[585px] lg:h-[685px]" />

      {showMoreFilters && (
        <BottomSheet
          show={showMoreFilters}
          onClose={() => setShowMoreFilters(false)}
          formValues={formValues}
          onInputChange={handleInputChange}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
          priceRangeOptions={currentPriceOptions}
          garageOptions={garageOptions}
          suiteOptions={suiteOptions}
          bathroomOptions={bathroomOptions}
          bedroomOptions={bedroomOptions}
          activeTab={activeTab}
        />
      )}

      {showMoreFilters && (
        <DesktopModal
          show={showMoreFilters}
          onClose={() => setShowMoreFilters(false)}
          formValues={formValues}
          onInputChange={handleInputChange}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
          priceRangeOptions={currentPriceOptions}
          garageOptions={garageOptions}
          suiteOptions={suiteOptions}
          bathroomOptions={bathroomOptions}
          bedroomOptions={bedroomOptions}
          activeTab={activeTab}
        />
      )}
    </section>
  );
};

export default Hero;
