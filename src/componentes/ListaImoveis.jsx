import CardImovel from "./CardImovel";

function ListaImoveis({ imovelSelecionado, onSelecionar }) {
  const imoveis = [
    {
      nome: "Casa no Centro",
      bairro: "Centro",
      preco: "R$ 350.000",
      imagem: "https://via.placeholder.com/400x250",
    },
    {
      nome: "Apartamento Jardim",
      bairro: "Jardim das Flores",
      preco: "R$ 280.000",
      imagem: "https://via.placeholder.com/400x250",
    },
    {
      nome: "Terreno Bairro Sul",
      bairro: "Bairro Sul",
      preco: "R$ 180.000",
      imagem: "https://via.placeholder.com/400x250",
    },
  ];

  return (
    <div className="lista-imoveis">
      {imoveis.map((imovel) => (
        <CardImovel
          key={imovel.nome}
          nome={imovel.nome}
          bairro={imovel.bairro}
          preco={imovel.preco}
          imagem={imovel.imagem}
          selecionado={imovelSelecionado === imovel.nome}
          onSelecionar={() => onSelecionar(imovel.nome)}
        />
      ))}
    </div>
  );
}

export default ListaImoveis;
