import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8080/api/gimnasios'; // Cambia esta URL según tu configuración de backend
const SOCKET_URL = 'http://localhost:8080/ws-peakfit';

export const getOccupancyStatus = (currentOccupancy, maxCapacity) => {
  const percentage = (currentOccupancy / maxCapacity) * 100;

  if (percentage > 80) return 'HIGH';
  if (percentage >= 50) return 'MEDIUM';
  return 'LOW';
};

const makeGym = (gym) => ({
  ...gym,
  status: getOccupancyStatus(gym.currentOccupancy, gym.maxCapacity),
});

const initialGyms = [
  makeGym({
    id: 'smartfit-poblado',
    name: 'Smart Fit · El Poblado',
    brand: 'Smart Fit',
    neighborhood: 'El Poblado',
    latitude: 6.2088,
    longitude: -75.5712,
    address: 'Sector El Poblado, Medellín (dirección por confirmar)',
    locationVerified: false,
    currentOccupancy: 42,
    maxCapacity: 100,
    totalEntries: 0,
    totalExits: 0,
    categories: ['Musculación', 'Cardio', 'Clases Grupales'],
    scheduleType: 'Diurno',
    scheduleHours: '5:00 AM - 10:00 PM',
    plans: [
      {
        name: 'Fit',
        priceCOP: 119000,
        description: 'Entrenamiento en tu sede elegida.',
        features: ['Zona de musculación', 'Zona cardiovascular'],
      },
      {
        name: 'Black',
        priceCOP: 149000,
        description: 'Más sedes y beneficios exclusivos.',
        features: ['Acceso a múltiples sedes', 'Beneficios Black'],
      },
    ],
  }),
  makeGym({
    id: 'smartfit-laureles',
    name: 'Smart Fit · Laureles',
    brand: 'Smart Fit',
    neighborhood: 'Laureles',
    latitude: 6.2442,
    longitude: -75.5934,
    address: 'Sector Laureles, Medellín (dirección por confirmar)',
    locationVerified: false,
    currentOccupancy: 68,
    maxCapacity: 100,
    totalEntries: 0,
    totalExits: 0,
    categories: ['Musculación', 'Cardio', 'Clases Grupales'],
    scheduleType: 'Diurno',
    scheduleHours: '5:00 AM - 10:00 PM',
    plans: [
      {
        name: 'Fit',
        priceCOP: 119000,
        description: 'Entrenamiento en tu sede elegida.',
        features: ['Zona de musculación', 'Zona cardiovascular'],
      },
      {
        name: 'Black',
        priceCOP: 149000,
        description: 'Más sedes y beneficios exclusivos.',
        features: ['Acceso a múltiples sedes', 'Beneficios Black'],
      },
    ],
  }),
  makeGym({
    id: 'bodytech-belen',
    name: 'Bodytech · Belén',
    brand: 'Bodytech',
    neighborhood: 'Belén',
    latitude: 6.2303,
    longitude: -75.5972,
    address: 'Sector Belén, Medellín (dirección por confirmar)',
    locationVerified: false,
    currentOccupancy: 35,
    maxCapacity: 90,
    totalEntries: 0,
    totalExits: 0,
    categories: ['Musculación', 'Pilates', 'Yoga', 'Clases Grupales'],
    scheduleType: 'Diurno',
    scheduleHours: '5:00 AM - 10:00 PM',
    plans: [
      {
        name: 'One',
        priceCOP: 189000,
        description: 'Entrenamiento y clases grupales.',
        features: ['Acceso a gimnasio', 'Clases grupales'],
      },
      {
        name: 'Premium',
        priceCOP: 249000,
        description: 'Experiencia de entrenamiento premium.',
        features: ['Servicios premium', 'Clases dirigidas'],
      },
    ],
  }),
  makeGym({
    id: 'bodytech-robledo',
    name: 'Bodytech · Robledo',
    brand: 'Bodytech',
    neighborhood: 'Robledo',
    latitude: 6.2772,
    longitude: -75.5881,
    address: 'Sector Robledo, Medellín (dirección por confirmar)',
    locationVerified: false,
    currentOccupancy: 77,
    maxCapacity: 90,
    totalEntries: 0,
    totalExits: 0,
    categories: ['Musculación', 'Pilates', 'Yoga', 'Clases Grupales'],
    scheduleType: 'Diurno',
    scheduleHours: '5:00 AM - 10:00 PM',
    plans: [
      {
        name: 'One',
        priceCOP: 189000,
        description: 'Entrenamiento y clases grupales.',
        features: ['Acceso a gimnasio', 'Clases grupales'],
      },
      {
        name: 'Premium',
        priceCOP: 249000,
        description: 'Experiencia de entrenamiento premium.',
        features: ['Servicios premium', 'Clases dirigidas'],
      },
    ],
  }),
  makeGym({
    id: 'animal-x-medellin',
    name: 'Animal X · Medellín',
    brand: 'Animal X',
    neighborhood: 'El Poblado',
    latitude: 6.217,
    longitude: -75.567,
    address: 'Sector El Poblado, Medellín (dirección por confirmar)',
    locationVerified: false,
    currentOccupancy: 18,
    maxCapacity: 60,
    totalEntries: 0,
    totalExits: 0,
    categories: ['Musculación', 'Entrenamiento Funcional', 'Clases Grupales'],
    scheduleType: 'Diurno',
    scheduleHours: '5:00 AM - 10:00 PM',
    plans: [
      {
        name: 'Full',
        priceCOP: 139000,
        description: 'Entrenamiento en sede.',
        features: ['Zona de entrenamiento', 'Acceso a la sede'],
      },
      {
        name: 'Plus',
        priceCOP: 179000,
        description: 'Entrenamiento y clases grupales.',
        features: ['Clases grupales', 'Acceso ampliado'],
      },
    ],
  }),
];

