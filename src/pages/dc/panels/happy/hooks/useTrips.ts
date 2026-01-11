// 行程 CRUD 操作 Hook
import { useState, useCallback } from 'react';
import { Trip } from '../types';
import {
  loadTrips,
  createTrip as createTripStorage,
  updateTrip as updateTripStorage,
  deleteTrip as deleteTripStorage,
  getTrip,
} from '../storage';

export interface UseTripsReturn {
  trips: Trip[];
  createTrip: (name: string, startDate: string, totalDays: number, hasPreparation: boolean) => Trip;
  updateTrip: (tripId: string, updates: Partial<Trip>) => Trip | null;
  deleteTrip: (tripId: string) => void;
  getTrip: (tripId: string) => Trip | null;
  refreshTrips: () => void;
}

export const useTrips = (): UseTripsReturn => {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());

  const refreshTrips = useCallback(() => {
    setTrips(loadTrips());
  }, []);

  const createTrip = useCallback(
    (name: string, startDate: string, totalDays: number, hasPreparation: boolean): Trip => {
      const newTrip = createTripStorage(name, startDate, totalDays, hasPreparation);
      setTrips((prev) => [...prev, newTrip]);
      return newTrip;
    },
    []
  );

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>): Trip | null => {
    const updated = updateTripStorage(tripId, updates);
    if (updated) {
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
    }
    return updated;
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    deleteTripStorage(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  }, []);

  const getTripById = useCallback((tripId: string): Trip | null => {
    return getTrip(tripId);
  }, []);

  return {
    trips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTrip: getTripById,
    refreshTrips,
  };
};

export default useTrips;
