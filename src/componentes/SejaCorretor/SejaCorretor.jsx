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
          delete newErrors.creci; // Aceita qualquer formato
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

  const salvarNoSupabase = async (dados) => {
    try {
      console.log("📤 Enviando dados:", dados);

      const { data, error } = await supabase.from("corretores").insert([
        {
          nome: dados.name,
          creci: dados.creci,
          telefone: dados.whatsapp,
          email: dados.email || null,
          etapa: "pendentes", // 👈 AGORA EXISTE!
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

    setIsSubmitting(true);

    try {
      // ✅ SOMENTE salvar no Supabase
      const resultado = await salvarNoSupabase({
        name: formData.name?.trim() || "",
        creci: formData.creci?.trim() || "",
        whatsapp: formData.whatsapp?.trim() || "",
        email: formData.email?.trim() || "",
      });

      console.log("✅ Cadastro realizado:", resultado);

      // ✅ Resetar formulário
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

      // ✅ Mensagem de sucesso (opcional)
      alert("Cadastro realizado com sucesso!");

      // ✅ Esconder mensagem de sucesso após 5 segundos
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

  const canSubmit = () => {
    // SÓ VERIFICA SE TEM CONTEÚDO NOS CAMPOS OBRIGATÓRIOS
    if (!formData.name) return false;
    if (!formData.creci) return false;
    if (!formData.whatsapp) return false;

    return true;
  };

  return (
    <section className="partner-broker-section py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0c4a6e]"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          }}
        ></div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/20 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#fbbf24] via-white to-[#60a5fa] bg-clip-text text-transparent inline-block relative">
            Seja um Corretor Adventus
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-1 bg-gradient-to-r from-[#fbbf24] to-[#60a5fa] rounded-full"></span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
            Cadastre-se e faça parte da nossa equipe de parceiros
          </p>
        </div>

        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <div className="broker-form-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-black/40">
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fbbf24, #60a5fa, transparent)",
              }}
            ></div>

            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-[#fbbf24] to-[#60a5fa] blur-sm opacity-50"></div>

            <h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-4 md:mb-6">
              Formulário de Cadastro
            </h3>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-center">
                ✓ Cadastro realizado com sucesso! Entraremos em contato em
                breve.
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-3 md:space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <div className="relative broker-input-container">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fbbf24] z-10 broker-input-icon">
                      <i className="fas fa-user text-lg"></i>
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
                      className={`broker-input w-full pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                        touched.name && errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/20 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20"
                      }`}
                      style={{ height: "56px" }}
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
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative broker-input-container">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fbbf24] z-10 broker-input-icon">
                      <i className="fas fa-id-card text-lg"></i>
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
                      className={`broker-input w-full pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                        touched.creci && errors.creci
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/20 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20"
                      }`}
                      style={{ height: "56px" }}
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
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.creci}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative broker-input-container">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fbbf24] z-10 broker-input-icon">
                      <i className="fab fa-whatsapp text-lg"></i>
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
                      className={`broker-input w-full pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                        touched.whatsapp && errors.whatsapp
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/20 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20"
                      }`}
                      style={{ height: "56px" }}
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
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative broker-input-container">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fbbf24] z-10 broker-input-icon">
                      <i className="fas fa-envelope text-lg"></i>
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
                      className={`broker-input w-full pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                        touched.email && errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/20 focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20"
                      }`}
                      style={{ height: "56px" }}
                      placeholder="E-mail (opcional)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p
                      id="email-error"
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting} // SÓ desabilita enquanto está enviando
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-[#f59e0b]/30"
                  style={{
                    height: "56px",
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? "wait" : "pointer",
                  }}
                >
                  {isSubmitting ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-white font-bold">
                        ENVIAR CADASTRO
                      </span>
                      <i className="fas fa-paper-plane text-white"></i>
                    </span>
                  )}
                </button>

                <p className="text-center text-white/50 text-sm mt-4 flex items-center justify-center gap-2">
                  <i className="fas fa-lock"></i>
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
