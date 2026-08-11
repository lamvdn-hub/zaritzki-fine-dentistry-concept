'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_LOCATION,
  PRACTICES,
  getPractice,
  type LocationId,
  type Practice,
} from '@/lib/locations';

const STORAGE_KEY = 'zaritzki.practice';

type LocationContextValue = {
  locationId: LocationId;
  practice: Practice;
  setLocation: (id: LocationId) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

function isLocationId(value: unknown): value is LocationId {
  return typeof value === 'string' && value in PRACTICES;
}

export function LocationProvider({
  children,
  initialLocation,
}: {
  children: React.ReactNode;
  initialLocation?: LocationId;
}) {
  const [locationId, setLocationId] = useState<LocationId>(initialLocation ?? DEFAULT_LOCATION);

  // Restore only when the server did not already choose via ?praxis=,
  // and only after hydration so server and client markup match.
  useEffect(() => {
    if (initialLocation) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocationId(stored)) setLocationId(stored);
  }, [initialLocation]);

  const setLocation = useCallback((id: LocationId) => {
    setLocationId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Private browsing can refuse storage. The switch must still work.
    }
  }, []);

  return (
    <LocationContext.Provider value={{ locationId, practice: getPractice(locationId), setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}