const toNumber = (value, field, gymId) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new TypeError(`El campo "${field}" de la sede "${gymId}" debe ser numérico.`);
  }
  return number;
};

const normalizeGym = (rawGym) => {
  if (!rawGym || typeof rawGym !== 'object') {
    throw new TypeError('La API devolvió una sede con formato inválido.');
  }

  const id = String(rawGym.idGimnasio ?? rawGym.id ?? rawGym.gymId ?? '');
  if (!id) throw new TypeError('La API devolvió una sede sin id.');

  const position = Array.isArray(rawGym.position) ? rawGym.position : [];
  const latitude = rawGym.latitude ?? rawGym.lat ?? position[0];
  const longitude = rawGym.longitude ?? rawGym.lng ?? position[1];
  const currentOccupancy = toNumber(
    rawGym.currentOccupancy ?? rawGym.ocupacionActual ?? 0,
    'currentOccupancy',
    id,
  );
  const maxCapacity = toNumber(
    rawGym.capacidadMaxima ?? rawGym.maxCapacity ?? rawGym.capacity ?? 100,
    'maxCapacity',
    id,
  );

  if (!Number.isInteger(currentOccupancy) || currentOccupancy < 0) {
    throw new RangeError(`Aforo actual inválido para la sede "${id}".`);
  }
  if (!Number.isInteger(maxCapacity) || maxCapacity <= 0 || currentOccupancy > maxCapacity) {
    throw new RangeError(`Capacidad máxima inválida para la sede "${id}".`);
  }

  const categories = rawGym.categories ?? [];
  const rawPlans = rawGym.plans ?? [];
  if (!Array.isArray(categories) || !Array.isArray(rawPlans)) {
    throw new TypeError(`Categorías o planes inválidos para la sede "${id}".`);
  }
  const normalizedCategories = categories.map((category) => (
    typeof category === 'string' ? category : category?.name ?? category?.label
  )).filter(Boolean);
  const plans = rawPlans.map((plan) => {
    if (!plan || typeof plan !== 'object') {
      throw new TypeError(`Plan inválido para la sede "${id}".`);
    }

    const features = plan.features ?? [];
    if (!Array.isArray(features)) {
      throw new TypeError(`Características de plan inválidas para la sede "${id}".`);
    }

    return {
      ...plan,
      name: plan.name ?? plan.planName ?? 'Plan',
      priceCOP: toNumber(plan.priceCOP ?? plan.price, 'priceCOP', id),
      description: plan.description ?? '',
      features: features.map((feature) => (
        typeof feature === 'string' ? feature : feature?.name ?? feature?.description
      )).filter(Boolean),
    };
  });

  return makeGym({
    ...rawGym,
    id,
    name: rawGym.nombre ?? rawGym.gymName ?? `Sede ${id}`,
    brand: rawGym.brand ?? 'Gimnasio',
    latitude: toNumber(latitude, 'latitude', id),
    longitude: toNumber(longitude, 'longitude', id),
    address: rawGym.direccion ?? 'Dirección no disponible',
    locationVerified: rawGym.locationVerified ?? Boolean(rawGym.direccion ?? rawGym.address),
    currentOccupancy,
    maxCapacity,
    totalEntries: toNumber(rawGym.totalEntries ?? rawGym.entries ?? 0, 'totalEntries', id),
    totalExits: toNumber(rawGym.totalExits ?? rawGym.exits ?? 0, 'totalExits', id),
    categories: normalizedCategories,
    scheduleType: rawGym.scheduleType ?? 'No especificado',
    scheduleHours: rawGym.scheduleHours ?? 'Horario por confirmar',
    plans,
  });
};

