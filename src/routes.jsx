import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./componentes/Layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";

// ========== Lazy loading (Público) ==========
const Home = lazy(() => import("./pages/Home"));
const ComprarImovel = lazy(() => import("./pages/ComprarImovel"));
const AlugarImovel = lazy(() => import("./pages/AlugarImovel"));
const DetalheImovel = lazy(() => import("./pages/DetalheImovel"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));

// ========== Admin ==========
const AdminLayout = lazy(() => import("./componentes/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Admin"));
const AdminImoveis = lazy(() => import("./pages/Admin/Imoveis"));
const AdminCorretores = lazy(() => import("./pages/Admin/Corretores"));
const AdminLeads = lazy(() => import("./pages/Admin/Leads"));
const AdminNovoLead = lazy(() => import("./pages/Admin/NovoLead"));
const AdminVisitas = lazy(() => import("./pages/Admin/Visitas"));
const CadastrarImovel = lazy(() => import("./pages/Admin/CadastrarImovel"));
const Perfil = lazy(() => import("./pages/Admin/Perfil"));

// ========== NOVAS PÁGINAS ADMIN ==========
const AdminEstados = lazy(() => import("./pages/Admin/Estados"));
const AdminCidades = lazy(() => import("./pages/Admin/Cidades"));
const AdminBairros = lazy(() => import("./pages/Admin/Bairros"));
const AdminUsuarios = lazy(() => import("./pages/Admin/Usuarios"));
const AdminConfiguracoes = lazy(() => import("./pages/Admin/Configuracoes"));

// ========== PÁGINAS DE CADASTRO E EDIÇÃO ==========
const AdminNovoCorretor = lazy(() => import("./pages/Admin/NovoCorretor"));
const AdminEditarCorretor = lazy(() => import("./pages/Admin/EditarCorretor")); // <-- ADICIONADO
const AdminNovoUsuario = lazy(() => import("./pages/Admin/NovoUsuario"));

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D]"></div>
        <p className="mt-4 text-gray-600 font-medium">Carregando Adventus...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ============ ROTAS PÚBLICAS ============ */}
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="comprar" element={<ComprarImovel />} />
            <Route path="alugar" element={<AlugarImovel />} />
            <Route path="imovel/:slug/:codigo" element={<DetalheImovel />} />
            <Route path="imovel/:slug" element={<DetalheImovel />} />
            <Route path="sobre-nos" element={<SobreNos />} />
          </Route>

          <Route
            path="/politica-de-privacidade"
            element={<PoliticaPrivacidade />}
          />

          {/* ============ ÁREA ADMIN PROTEGIDA ============ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* 1. Dashboard Principal */}
            <Route
              index
              element={
                <ProtectedRoute
                  allowedPerfis={[
                    "master",
                    "admin",
                    "gerente",
                    "financeiro",
                    "marketing",
                  ]}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 2. Rotas de Imóveis */}
            <Route path="imoveis" element={<AdminImoveis />} />
            <Route path="imoveis/novo" element={<CadastrarImovel />} />

            {/* 3. Rotas de Leads */}
            <Route path="leads" element={<AdminLeads />} />
            <Route path="leads/novo" element={<AdminNovoLead />} />

            {/* 4. Rotas de Corretores */}
            <Route
              path="corretores"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminCorretores />
                </ProtectedRoute>
              }
            />
            <Route
              path="corretores/novo"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminNovoCorretor />
                </ProtectedRoute>
              }
            />
            {/* 🆕 NOVA ROTA: Editar Corretor */}
            <Route
              path="corretores/editar/:id"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminEditarCorretor />
                </ProtectedRoute>
              }
            />

            {/* 5. Rotas de Usuários */}
            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin"]}>
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios/novo"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin"]}>
                  <AdminNovoUsuario />
                </ProtectedRoute>
              }
            />

            {/* 6. Outras Rotas */}
            <Route path="visitas" element={<AdminVisitas />} />
            <Route path="perfil" element={<Perfil />} />

            {/* 7. Rotas de Localização */}
            <Route path="estados" element={<AdminEstados />} />
            <Route path="cidades" element={<AdminCidades />} />
            <Route path="bairros" element={<AdminBairros />} />

            {/* 8. Configurações */}
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
          </Route>

          {/* ============ 404 ============ */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                  <h1 className="text-6xl font-bold text-[#D4A24D] mb-4">
                    404
                  </h1>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Página não encontrada
                  </h2>
                  <p className="text-gray-600 mb-6 text-center">
                    A página que você está procurando não existe ou foi movida.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-2 bg-[#D4A24D] text-white rounded-full hover:bg-[#b88a3e] transition-colors"
                  >
                    Voltar para o início
                  </button>
                </div>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default AppRoutes;
