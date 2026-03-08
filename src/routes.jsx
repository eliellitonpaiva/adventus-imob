import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Layout do site público
import Layout from "./componentes/Layout/Layout";

// Proteção de rotas
import ProtectedRoute from "./routes/ProtectedRoute";

// Página de Login (import normal, não lazy)
import Login from "./pages/Login";

// ========== Lazy loading das páginas do SITE NORMAL ==========
const Home = lazy(() => import("./pages/Home"));
const ComprarImovel = lazy(() => import("./pages/ComprarImovel"));
const AlugarImovel = lazy(() => import("./pages/AlugarImovel"));
const DetalheImovel = lazy(() => import("./pages/DetalheImovel"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const Contato = lazy(() => import("./pages/Contato"));

// ========== Lazy loading das páginas do ADMIN ==========
const AdminLayout = lazy(() => import("./componentes/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Admin"));
const AdminImoveis = lazy(() => import("./pages/Admin/Imoveis"));
const AdminCorretores = lazy(() => import("./pages/Admin/Corretores"));
const AdminLeads = lazy(() => import("./pages/Admin/Leads"));
const AdminCandidatos = lazy(() => import("./pages/Admin/Candidatos"));

// ========== Páginas de Localização (Estados/Cidades/Bairros) ==========
const AdminEstados = lazy(() => import("./pages/Admin/Estados"));
const AdminCidades = lazy(() => import("./pages/Admin/Cidades"));
const AdminBairros = lazy(() => import("./pages/Admin/Bairros"));
const AdminVisitas = lazy(() => import("./pages/Admin/Visitas"));

// ========== PÁGINAS DE CADASTRO ADMIN ==========
const CadastrarImovel = lazy(() => import("./pages/Admin/CadastrarImovel"));
const EditarImovel = lazy(() => import("./pages/Admin/EditarImovel"));

// 🔥 NOVA PÁGINA: Visualizar/Editar Imóvel por Código
const EditarImovelPorCodigo = lazy(
  () => import("./pages/Admin/EditarImovelPorCodigo"),
);

// 🔥 NOVA PÁGINA: Cadastrar Lead
const NovoLead = lazy(() => import("./pages/Admin/NovoLead"));

// ========== EMPREENDIMENTOS ==========
const CadastrarEmpreendimento = lazy(
  () => import("./pages/Admin/CadastrarEmpreendimento"),
);
const ListaEmpreendimentos = lazy(
  () => import("./pages/Admin/ListaEmpreendimentos"),
);

// ========== PÁGINAS DE CORRETORES ==========
const NovoCorretor = lazy(() => import("./pages/Admin/NovoCorretor"));
const EditarCorretor = lazy(() => import("./pages/Admin/EditarCorretor"));

// ========== PÁGINAS DE USUÁRIOS DO SISTEMA ==========
const AdminUsuarios = lazy(() => import("./pages/Admin/Usuarios"));
const NovoUsuario = lazy(() => import("./pages/Admin/NovoUsuario"));
const EditarUsuario = lazy(() => import("./pages/Admin/EditarUsuario"));

// ========== 🆕 PÁGINA DE PERFIL DO USUÁRIO ==========
const Perfil = lazy(() => import("./pages/Admin/Perfil"));

function AppRoutes() {
  return (
    <BrowserRouter>
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
            {/* ============ LOGIN ============ */}
            <Route path="/login" element={<Login />} />

            {/* ============ SITE PÚBLICO ============ */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/comprar"
              element={
                <Layout>
                  <ComprarImovel />
                </Layout>
              }
            />
            <Route
              path="/alugar"
              element={
                <Layout>
                  <AlugarImovel />
                </Layout>
              }
            />

            {/* 🔥🔥🔥 NOVA ROTA: DETALHE DO IMÓVEL COM SLUG + CÓDIGO */}
            <Route
              path="/imovel/:slug/:codigo"
              element={
                <Layout>
                  <DetalheImovel />
                </Layout>
              }
            />

            <Route
              path="/sobre-nos"
              element={
                <Layout>
                  <SobreNos />
                </Layout>
              }
            />
            <Route
              path="/contato"
              element={
                <Layout>
                  <Contato />
                </Layout>
              }
            />

            {/* ============ ADMIN ============ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="imoveis" element={<AdminImoveis />} />
              <Route path="imoveis/novo" element={<CadastrarImovel />} />
              <Route path="imoveis/editar/:id" element={<EditarImovel />} />
              <Route
                path="imoveis/codigo/:codigo"
                element={<EditarImovelPorCodigo />}
              />
              <Route
                path="empreendimentos"
                element={<ListaEmpreendimentos />}
              />
              <Route
                path="cadastrar-empreendimento"
                element={<CadastrarEmpreendimento />}
              />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/novo" element={<NovoLead />} />
              <Route path="corretores" element={<AdminCorretores />} />
              <Route path="corretores/novo" element={<NovoCorretor />} />
              <Route
                path="corretores/editar/:id"
                element={<EditarCorretor />}
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
              <Route path="perfil" element={<Perfil />} />
              <Route path="candidatos" element={<AdminCandidatos />} />
              <Route path="estados" element={<AdminEstados />} />
              <Route path="cidades" element={<AdminCidades />} />
              <Route path="bairros" element={<AdminBairros />} />
              <Route path="visitas" element={<AdminVisitas />} />
            </Route>

            {/* ============ 404 ============ */}
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
    </BrowserRouter>
  );
}

export default AppRoutes;