const updateGymMetrics = (set, get, gymId, metrics) => {
  const gym = get().gyms.find((item) => item.id === gymId);
  if (!gym) {
    throw new Error(`No se encontró el gimnasio "${gymId}".`);
  }

  const currentOccupancy = metrics.currentOccupancy ?? gym.currentOccupancy;
  const maxCapacity = metrics.maxCapacity ?? gym.maxCapacity;
  const totalEntries = metrics.totalEntries ?? gym.totalEntries;
  const totalExits = metrics.totalExits ?? gym.totalExits;

  if (!Number.isInteger(currentOccupancy) || currentOccupancy < 0) {
    throw new RangeError('currentOccupancy debe ser un entero no negativo.');
  }
  if (!Number.isInteger(maxCapacity) || maxCapacity <= 0) {
    throw new RangeError('maxCapacity debe ser un entero mayor que cero.');
  }
  if (currentOccupancy > maxCapacity) {
    throw new RangeError('currentOccupancy no puede superar maxCapacity.');
  }
  if (!Number.isInteger(totalEntries) || totalEntries < 0) {
    throw new RangeError('totalEntries debe ser un entero no negativo.');
  }
  if (!Number.isInteger(totalExits) || totalExits < 0) {
    throw new RangeError('totalExits debe ser un entero no negativo.');
  }

  set((state) => ({
    gyms: state.gyms.map((item) => item.id === gymId
      ? {
          ...item,
          currentOccupancy,
          maxCapacity,
          totalEntries,
          totalExits,
          status: getOccupancyStatus(currentOccupancy, maxCapacity),
        }
      : item),
  }));
};

const validateAmount = (amount, direction) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new RangeError(`La cantidad de ${direction} debe ser un entero positivo.`);
  }
};

const getSelectedGym = (get) => {
  const gym = get().gyms.find((item) => item.id === get().selectedGymId);
  if (!gym) throw new Error('Selecciona un gimnasio antes de registrar el flujo.');
  return gym;
};

