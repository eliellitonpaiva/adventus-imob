import { useState } from "react";
import Header from "./components/Header";
import ListaImoveis from "./components/ListaImoveis";

function App() {
  const [mensagem, setMensagem] = useState("Encontre seu imóvel ideal");

  const [imovelSelecionado, setImovelSelecionado] = useState("");

  const imoveis = [
    {
      id: 1,
      nome: "Casa no Centro",
      bairro: "Centro",
      preco: "R$ 350.000",
      imagem: "https://via.placeholder.com/300x180",
    },
    {
      id: 2,
      nome: "Apartamento Jardim",
      bairro: "Jardim das Flores",
      preco: "R$ 280.000",
      imagem: "https://via.placeholder.com/300x180",
    },
    {
      id: 3,
      nome: "Terreno Bairro Sul",
      bairro: "Bairro Sul",
      preco: "R$ 180.000",
      imagem: "https://via.placeholder.com/300x180",
    },
  ];

  function verImoveis() {
    setMensagem("Veja os imóveis disponíveis abaixo");
  }

  function selecionarImovel(nome) {
    setImovelSelecionado(nome);
  }

  return (
    <div>
      <Header mensagem={mensagem} onVerImoveis={verImoveis} />

      <main className="container">
        <h2>Destaques</h2>

        <ListaImoveis
          imovelSelecionado={imovelSelecionado}
          onSelecionar={selecionarImovel}
        />

        {imovelSelecionado && (
          <p>
            Você selecionou: <strong>{imovelSelecionado}</strong>
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
