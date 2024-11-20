import { create } from "zustand";
import axios from "axios";

const apiUrl = "http://192.168.0.106:5000/api/movies";

interface Movie {
  _id: string;
  title: string;
  genre: string;
  director: string;
  duration: number;
  rating: number;
  description: string;
  actors: string[];
  addedDate: string;
  available: boolean;
}

interface MoviesStore {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  fetchMovies: () => Promise<void>;
  addMovie: (
    movie: Omit<Movie, "_id" | "addedDate" | "available">
  ) => Promise<void>;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
}

const useMoviesStore = create<MoviesStore>((set) => ({
  movies: [],
  loading: false,
  error: null,

  fetchMovies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(apiUrl);
      set({ movies: response.data, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },

  addMovie: async (movie) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(apiUrl, movie);
      set((state) => ({
        movies: [...state.movies, response.data],
        loading: false,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },

  updateMovie: async (id, updatedMovie) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedMovie);
      set((state) => ({
        movies: state.movies.map((movie) =>
          movie._id === id ? response.data : movie
        ),
        loading: false,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },

  deleteMovie: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${apiUrl}/${id}`);
      set((state) => ({
        movies: state.movies.filter((movie) => movie._id !== id),
        loading: false,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "An unexpected error occurred", loading: false });
      }
    }
  },
}));

export default useMoviesStore;
