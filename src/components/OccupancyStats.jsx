import { useGymStore } from '../store/useGymStore.js';

const statusLabels = {
  LOW: 'Baja',
  MEDIUM: 'Moderada',
  HIGH: 'Alta',
};

export default function OccupancyStats({ gym }) {
  const enterGym = useGymStore((state) => state.enterGym);
  const exitGym = useGymStore((state) => state.exitGym);
  const percentage = Math.round((gym.currentOccupancy / gym.maxCapacity) * 100);
  const full = gym.currentOccupancy >= gym.maxCapacity;
  const empty = gym.currentOccupancy <= 0;

  return (
    <section className="panel occupancy-panel" aria-labelledby="occupancy-title">
      <div className="panel-heading compact-heading">
        <div>
          <p className="eyebrow">EN ESTE MOMENTO</p>
          <h2 id="occupancy-title">Ocupación</h2>
        </div>
        <span className={`status-badge status-${gym.status.toLowerCase()}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabels[gym.status]}
        </span>
      </div>

      <p className="occupancy-location">{gym.name}</p>
      <p className="gym-address">{gym.address}</p>
      {!gym.locationVerified && (
        <p className="location-note">Dirección y coordenadas de demostración por confirmar</p>
      )}
      <div className="gym-schedule">
        <span className="schedule-icon" aria-hidden="true">◷</span>
        <span><strong>{gym.scheduleType}</strong> · {gym.scheduleHours}</span>
      </div>
      <div className="category-list" aria-label="Modalidades disponibles">
        {gym.categories.map((category) => (
          <span className="category-chip" key={category}>{category}</span>
        ))}
      </div>
      <div className="occupancy-numbers">
        <strong>{gym.currentOccupancy}</strong>
        <span> / {gym.maxCapacity} personas</span>
      </div>
      <div
        className={`occupancy-track occupancy-track-${gym.status.toLowerCase()}`}
        role="progressbar"
        aria-label="Porcentaje de ocupación"
        aria-valuenow={gym.currentOccupancy}
        aria-valuemin={0}
        aria-valuemax={gym.maxCapacity}
      >
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className="occupancy-scale">
        <span>{percentage}% de capacidad</span>
        <span>Actualizado ahora</span>
      </div>
      <div className="flow-totals" aria-label="Flujo acumulado">
        <div>
          <span className="flow-icon flow-entry-icon" aria-hidden="true">↓</span>
          <span>Entradas</span>
          <strong>{gym.totalEntries.toLocaleString('es-CO')}</strong>
        </div>
        <div>
          <span className="flow-icon flow-exit-icon" aria-hidden="true">↑</span>
          <span>Salidas</span>
          <strong>{gym.totalExits.toLocaleString('es-CO')}</strong>
        </div>
      </div>

      <div className="traffic-controls">
        <button
          className="traffic-button traffic-exit"
          type="button"
          onClick={() => exitGym(1)}
          disabled={empty}
          aria-label="Simular salida de una persona"
        >
          <span aria-hidden="true">−</span> Salida
        </button>
        <button
          className="traffic-button traffic-entry"
          type="button"
          onClick={() => enterGym(1)}
          disabled={full}
          aria-label="Simular entrada de una persona"
        >
          <span aria-hidden="true">+</span> Entrada
        </button>
      </div>
      <div className="quick-controls" aria-label="Simulación rápida">
        <span>Simular grupo</span>
        <button type="button" onClick={() => exitGym(10)} disabled={empty}>
          −10
        </button>
        <button type="button" onClick={() => enterGym(10)} disabled={full}>
          +10
        </button>
      </div>
    </section>
  );
}
