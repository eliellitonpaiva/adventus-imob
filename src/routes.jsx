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
const AdminVisitas = lazy(() => import("./pages/Admin/Visitas"));
const CadastrarImovel = lazy(() => import("./pages/Admin/CadastrarImovel"));
const Perfil = lazy(() => import("./pages/Admin/Perfil"));

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
            {/* 1. Dashboard Principal: APENAS GESTÃO (Corretores são barrados aqui) */}
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

            {/* 2. Rotas de Operação: ADMINS + CORRETORES (Herda proteção do pai /admin) */}
            <Route path="imoveis" element={<AdminImoveis />} />
            <Route path="imoveis/novo" element={<CadastrarImovel />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="visitas" element={<AdminVisitas />} />
            <Route path="perfil" element={<Perfil />} />

            {/* 3. Gestão de Pessoas: APENAS NÍVEIS ALTOS */}
            <Route
              path="corretores"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminCorretores />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ============ 404 - REDIRECIONA PARA HOME OU LAYOUT 404 ============ */}
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
