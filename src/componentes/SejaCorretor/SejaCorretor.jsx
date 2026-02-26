import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const SejaCorretor = () => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    creci: "",
    whatsapp: "",
    email: "",
  });

  useEffect(() => {
    if (formRef.current) {
      const newFormData = new FormData(formRef.current);
      setFormData({
        name: newFormData.get("name") || "",
        creci: newFormData.get("creci") || "",
        whatsapp: newFormData.get("whatsapp") || "",
        email: newFormData.get("email") || "",
      });
    }
  }, []);

  const formatWhatsApp = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, "($1");
    }

    e.target.value = value;

    setFormData((prev) => ({
      ...prev,
      whatsapp: value,
    }));

    if (value.length > 0) {
      validateField("whatsapp", value.replace(/\D/g, ""));
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Nome completo é obrigatório";
        } else if (value.trim().length < 3) {
          newErrors.name = "Nome deve ter pelo menos 3 caracteres";
        } else {
          delete newErrors.name;
        }
        break;

      case "creci":
        if (!value.trim()) {
          newErrors.creci = "CRECI é obrigatório";
        } else {
          delete newErrors.creci;
        }
        break;

      case "whatsapp":
        const whatsappClean = value.replace(/\D/g, "");
        if (!whatsappClean) {
          newErrors.whatsapp = "WhatsApp é obrigatório";
        } else if (whatsappClean.length < 10 || whatsappClean.length > 11) {
          newErrors.whatsapp = "WhatsApp inválido (ex: 99 99999-9999)";
        } else {
          delete newErrors.whatsapp;
        }
        break;

      case "email":
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "E-mail inválido";
        } else {
          delete newErrors.email;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const isFormValid = () => {
    if (!formData.name?.trim()) return false;
    if (!formData.creci?.trim()) return false;
    if (!formData.whatsapp?.trim()) return false;

    const whatsappClean = formData.whatsapp.replace(/\D/g, "");
    if (whatsappClean.length < 10 || whatsappClean.length > 11) return false;

    if (formData.name.trim().length < 3) return false;

    if (
      formData.email?.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      return false;
    }

    return Object.keys(errors).length === 0;
  };

  const salvarNoSupabase = async (dados) => {
    try {
      console.log("📤 Enviando dados:", dados);

      const { data, error } = await supabase.from("corretores").insert([
        {
          nome: dados.name,
          creci: dados.creci,
          telefone: dados.whatsapp,
          email: dados.email || null,
          etapa: "pendentes",
          checkpoints_treinamento: {
            modulo1: false,
            modulo2: false,
            modulo3: false,
            modulo4: false,
            modulo5: false,
          },
          atributos_treinamento: {
            demonstrouInteresse: false,
            temProposito: false,
            conheceMercado: false,
            disponibilidadeHorario: false,
            veiculoProprio: false,
            experienciaVendas: false,
            comunicacao: false,
            eticaProfissional: false,
            trabalhoEquipe: false,
            metasAmbiciosas: false,
          },
          progresso_treinamento: 0,
        },
      ]);

      if (error) {
        console.error("❌ Erro:", error);
        throw error;
      }

      console.log("✅ Sucesso!", data);
      return data;
    } catch (error) {
      console.error("💥 Erro:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setTouched({
        name: true,
        creci: true,
        whatsapp: true,
        email: true,
      });

      validateField("name", formData.name);
      validateField("creci", formData.creci);
      validateField("whatsapp", formData.whatsapp);
      if (formData.email) validateField("email", formData.email);

      return;
    }

    setIsSubmitting(true);

    try {
      const resultado = await salvarNoSupabase({
        name: formData.name?.trim() || "",
        creci: formData.creci?.trim() || "",
        whatsapp: formData.whatsapp?.trim() || "",
        email: formData.email?.trim() || "",
      });

      console.log("✅ Cadastro realizado:", resultado);

      setFormData({
        name: "",
        creci: "",
        whatsapp: "",
        email: "",
      });
      setErrors({});
      setTouched({});
      setSubmitSuccess(true);

      if (formRef.current) {
        formRef.current.reset();
      }

      alert("Cadastro realizado com sucesso!");

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      alert("Erro ao enviar cadastro. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-[#D4A24D]">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/20 mix-blend-overlay blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-white/20 mix-blend-overlay blur-3xl opacity-30" />
      </div>

      {/* AZUL DA PALETA NA PARTE INFERIOR */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(49, 54, 62, 0.5) 0%, rgba(49, 54, 62, 0.3) 20%, rgba(49, 54, 62, 0.15) 40%, rgba(49, 54, 62, 0.05) 60%, transparent 80%)",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="relative inline-block mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            Seja um Corretor Adventus
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 md:w-48 h-1 bg-gradient-to-r from-white to-white rounded-full" />
          </h2>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/90 font-light">
            Cadastre-se e faça parte da nossa equipe de parceiros
          </p>
        </div>

        {/* Card do formulário - LIMPO e GORDINHO */}
        <div className="mx-auto max-w-xl md:max-w-2xl lg:max-w-3xl">
          {/* Card principal - sem bordas decorativas */}
          <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl shadow-black/20">
            {/* Mensagem de sucesso */}
            {submitSuccess && (
              <div className="mb-8 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-700 text-center">
                ✓ Cadastro realizado com sucesso! Entraremos em contato em
                breve.
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 md:space-y-8"
              noValidate
            >
              {/* Grid dos campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A24D] z-10">
                      <i className="fas fa-user text-lg" />
                    </div>
                    <input
                      type="text"
                      id="brokerName"
                      name="name"
                      autoComplete="name"
                      aria-label="Nome completo"
                      aria-required="true"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={
                        touched.name && errors.name ? "name-error" : undefined
                      }
                      value={formData.name}
                      className={`w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                        touched.name && errors.name
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/30"
                      }`}
                      placeholder="Nome completo *"
                      required
                      minLength="3"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p
                      id="name-error"
                      className="text-sm text-red-500 flex items-center gap-1.5 pl-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Campo CRECI */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A24D] z-10">
                      <i className="fas fa-id-card text-lg" />
                    </div>
                    <input
                      type="text"
                      id="brokerCreci"
                      name="creci"
                      autoComplete="off"
                      aria-label="Número do CRECI"
                      aria-required="true"
                      aria-invalid={touched.creci && !!errors.creci}
                      aria-describedby={
                        touched.creci && errors.creci
                          ? "creci-error"
                          : undefined
                      }
                      value={formData.creci}
                      className={`w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                        touched.creci && errors.creci
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/30"
                      }`}
                      placeholder="Número do CRECI *"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.creci && errors.creci && (
                    <p
                      id="creci-error"
                      className="text-sm text-red-500 flex items-center gap-1.5 pl-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs" />
                      {errors.creci}
                    </p>
                  )}
                </div>

                {/* Campo WhatsApp */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A24D] z-10">
                      <i className="fab fa-whatsapp text-lg" />
                    </div>
                    <input
                      type="tel"
                      id="brokerWhatsApp"
                      name="whatsapp"
                      autoComplete="tel"
                      inputMode="numeric"
                      aria-label="WhatsApp com DDD"
                      aria-required="true"
                      aria-invalid={touched.whatsapp && !!errors.whatsapp}
                      aria-describedby={
                        touched.whatsapp && errors.whatsapp
                          ? "whatsapp-error"
                          : undefined
                      }
                      value={formData.whatsapp}
                      className={`w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                        touched.whatsapp && errors.whatsapp
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/30"
                      }`}
                      placeholder="WhatsApp com DDD *"
                      required
                      onChange={(e) => {
                        formatWhatsApp(e);
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.whatsapp && errors.whatsapp && (
                    <p
                      id="whatsapp-error"
                      className="text-sm text-red-500 flex items-center gap-1.5 pl-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs" />
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                {/* Campo Email */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A24D] z-10">
                      <i className="fas fa-envelope text-lg" />
                    </div>
                    <input
                      type="email"
                      id="brokerEmail"
                      name="email"
                      autoComplete="email"
                      aria-label="E-mail"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={
                        touched.email && errors.email
                          ? "email-error"
                          : undefined
                      }
                      value={formData.email}
                      className={`w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                        touched.email && errors.email
                          ? "border-red-400 focus:border-red-400"
                          : "border-gray-200 focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/30"
                      }`}
                      placeholder="E-mail (opcional)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-500 flex items-center gap-1.5 pl-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Botão de envio */}
              <div className="pt-4 md:pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className={`relative w-full h-14 px-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden text-white shadow-lg ${
                    !isFormValid() && !isSubmitting
                      ? "bg-[#D4A24D]/50 cursor-not-allowed shadow-none hover:scale-100"
                      : "bg-[#D4A24D] shadow-[#D4A24D]/30 hover:shadow-xl hover:shadow-[#D4A24D]/40 hover:scale-[1.02] active:scale-100"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="font-bold">ENVIAR CADASTRO</span>
                      <i className="fas fa-paper-plane" />
                    </span>
                  )}
                </button>

                {/* Mensagem de segurança */}
                <p className="mt-6 text-center text-sm text-black/70 flex items-center justify-center gap-2">
                  <i className="fas fa-lock text-black/50" />
                  <span>
                    Seus dados estão seguros conosco. Entraremos em contato em
                    até 24h.
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SejaCorretor;
