import { useEffect } from 'react';
import GymMap from './components/GymMap.jsx';
import OccupancyStats from './components/OccupancyStats.jsx';
import PricingPlans from './components/PricingPlans.jsx';
import { useGymStore } from './store/useGymStore.js';

export default function App() {
  const gyms = useGymStore((state) => state.gyms);
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const selectGym = useGymStore((state) => state.selectGym);
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
        <div className="topbar-meta">
          <span className={`live-dot${socketStatus === 'connected' ? '' : ' live-dot-offline'}`} aria-hidden="true" />
          <span>
            {socketStatus === 'connected'
              ? 'Ocupación en vivo'
              : socketStatus === 'connecting'
                ? 'Conectando con PeakFit'
                : loadError
                  ? 'Backend sin conexión'
                  : 'Tiempo real desconectado'}
          </span>
        </div>
      </header>

      {loading && (
        <p className="backend-notice" role="status">Cargando sedes desde el servidor...</p>
      )}
      {loadError && (
        <p className="backend-notice backend-error" role="alert">
          No se pudieron cargar las sedes del backend: {loadError}
          <br />
          Se muestran temporalmente los datos de demostración.
          <br />
          Verifica que Spring Boot esté activo y permita solicitudes CORS desde esta aplicación.
          <button
            className="backend-retry"
            type="button"
            onClick={retryBackendConnection}
            disabled={loading}
          >
            Reintentar conexión
          </button>
        </p>
      )}
      {socketError && (
        <p className="backend-notice backend-error" role="alert">
          Error en la conexión de ocupación en tiempo real: {socketError}
        </p>
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
          <GymMap />
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
