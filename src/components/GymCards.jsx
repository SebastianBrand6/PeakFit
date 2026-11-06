const statusLabels = {
  LOW: 'Baja',
  MEDIUM: 'Moderada',
  HIGH: 'Alta',
};

function GymCardSkeleton() {
  return (
    <div className="gym-card gym-card-skeleton" aria-hidden="true">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-subtitle" />
      <div className="skeleton-line skeleton-meter" />
      <div className="skeleton-line skeleton-caption" />
    </div>
  );
}

export default function GymCards({ gyms, loading, selectedGymId, onSelect, onFocus }) {
  return (
    <section className="gym-list-section" aria-labelledby="gym-list-title">
      <div className="gym-list-heading">
        <div>
          <p className="eyebrow">ELIGE DÓNDE ENTRENAR</p>
          <h2 id="gym-list-title">Sedes en Medellín</h2>
        </div>
        {!loading && (
          <span className="gym-count">{gyms.length} {gyms.length === 1 ? 'sede' : 'sedes'}</span>
        )}
      </div>
      <div className="gym-card-grid" aria-busy={loading}>
        {loading
          ? [0, 1, 2].map((item) => <GymCardSkeleton key={item} />)
          : gyms.map((gym) => {
            const percentage = Math.min(100, Math.round(
              (gym.currentOccupancy / gym.maxCapacity) * 100,
            ));

            return (
              <button
                className={`gym-card${gym.id === selectedGymId ? ' gym-card-selected' : ''}`}
                key={gym.id}
                type="button"
                aria-pressed={gym.id === selectedGymId}
                onClick={() => onSelect(gym.id)}
                onMouseEnter={() => onFocus(gym.id)}
                onFocus={() => onFocus(gym.id)}
              >
                <span className="gym-card-topline">
                  <span className="gym-card-brand">{gym.brand}</span>
                  <span className={`status-badge status-${gym.status.toLowerCase()}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {statusLabels[gym.status]}
                  </span>
                </span>
                <span className="gym-card-name">{gym.name}</span>
                <span className="gym-card-neighborhood">{gym.neighborhood || gym.address}</span>
                <span
                  className={`gym-card-track occupancy-track-${gym.status.toLowerCase()}`}
                  role="progressbar"
                  aria-label={`Ocupación de ${gym.name}`}
                  aria-valuenow={gym.currentOccupancy}
                  aria-valuemin={0}
                  aria-valuemax={gym.maxCapacity}
                >
                  <span style={{ width: `${percentage}%` }} />
                </span>
                <span className="gym-card-capacity">
                  <strong>{percentage}% ocupado</strong>
                  <span>{gym.currentOccupancy} / {gym.maxCapacity} personas</span>
                </span>
              </button>
            );
          })}
      </div>
    </section>
  );
}
