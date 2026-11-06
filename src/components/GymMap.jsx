import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useGymStore } from '../store/useGymStore.js';

const createGymIcon = (status, selected) => L.divIcon({
  className: 'gym-marker-icon',
  html: `<span class="gym-marker gym-marker-${status.toLowerCase()}${selected ? ' gym-marker-selected' : ''}"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -12],
});

function MapFocus({ gym }) {
  const map = useMap();

  useEffect(() => {
    if (gym) map.flyTo([gym.latitude, gym.longitude], Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.8,
    });
  }, [gym?.latitude, gym?.longitude, map]);

  return null;
}

export default function GymMap() {
  const gyms = useGymStore((state) => state.gyms);
  const mapFocusGymId = useGymStore((state) => state.mapFocusGymId);
  const selectGym = useGymStore((state) => state.selectGym);
  const icons = useMemo(() => ({
    LOW: createGymIcon('LOW', false),
    MEDIUM: createGymIcon('MEDIUM', false),
    HIGH: createGymIcon('HIGH', false),
    LOWSelected: createGymIcon('LOW', true),
    MEDIUMSelected: createGymIcon('MEDIUM', true),
    HIGHSelected: createGymIcon('HIGH', true),
  }), []);
  const focusedGym = gyms.find((gym) => gym.id === mapFocusGymId);

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
      <MapFocus gym={focusedGym} />
      {gyms.map((gym) => (
        <Marker
          key={gym.id}
          position={[gym.latitude, gym.longitude]}
          icon={icons[`${gym.status}${gym.id === mapFocusGymId ? 'Selected' : ''}`]}
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
