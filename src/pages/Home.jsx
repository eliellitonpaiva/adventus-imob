import Hero from "../componentes/Hero/Hero";
import VitrineAdventus from "../componentes/VitrineAdventus/VitrineAdventus";
import Indicadores from "../componentes/Indicadores/Indicadores";
import SejaCorretor from "../componentes/SejaCorretor/SejaCorretor";
import NossosNumeros from "../componentes/NossosNumeros/NossosNumeros";
import ServicosAdventus from "../componentes/ServicosAdventus/ServicosAdventus";
import FAQ from "../componentes/FAQ/FAQ";

function Home() {
  return (
    <>
      <Hero />
      <VitrineAdventus />
      <Indicadores />
      <SejaCorretor />
      <NossosNumeros />
      <ServicosAdventus />
      <FAQ />
    </>
  );
}

export default Home;
