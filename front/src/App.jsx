import { useEffect, useState, useMemo } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const allCategories = useMemo(() => {
    const cats = new Set(['Todas']);
    gyms.forEach((gym) => {
      if (Array.isArray(gym.categories)) {
        gym.categories.forEach((c) => cats.add(c));
      } else if (typeof gym.category === 'string') {
        cats.add(gym.category);
      }
    });
    return Array.from(cats);
  }, [gyms]);

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) => {
      const gymCats = Array.isArray(gym.categories)
        ? gym.categories.join(' ').toLowerCase()
        : (gym.category || '').toLowerCase();
      const gymName = (gym.name || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || gymCats.includes(query) || gymName.includes(query);
      const matchesCategory =
        selectedCategory === 'Todas' ||
        (Array.isArray(gym.categories) && gym.categories.includes(selectedCategory)) ||
        gym.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [gyms, searchTerm, selectedCategory]);

  const selectedGym = gyms.find((gym) => gym.id === selectedGymId);

  const retryBackendConnection = async () => {
    const loaded = await fetchGyms();
    if (loaded) connectOccupancySocket();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setCurrentUser({ email: loginEmail, role: 'Usuario Verificado' });
    setShowAuthModal(false);
    setLoginPassword('');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {currentUser ? (
            <button
              type="button"
              onClick={() => setCurrentUser(null)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid #1f7a4c',
                background: '#eef7f2',
                color: '#1f7a4c',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
               {currentUser.email.split('@')[0]} (Salir)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background: '#1f7a4c',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* SEGURIDAD Y AUTENTICACIÓN */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>PeakFit</h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Inicia sesión para continuar.
            </p>
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                required
                placeholder="Correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <input
                type="password"
                required
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#1f7a4c',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}

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

      {/* BARRA DE BÚSQUEDA Y FILTRO DE CATEGORÍAS */}
      <section
        aria-label="Filtrar gimnasios por categoría"
        style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              🔍
            </span>
            <input
              type="search"
              placeholder="Buscar por categoría (ej. CrossFit, Yoga, Pilates) o sede..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: isActive ? '1px solid #1f7a4c' : '1px solid #cbd5e1',
                    background: isActive ? '#1f7a4c' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {filteredGyms.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '32px', background: '#fff', borderRadius: '16px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: '600' }}>No encontramos sedes con esa categoría</p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #1f7a4c',
              background: 'transparent',
              color: '#1f7a4c',
              cursor: 'pointer'
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <GymCards
          gyms={filteredGyms}
          loading={loading}
          selectedGymId={selectedGymId}
          onSelect={selectGym}
          onFocus={focusGym}
        />
      )}

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