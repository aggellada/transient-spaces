import { create } from "zustand";
import api from "../lib/utils";

interface LocationState {
  placeId: string | null;
  placeName: string | null;
  isSyncing: boolean;
  syncUserLocation: (lat: number, lng: number) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  placeId: null,
  placeName: null,
  isSyncing: false,

  syncUserLocation: async (lat: number, lng: number) => {
    set({ isSyncing: true });
    try {
      const response = await api.post("/location", { lat, lng });

      set({
        placeId: response.data.data.placeId,
        placeName: response.data.data.placeName,
      });
    } catch (error) {
      console.error("Error in syncUserLocation store", error);
    } finally {
      set({ isSyncing: false });
    }
  },
}));