export const useGymStore = create((set, get) => {
  let fetchPromise;
  let stompClient;
  let occupancySubscription;
  let subscribedGymId;

  const setSocketError = (error) => {
    const message = error instanceof Error ? error.message : String(error);
    set({ socketError: message });
  };

  const applyOccupancyMessage = (gymId, message) => {
    let payload;
    try {
      payload = JSON.parse(message.body);
    } catch (error) {
      throw new Error(`Mensaje de ocupación inválido para la sede "${gymId}": ${error.message}`);
    }

    const data = payload?.data ?? payload;
    if (!data || typeof data !== 'object') {
      throw new TypeError(`Mensaje de ocupación inválido para la sede "${gymId}".`);
    }

    const messageGymId = data.gymId ?? data.gym?.id ?? data.id;
    if (messageGymId != null && String(messageGymId) !== String(gymId)) return;

    const metrics = {};
    const occupancy = data.currentOccupancy ?? data.occupancy;
    const maxCapacity = data.maxCapacity ?? data.capacity;
    const entries = data.totalEntries ?? data.entryCount ?? data.entries;
    const exits = data.totalExits ?? data.exitCount ?? data.exits;

    if (occupancy != null) metrics.currentOccupancy = toNumber(occupancy, 'currentOccupancy', gymId);
    if (maxCapacity != null) metrics.maxCapacity = toNumber(maxCapacity, 'maxCapacity', gymId);
    if (entries != null) metrics.totalEntries = toNumber(entries, 'totalEntries', gymId);
    if (exits != null) metrics.totalExits = toNumber(exits, 'totalExits', gymId);

    const eventType = String(data.eventType ?? data.type ?? '').toUpperCase();
    const isEntry = ['ENTRY', 'ENTER', 'IN'].includes(eventType);
    const isExit = ['EXIT', 'LEAVE', 'OUT'].includes(eventType);
    const amount = isEntry || isExit ? toNumber(data.amount ?? 1, 'amount', gymId) : 1;
    if ((isEntry || isExit) && (!Number.isInteger(amount) || amount <= 0)) {
      throw new RangeError(`La cantidad de flujo de "${gymId}" debe ser un entero positivo.`);
    }
    const gym = get().gyms.find((item) => item.id === gymId);
    if (!gym) return;

    if (isEntry) {
      const entered = Math.min(amount, gym.maxCapacity - gym.currentOccupancy);
      if (occupancy == null) metrics.currentOccupancy = gym.currentOccupancy + entered;
      if (entries == null) metrics.totalEntries = gym.totalEntries + entered;
    }
    if (isExit) {
      const exited = Math.min(amount, gym.currentOccupancy);
      if (occupancy == null) metrics.currentOccupancy = gym.currentOccupancy - exited;
      if (exits == null) metrics.totalExits = gym.totalExits + exited;
    }

    if (Object.keys(metrics).length === 0) {
      throw new TypeError(`El mensaje de ocupación de "${gymId}" no contiene métricas reconocidas.`);
    }

    updateGymMetrics(set, get, gymId, metrics);
  };

  const subscribeToSelectedGym = () => {
    if (!stompClient?.connected) return;

    const gymId = get().selectedGymId;
    if (!gymId || subscribedGymId === gymId) return;

    occupancySubscription?.unsubscribe();
    occupancySubscription = stompClient.subscribe(
      `/topic/gym/${encodeURIComponent(gymId)}/occupancy`,
      (message) => {
        try {
          applyOccupancyMessage(gymId, message);
          set({ socketError: null });
        } catch (error) {
          setSocketError(error);
        }
      },
    );
    subscribedGymId = gymId;
    set({ socketStatus: 'connected', socketError: null });
  };

  const connectOccupancySocket = () => {
    if (stompClient?.active) return;

    set({ socketStatus: 'connecting', socketError: null });
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        if (stompClient !== client) return;
        subscribedGymId = null;
        subscribeToSelectedGym();
      },
      onStompError: (frame) => {
        if (stompClient !== client) return;
        set({
          socketStatus: 'error',
          socketError: frame.headers.message || 'El servidor WebSocket reportó un error.',
        });
      },
      onWebSocketError: () => {
        if (stompClient !== client) return;
        set({
          socketStatus: 'error',
          socketError: 'No fue posible conectar con el servidor de ocupación.',
        });
      },
      onWebSocketClose: () => {
        if (stompClient !== client) return;
        occupancySubscription = null;
        subscribedGymId = null;
        set({ socketStatus: 'connecting' });
      },
    });
    stompClient = client;
    stompClient.activate();
  };

  const recordEntries = (amount = 1) => {
    validateAmount(amount, 'entradas');
    const gym = getSelectedGym(get);
    const entered = Math.min(amount, gym.maxCapacity - gym.currentOccupancy);

    updateGymMetrics(set, get, gym.id, {
      currentOccupancy: gym.currentOccupancy + entered,
      totalEntries: gym.totalEntries + entered,
    });
  };

  const recordExits = (amount = 1) => {
    validateAmount(amount, 'salidas');
    const gym = getSelectedGym(get);
    const exited = Math.min(amount, gym.currentOccupancy);

    updateGymMetrics(set, get, gym.id, {
      currentOccupancy: gym.currentOccupancy - exited,
      totalExits: gym.totalExits + exited,
    });
  };

  return {
    gyms: initialGyms,
    selectedGymId: initialGyms[0].id,
    mapFocusGymId: initialGyms[0].id,
    loading: true,
    loadError: null,
    socketStatus: 'disconnected',
    socketError: null,

    fetchGyms: () => {
      if (fetchPromise) return fetchPromise;

      set({ loading: true, loadError: null });
      fetchPromise = fetch(API_URL)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`La API de gimnasios respondió HTTP ${response.status}.`);
          }

          const body = await response.json();
          const gyms = Array.isArray(body)
            ? body
            : body?.data ?? body?.gyms ?? body?.content;
          if (!Array.isArray(gyms)) {
            throw new TypeError('La API debe devolver un arreglo de gimnasios o un objeto { data: [] }.');
          }

          const normalizedGyms = gyms.map(normalizeGym);
          if (normalizedGyms.length === 0) {
            throw new Error('La API no devolvió gimnasios.');
          }

          const currentId = get().selectedGymId;
          const selectedGymId = normalizedGyms.some((gym) => gym.id === currentId)
            ? currentId
            : normalizedGyms[0].id;
          set({
            gyms: normalizedGyms,
            selectedGymId,
            mapFocusGymId: selectedGymId,
            loading: false,
            loadError: null,
          });
          return true;
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : String(error);
          set({ loading: false, loadError: message });
          return false;
        })
        .finally(() => {
          fetchPromise = null;
        });

      return fetchPromise;
    },

    connectOccupancySocket,

    disconnectOccupancySocket: () => {
      occupancySubscription?.unsubscribe();
      occupancySubscription = null;
      subscribedGymId = null;
      if (stompClient?.active) stompClient.deactivate();
      stompClient = null;
      set({ socketStatus: 'disconnected' });
    },

    selectGym: (gymId) => {
      if (!get().gyms.some((gym) => gym.id === gymId)) {
        throw new Error(`No se encontró el gimnasio "${gymId}".`);
      }
      set({ selectedGymId: gymId, mapFocusGymId: gymId });
      subscribeToSelectedGym();
    },

    focusGym: (gymId) => {
      if (!get().gyms.some((gym) => gym.id === gymId)) {
        throw new Error(`No se encontró el gimnasio "${gymId}".`);
      }
      set({ mapFocusGymId: gymId });
    },

    enterGym: recordEntries,
    exitGym: recordExits,
    simulateEntry: recordEntries,
    simulateExit: recordExits,

    // Permite conectar más adelante actualizaciones de la API o de un WebSocket.
    updateMetrics: (gymId, metrics) => updateGymMetrics(set, get, gymId, metrics),
  };
});
