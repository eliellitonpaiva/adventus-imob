import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./componentes/Layout/Layout";

// Lazy loading das páginas do SITE NORMAL
const Home = lazy(() => import("./pages/Home"));
const ComprarImovel = lazy(() => import("./pages/ComprarImovel"));
const DetalheImovel = lazy(() => import("./pages/DetalheImovel"));

// Lazy loading das páginas do ADMIN
const AdminLayout = lazy(() => import("./componentes/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/admin"));
const AdminImoveis = lazy(() => import("./pages/admin/imoveis"));
const AdminCorretores = lazy(() => import("./pages/admin/corretores"));
const AdminLeads = lazy(() => import("./pages/admin/leads"));

// Páginas simples (mantenha como está)
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
      <Suspense
        fallback={
          <div style={{ padding: "80px", textAlign: "center" }}>
            Carregando...
          </div>
        }
      >
        <Routes>
          {/* ============ ROTAS DO SITE NORMAL ============ */}

          {/* Página inicial */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* Home (alternativa) */}
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* Comprar imóvel */}
          <Route
            path="/comprar"
            element={
              <Layout>
                <ComprarImovel />
              </Layout>
            }
          />

          {/* Detalhe do imóvel */}
          <Route
            path="/imovel/:id"
            element={
              <Layout>
                <DetalheImovel />
              </Layout>
            }
          />

          {/* Institucional */}
          <Route
            path="/institucional"
            element={
              <Layout>
                <Institucional />
              </Layout>
            }
          />

          {/* Alugar */}
          <Route
            path="/alugar"
            element={
              <Layout>
                <Alugar />
              </Layout>
            }
          />

          {/* Contato */}
          <Route
            path="/contato"
            element={
              <Layout>
                <Contato />
              </Layout>
            }
          />

          {/* ============ ROTA 404 (Página não encontrada) ============ */}
          <Route
            path="*"
            element={
              <Layout>
                <div style={{ padding: "80px", textAlign: "center" }}>
                  <h1>404 - Página não encontrada</h1>
                </div>
              </Layout>
            }
          />

          {/* ============ ROTAS DO ADMIN ============ */}
          {/* IMPORTANTE: Estas rotas DEVEM ficar DEPOIS da rota 404 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> {/* /admin */}
            <Route path="imoveis" element={<AdminImoveis />} />{" "}
            {/* /admin/imoveis */}
            <Route path="corretores" element={<AdminCorretores />} />{" "}
            {/* /admin/corretores */}
            <Route path="leads" element={<AdminLeads />} /> {/* /admin/leads */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
