import { useEffect } from 'react';
import GymMap from './components/GymMap.jsx';
import GymCards from './components/GymCards.jsx';
import OccupancyStats from './components/OccupancyStats.jsx';
import PricingPlans from './components/PricingPlans.jsx';
import { useGymStore } from './store/useGymStore.js';

export default function App() {
  const gyms = useGymStore((state) => state.gyms);
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const selectGym = useGymStore((state) => state.selectGym);
  const focusGym = useGymStore((state) => state.focusGym);
  const fetchGyms = useGymStore((state) => state.fetchGyms);
  const connectOccupancySocket = useGymStore((state) => state.connectOccupancySocket);
  const disconnectOccupancySocket = useGymStore((state) => state.disconnectOccupancySocket);
  const loading = useGymStore((state) => state.loading);
  const loadError = useGymStore((state) => state.loadError);
  const socketStatus = useGymStore((state) => state.socketStatus);
  const socketError = useGymStore((state) => state.socketError);
  const selectedGym = gyms.find((gym) => gym.id === selectedGymId);

  const retryBackendConnection = async () => {
    const loaded = await fetchGyms();
    if (loaded) connectOccupancySocket();
  };

  useEffect(() => {
    let active = true;

    fetchGyms().then((loaded) => {
      if (active && loaded) connectOccupancySocket();
    });

    return () => {
      active = false;
      disconnectOccupancySocket();
    };
  }, [connectOccupancySocket, disconnectOccupancySocket, fetchGyms]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="PeakFit, inicio">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>peak<span className="brand-accent">fit</span></span>
        </a>
        <div className={`topbar-meta${socketStatus === 'connected' ? ' topbar-live' : ''}`} role="status">
          <span className={`live-dot${socketStatus === 'connected' ? '' : ' live-dot-offline'}`} aria-hidden="true" />
          <span>
            {socketStatus === 'connected'
              ? 'EN VIVO'
              : socketStatus === 'connecting'
                ? 'Conectando con PeakFit'
                : loadError
                  ? 'Backend sin conexión'
                  : 'Tiempo real desconectado'}
          </span>
        </div>
      </header>

      {loading && (
        <p className="sr-only" role="status">Cargando sedes desde el servidor</p>
      )}
      {loadError && (
        <div className="backend-notice backend-error" role="alert">
          <div className="error-copy">
            <strong>No pudimos conectar con PeakFit</strong>
            <span>{loadError}</span>
            <span>Se muestran temporalmente datos de demostración. Verifica que Spring Boot esté activo.</span>
          </div>
          <button
            className="backend-retry"
            type="button"
            onClick={retryBackendConnection}
            disabled={loading}
          >
            Reintentar conexión
          </button>
        </div>
      )}
      {socketError && (
        <div className="backend-notice backend-error socket-notice" role="alert">
          Error en la conexión de ocupación en tiempo real: {socketError}
        </div>
      )}

      <section className="page-intro">
        <div>
          <p className="eyebrow">ENTRENA A TU MANERA</p>
          <h1>Tu próximo entrenamiento empieza aquí.</h1>
          <p className="intro-copy">
            Encuentra tu sede ideal, revisa su ocupación y conoce sus planes.
          </p>
        </div>
        <label className="gym-select-label" htmlFor="gym-select">
          Sede seleccionada
          <select
            id="gym-select"
            value={selectedGymId}
            onChange={(event) => selectGym(event.target.value)}
          >
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>{gym.name}</option>
            ))}
          </select>
        </label>
      </section>

      <GymCards
        gyms={gyms}
        loading={loading}
        selectedGymId={selectedGymId}
        onSelect={selectGym}
        onFocus={focusGym}
      />

      <section className="dashboard-grid" aria-label="Explorar gimnasios">
        <div className="map-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SEDES CERCA DE TI</p>
              <h2>Explora el mapa</h2>
            </div>
            <span className="location-pill">
              <span aria-hidden="true">⌖</span> Medellín
            </span>
          </div>
          <div className="map-frame">
            <GymMap />
          </div>
          <div className="map-legend" aria-label="Leyenda de ocupación">
            <span><i className="legend-dot legend-low" /> Baja <small>&lt; 50%</small></span>
            <span><i className="legend-dot legend-medium" /> Moderada <small>50–79%</small></span>
            <span><i className="legend-dot legend-high" /> Alta <small>&gt; 80%</small></span>
          </div>
          <p className="map-hint">Selecciona un marcador para cambiar de sede</p>
        </div>

        <div className="side-panels">
          {selectedGym && <OccupancyStats gym={selectedGym} />}
          {selectedGym && <PricingPlans gym={selectedGym} />}
        </div>
      </section>

      <footer className="page-footer">
        <span>PeakFit <span aria-hidden="true">·</span> Encuentra tu ritmo.</span>
        <span>Datos de sedes y precios de referencia</span>
      </footer>
    </main>
  );
}
