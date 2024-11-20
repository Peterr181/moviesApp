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
  fetchClients: () => Promise<void>;
};

const useClientsStore = create<ClientsStore>((set) => ({
  clients: [],
  fetchClients: async () => {
    try {
      const response = await axios.get("http://192.168.0.106:5000/api/clients");
      set({ clients: response.data });
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  },
}));

export default useClientsStore;
