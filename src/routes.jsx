import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Layout do site público
import Layout from "./componentes/Layout/Layout";

// Proteção de rotas
import ProtectedRoute from "./routes/ProtectedRoute";

// Página de Login
import Login from "./pages/Login";

// ========== Lazy loading das páginas do SITE NORMAL ==========
const Home = lazy(() => import("./pages/Home"));
const ComprarImovel = lazy(() => import("./pages/ComprarImovel"));
const DetalheImovel = lazy(() => import("./pages/DetalheImovel"));

// ========== Lazy loading das páginas do ADMIN ==========
const AdminLayout = lazy(() => import("./componentes/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/admin"));
const AdminImoveis = lazy(() => import("./pages/Admin/imoveis"));
const AdminCorretores = lazy(() => import("./pages/Admin/corretores"));
const AdminLeads = lazy(() => import("./pages/Admin/leads"));
const AdminCandidatos = lazy(() => import("./pages/Admin/candidatos"));
const AdminEstados = lazy(() => import("./pages/Admin/estados"));
const AdminCidades = lazy(() => import("./pages/Admin/cidades"));
const AdminBairros = lazy(() => import("./pages/Admin/bairros"));
const AdminVisitas = lazy(() => import("./pages/Admin/visitas"));

// ========== PÁGINAS DE CADASTRO ADMIN ==========
const CadastrarImovel = lazy(() => import("./pages/Admin/CadastrarImovel"));
const EditarImovel = lazy(() => import("./pages/Admin/EditarImovel"));

// 🔥 NOVA PÁGINA: Visualizar/Editar Imóvel por Código
const EditarImovelPorCodigo = lazy(
  () => import("./pages/Admin/EditarImovelPorCodigo"),
);

// 🔥 NOVA PÁGINA: Cadastrar Lead
const NovoLead = lazy(() => import("./pages/Admin/NovoLead"));

// 🔥 FIX: Import com caminho ABSOLUTO e extensão .jsx
const CadastrarEmpreendimento = lazy(
  () => import("/src/pages/Admin/CadastrarEmpreendimento.jsx"),
);

// ========== NOVA PÁGINA: LISTA DE EMPREENDIMENTOS ==========
const ListaEmpreendimentos = lazy(
  () => import("./pages/Admin/ListaEmpreendimentos.jsx"),
);

// ========== Páginas simples ==========
function Institucional() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Sobre a Adventus</h1>
      <p>Página institucional em construção</p>
    </div>
  );
}

function Alugar() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Alugar Imóvel</h1>
      <p>Página de aluguel em construção</p>
    </div>
  );
}

function Contato() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Contato</h1>
      <p>Página de contato em construção</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* AuthProvider envolve toda a aplicação */}
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
            {/* ============ LOGIN (PÚBLICO) ============ */}
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

            {/* 🔥🔥🔥 ROTA DO SITE: DETALHE DO IMÓVEL POR SLUG 🔥🔥🔥 */}
            <Route
              path="/imovel/:slug"
              element={
                <Layout>
                  <DetalheImovel />
                </Layout>
              }
            />

            <Route
              path="/institucional"
              element={
                <Layout>
                  <Institucional />
                </Layout>
              }
            />

            <Route
              path="/alugar"
              element={
                <Layout>
                  <Alugar />
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

            {/* ============ ADMIN (PROTEGIDO) ============ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />

              {/* ========== ROTAS DE IMÓVEIS ========== */}
              <Route path="imoveis" element={<AdminImoveis />} />
              <Route path="imoveis/novo" element={<CadastrarImovel />} />
              <Route path="imoveis/editar/:id" element={<EditarImovel />} />

              {/* 🔥 NOVA ROTA: Editar imóvel por código (CS-0001, APT-0002, etc.) */}
              <Route
                path="imoveis/codigo/:codigo"
                element={<EditarImovelPorCodigo />}
              />

              {/* ========== ROTAS DE EMPREENDIMENTOS ========== */}
              <Route
                path="empreendimentos"
                element={<ListaEmpreendimentos />}
              />
              <Route
                path="cadastrar-empreendimento"
                element={<CadastrarEmpreendimento />}
              />

              {/* ========== ROTAS DE LEADS ========== */}
              <Route path="leads" element={<AdminLeads />} />
              <Route path="leads/novo" element={<NovoLead />} />

              {/* ========== OUTRAS ROTAS ADMIN ========== */}
              <Route path="corretores" element={<AdminCorretores />} />
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
