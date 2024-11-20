import { create } from "zustand";
import axios from "axios";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  registrationDate: string;
};

type ClientsStore = {
  clients: Client[];
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, "id" | "registrationDate">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
};

const useClientsStore = create<ClientsStore>((set) => ({
  clients: [],
  error: null,
  fetchClients: async () => {
    try {
      const response = await axios.get("http://192.168.0.106:5000/api/clients");
      set({ clients: response.data, error: null });
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  },
  addClient: async (client) => {
    try {
      const response = await axios.post(
        "http://192.168.0.106:5000/api/clients",
        client
      );
      set((state) => ({
        clients: [...state.clients, response.data],
        error: null,
      }));
    } catch (error) {
      console.error("Failed to add client", error);
    }
  },
  updateClient: async (id, client) => {
    try {
      const response = await axios.put(
        `http://192.168.0.106:5000/api/clients/${id}`,
        client
      );
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? response.data : c)),
        error: null,
      }));
      // Fetch updated list of clients
      const updatedResponse = await axios.get(
        "http://192.168.0.106:5000/api/clients"
      );
      set({ clients: updatedResponse.data });
    } catch (error) {
      console.error("Failed to update client", error);
    }
  },
  deleteClient: async (id) => {
    try {
      await axios.delete(`http://192.168.0.106:5000/api/clients/${id}`);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        error: null,
      }));
      // Fetch updated list of clients
      const response = await axios.get("http://192.168.0.106:5000/api/clients");
      set({ clients: response.data });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        set({ error: error.response.data.error });
      } else {
        console.error("Failed to delete client", error);
      }
    }
  },
}));

export default useClientsStore;
