import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useGymStore } from '../store/useGymStore.js';

const createGymIcon = (selected) => L.divIcon({
  className: 'gym-marker-icon',
  html: `<span class="gym-marker${selected ? ' gym-marker-selected' : ''}"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -12],
});

export default function GymMap() {
  const gyms = useGymStore((state) => state.gyms);
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const selectGym = useGymStore((state) => state.selectGym);
  const icons = useMemo(() => ({
    default: createGymIcon(false),
    selected: createGymIcon(true),
  }), []);

  return (
    <MapContainer
      className="gym-map"
      center={[6.2442, -75.5812]}
      zoom={12}
      scrollWheelZoom
      aria-label="Mapa interactivo de gimnasios en Medellín"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {gyms.map((gym) => (
        <Marker
          key={gym.id}
          position={[gym.latitude, gym.longitude]}
          icon={gym.id === selectedGymId ? icons.selected : icons.default}
          eventHandlers={{ click: () => selectGym(gym.id) }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{gym.name}</strong>
              <span>{gym.address}</span>
              {!gym.locationVerified && (
                <span className="map-location-note">Ubicación de referencia por confirmar</span>
              )}
              <span>
                {gym.latitude.toFixed(5)}, {gym.longitude.toFixed(5)}
              </span>
              <span>{gym.currentOccupancy} de {gym.maxCapacity} personas</span>
              <span>{gym.scheduleType} · {gym.scheduleHours}</span>
              <button type="button" onClick={() => selectGym(gym.id)}>
                Ver esta sede
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
