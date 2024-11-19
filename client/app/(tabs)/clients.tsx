import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";

// Define the Client type
type Client = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  registrationDate: string;
};

// Przykładowe dane klientów
const clients: Client[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Springfield",
    phone: "123-456-789",
    registrationDate: "2023-01-01",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Elm St, Metropolis",
    phone: "987-654-321",
    registrationDate: "2022-10-15",
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Johnson",
    address: "789 Oak St, Gotham",
    phone: "555-555-555",
    registrationDate: "2021-05-20",
  },
  // Dodaj więcej klientów, aby przetestować widok
];

export default function ClientsScreen() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const renderClient: ListRenderItem<Client> = ({ item }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => setSelectedClient(item)}
    >
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedClient ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsName}>
            {selectedClient.firstName} {selectedClient.lastName}
          </Text>
          <Text style={styles.detailsText}>
            Address: {selectedClient.address}
          </Text>
          <Text style={styles.detailsText}>Phone: {selectedClient.phone}</Text>
          <Text style={styles.detailsText}>
            Registered: {selectedClient.registrationDate}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedClient(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to list</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  clientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "#555",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
