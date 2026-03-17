// src/routes.jsx
import { Routes, Route } from "react-router-dom"; // 👈 SÓ Routes e Route
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./componentes/Layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute"; // 👈 Importa da pasta routes
import Login from "./pages/Login";

// ========== Lazy loading das páginas ==========
const Home = lazy(() => import("./pages/Home"));
const ComprarImovel = lazy(() => import("./pages/ComprarImovel"));
const AlugarImovel = lazy(() => import("./pages/AlugarImovel"));
const DetalheImovel = lazy(() => import("./pages/DetalheImovel"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));

// ========== Páginas Admin ==========
const AdminLayout = lazy(() => import("./componentes/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Admin"));
const AdminImoveis = lazy(() => import("./pages/Admin/Imoveis"));
const AdminCorretores = lazy(() => import("./pages/Admin/Corretores"));
const AdminLeads = lazy(() => import("./pages/Admin/Leads"));
const AdminCandidatos = lazy(() => import("./pages/Admin/Candidatos"));
const AdminEstados = lazy(() => import("./pages/Admin/Estados"));
const AdminCidades = lazy(() => import("./pages/Admin/Cidades"));
const AdminBairros = lazy(() => import("./pages/Admin/Bairros"));
const AdminVisitas = lazy(() => import("./pages/Admin/Visitas"));

// ========== Cadastros Admin ==========
const CadastrarImovel = lazy(() => import("./pages/Admin/CadastrarImovel"));
const EditarImovel = lazy(() => import("./pages/Admin/EditarImovel"));
const EditarImovelPorCodigo = lazy(
  () => import("./pages/Admin/EditarImovelPorCodigo"),
);
const NovoLead = lazy(() => import("./pages/Admin/NovoLead"));
const CadastrarEmpreendimento = lazy(
  () => import("./pages/Admin/CadastrarEmpreendimento"),
);
const ListaEmpreendimentos = lazy(
  () => import("./pages/Admin/ListaEmpreendimentos"),
);

// ========== Corretores ==========
const NovoCorretor = lazy(() => import("./pages/Admin/NovoCorretor"));
const EditarCorretor = lazy(() => import("./pages/Admin/EditarCorretor"));

// ========== Usuários ==========
const AdminUsuarios = lazy(() => import("./pages/Admin/Usuarios"));
const NovoUsuario = lazy(() => import("./pages/Admin/NovoUsuario"));
const EditarUsuario = lazy(() => import("./pages/Admin/EditarUsuario"));

// ========== Perfil e Config ==========
const Perfil = lazy(() => import("./pages/Admin/Perfil"));
const Configuracoes = lazy(() => import("./pages/Admin/Configuracoes"));

function AppRoutes() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D]"></div>
              <p className="mt-4 text-gray-600">Carregando aplicação...</p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* ============ ROTAS PÚBLICAS ============ */}
          <Route path="/login" element={<Login />} />

          {/* Rotas com Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="comprar" element={<ComprarImovel />} />
            <Route path="alugar" element={<AlugarImovel />} />
            <Route path="imovel/:slug/:codigo" element={<DetalheImovel />} />
            <Route path="imovel/:slug" element={<DetalheImovel />} />
            <Route path="sobre-nos" element={<SobreNos />} />
          </Route>

          {/* Política de Privacidade - SEM LAYOUT */}
          <Route
            path="/politica-de-privacidade"
            element={<PoliticaPrivacidade />}
          />

          {/* ============ ROTAS ADMIN ============ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
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
            <Route
              path="imoveis"
              element={
                <ProtectedRoute
                  allowedPerfis={[
                    "master",
                    "admin",
                    "gerente",
                    "financeiro",
                    "marketing",
                    "corretor",
                  ]}
                >
                  <AdminImoveis />
                </ProtectedRoute>
              }
            />
            <Route
              path="imoveis/novo"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <CadastrarImovel />
                </ProtectedRoute>
              }
            />
            <Route
              path="imoveis/editar/:id"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <EditarImovel />
                </ProtectedRoute>
              }
            />
            <Route
              path="imoveis/codigo/:codigo"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <EditarImovelPorCodigo />
                </ProtectedRoute>
              }
            />
            <Route
              path="empreendimentos"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "marketing"]}
                >
                  <ListaEmpreendimentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="cadastrar-empreendimento"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "marketing"]}
                >
                  <CadastrarEmpreendimento />
                </ProtectedRoute>
              }
            />
            <Route
              path="leads"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <AdminLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="leads/novo"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <NovoLead />
                </ProtectedRoute>
              }
            />
            <Route
              path="corretores"
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
                  <AdminCorretores />
                </ProtectedRoute>
              }
            />
            <Route
              path="corretores/novo"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <NovoCorretor />
                </ProtectedRoute>
              }
            />
            <Route
              path="corretores/editar/:id"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <EditarCorretor />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedPerfis={["master"]}>
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios/novo"
              element={
                <ProtectedRoute allowedPerfis={["master"]}>
                  <NovoUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios/editar/:id"
              element={
                <ProtectedRoute allowedPerfis={["master"]}>
                  <EditarUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="configuracoes"
              element={
                <ProtectedRoute allowedPerfis={["master"]}>
                  <Configuracoes />
                </ProtectedRoute>
              }
            />
            <Route path="perfil" element={<Perfil />} />
            <Route
              path="candidatos"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminCandidatos />
                </ProtectedRoute>
              }
            />
            <Route
              path="estados"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminEstados />
                </ProtectedRoute>
              }
            />
            <Route
              path="cidades"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminCidades />
                </ProtectedRoute>
              }
            />
            <Route
              path="bairros"
              element={
                <ProtectedRoute allowedPerfis={["master", "admin", "gerente"]}>
                  <AdminBairros />
                </ProtectedRoute>
              }
            />
            <Route
              path="visitas"
              element={
                <ProtectedRoute
                  allowedPerfis={["master", "admin", "gerente", "corretor"]}
                >
                  <AdminVisitas />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    404 - Página não encontrada
                  </h1>
                  <p className="text-gray-600">
                    A página que você está procurando não existe.
                  </p>
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
