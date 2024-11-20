import { create } from "zustand";
import axios from "axios";
import useMoviesStore from "./useMoviesStore"; // Import useMoviesStore

const API_URL = "http://192.168.0.106:5000/api";

interface Rental {
  _id: string;
  clientId: string;
  movieId: string;
  rentalDate: string;
  returnDate: string;
  actualReturnDate?: string;
  returned: boolean;
}

interface RentalsStore {
  rentals: Rental[];
  loading: boolean;
  error: string | null;
  fetchRentals: () => Promise<void>;
  rentMovie: (clientId: string, movieId: string) => Promise<void>;
  returnMovie: (rentalId: string) => Promise<void>;
}

const useRentalsStore = create<RentalsStore>((set) => ({
  rentals: [],
  loading: false,
  error: null,
  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/rentals`);
      set({ rentals: response.data, loading: false });
    } catch (error) {
      set({ error: (error as any).message, loading: false });
    }
  },
  rentMovie: async (clientId, movieId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/rentals`, {
        clientId,
        movieId,
      });
      const newRental: Rental = response.data;
      set((state) => ({
        rentals: [...state.rentals, newRental],
        loading: false,
      }));
      // Update movie availability
      await axios.put(`${API_URL}/movies/${movieId}`, { available: false });
      // Fetch updated rentals list
      await useRentalsStore.getState().fetchRentals();
    } catch (error) {
      set({ error: (error as any).message, loading: false });
    }
  },
  returnMovie: async (rentalId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/rentals/${rentalId}/return`);
      const returnedRental: Rental = response.data;
      set((state) => ({
        rentals: state.rentals.map((rental) =>
          rental._id === rentalId ? returnedRental : rental
        ),
        loading: false,
      }));
      // Update movie availability
      await axios.put(`${API_URL}/movies/${returnedRental.movieId}`, {
        available: true,
      });
      // Fetch updated rentals list
      await useRentalsStore.getState().fetchRentals();
      // Fetch updated movies list
      const { fetchMovies } = useMoviesStore.getState();
      await fetchMovies();
    } catch (error) {
      set({ error: (error as any).message, loading: false });
    }
  },
}));

export default useRentalsStore;
