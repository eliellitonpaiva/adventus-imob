import "./CardImovel.css";
import { Link } from "react-router-dom";

const CardImovel = ({
  status = "available", // available | sold | price-drop
  tipo = "CASA",
  finalidade = "VENDA",
  preco = "R$ 850.000",
  titulo = "Casa moderna em condomínio fechado",
  localizacao = "Centro • Torres / RS",
  quartos = 3,
  suites = 1,
  banheiros = 2,
  vagas = 2,
  emCondominio = true,
  imagem = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=60",
}) => {
  const statusMap = {
    available: {
      label: "Disponível",
      className: "status-available",
      icon: "fas fa-check-circle",
    },
    sold: {
      label: "Vendido",
      className: "status-sold",
      icon: "fas fa-times-circle",
    },
    "price-drop": {
      label: "Baixou Preço",
      className: "status-price-drop",
      icon: "fas fa-arrow-down",
    },
  };

  const statusData = statusMap[status];

  return (
    <article className="property-card">
      {/* STATUS */}
      <div className={`property-status ${statusData.className}`}>
        <i className={statusData.icon}></i>
        {statusData.label}
      </div>

      {/* IMAGEM - AGORA USANDO A PROP */}
      <div className="property-image-wrapper">
        <div className="property-image-container">
          <img src={imagem} alt={`Imóvel: ${titulo}`} />
        </div>
        <div className="property-divider"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="property-content">
        {/* TAGS */}
        <div className="property-info-container">
          <span className="property-tag">{finalidade}</span>
          <span className="property-tag property-type-tag">{tipo}</span>
        </div>

        {/* PREÇO */}
        <div className="property-price">{preco}</div>

        {/* TÍTULO */}
        <h3 className="property-title">{titulo}</h3>

        {/* LOCALIZAÇÃO */}
        <div className="property-location">
          <i className="fas fa-map-marker-alt"></i>
          {localizacao}
        </div>

        {/* FEATURES - CORRIGIDO! */}
        <div className="property-features">
          <div className="feature">
            <i className="fas fa-bed"></i>
            <span className="feature-text">
              {quartos} Quarto{quartos !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="feature">
            <i className="fas fa-bath"></i>
            <span className="feature-text">
              {banheiros} Banheiro{banheiros !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="feature">
            <i className="fas fa-shower"></i>
            <span className="feature-text">
              {suites} Suíte{suites !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="feature">
            <i className="fas fa-car"></i>
            <span className="feature-text">
              {vagas} Vaga{vagas !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="property-actions">
          {emCondominio && (
            <div className="condominium-badge">
              <i className="fas fa-building"></i>
              <span>Em condomínio</span>
            </div>
          )}

          <Link to="/imovel/1" className="btn-details">
            <i className="fas fa-eye"></i>
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CardImovel;
