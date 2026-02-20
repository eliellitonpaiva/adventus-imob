// pages/Admin/processoSeletivo.jsx
const ProcessoSeletivo = () => {
  const [abaAtiva, setAbaAtiva] = useState("pendente");
  const [candidatos, setCandidatos] = useState([]);

  // Carrega candidatos da aba atual
  useEffect(() => {
    carregarCandidatos();
  }, [abaAtiva]);

  const carregarCandidatos = async () => {
    const data = await candidatosService.buscarPorStatus(abaAtiva);
    setCandidatos(data);
  };

  const handleAgendarEntrevista = async (candidatoId, dados) => {
    await candidatosService.agendarEntrevista(candidatoId, dados);
    await carregarCandidatos(); // Recarrega a lista
  };

  const handleRegistrarFeedback = async (candidatoId, feedback) => {
    await candidatosService.registrarFeedbackEntrevista(candidatoId, feedback);
    await carregarCandidatos();
  };

  // ABAS IGUALZINHO AO SEU SISTEMA DE VISITAS!
  const abas = [
    { id: "pendente", label: "Pendentes", count: stats?.pendentes || 0 },
    {
      id: "entrevista_agendada",
      label: "Entrevista",
      count: stats?.entrevistas || 0,
    },
    {
      id: "aprovado_treinamento",
      label: "Treinamento",
      count: stats?.treinamentos || 0,
    },
    {
      id: "em_treinamento",
      label: "Em Treinamento",
      count: stats?.emTreinamento || 0,
    },
    { id: "ativo", label: "Ativos (Experiência)", count: stats?.ativos || 0 },
    { id: "reprovado", label: "Reprovados", count: stats?.reprovados || 0 },
  ];

  return (
    <div>
      {/* Abas de navegação */}
      <div className="abas">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={abaAtiva === aba.id ? "ativa" : ""}
          >
            {aba.label} ({aba.count})
          </button>
        ))}
      </div>

      {/* Lista de candidatos da aba atual */}
      <div className="grid">
        {candidatos.map((candidato) => (
          <CandidatoCard
            key={candidato.id}
            candidato={candidato}
            onAgendarEntrevista={handleAgendarEntrevista}
            onRegistrarFeedback={handleRegistrarFeedback}
          />
        ))}
      </div>
    </div>
  );
};
