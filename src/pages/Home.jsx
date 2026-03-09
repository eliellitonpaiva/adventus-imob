import Hero from "../componentes/Hero/Hero";
import VitrineAdventus from "../componentes/VitrineAdventus/VitrineAdventus";
import Indicadores from "../componentes/Indicadores/Indicadores";
import SejaCorretor from "../componentes/SejaCorretor/SejaCorretor";
import NossosNumeros from "../componentes/NossosNumeros/NossosNumeros";
import ServicosAdventus from "../componentes/ServicosAdventus/ServicosAdventus";
import Faq from "../componentes/Faq/Faq";

function Home() {
  return (
    <>
      <Hero />
      <VitrineAdventus />
      <Indicadores />
      <SejaCorretor />
      <NossosNumeros />
      <ServicosAdventus />
      <Faq />
    </>
  );
}

export default Home;
