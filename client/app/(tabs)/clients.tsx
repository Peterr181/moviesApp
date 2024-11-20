import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  TextInput,
  Modal,
  Button,
} from "react-native";
import useClientsStore from "../../hooks/useClientsStore";
import { useGlobalContext } from "../../context/GlobalProvider";

// Define the Client type
type Client = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  registrationDate: string;
};

export default function ClientsScreen() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "", // Add email field
    address: "",
    phone: "",
  });
  const {
    clients,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    error,
  } = useClientsStore();
  const { isAdmin } = useGlobalContext();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = () => {
    if (isAdmin) {
      addClient(newClient);
      setIsModalVisible(false);
      setNewClient({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
      });
    }
  };

  const handleUpdateClient = () => {
    if (isAdmin && selectedClient) {
      updateClient(selectedClient._id, newClient);
      setIsUpdateModalVisible(false);
      setSelectedClient(null); // Move back to client list view
    }
  };

  const handleDeleteClient = async () => {
    if (isAdmin && selectedClient) {
      await deleteClient(selectedClient._id);
      if (!error) {
        setSelectedClient(null);
      }
    }
  };

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
          {isAdmin && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setNewClient({
                    firstName: selectedClient.firstName,
                    lastName: selectedClient.lastName,
                    email: selectedClient.email,
                    address: selectedClient.address,
                    phone: selectedClient.phone,
                  });
                  setIsUpdateModalVisible(true);
                }}
                style={styles.updateButton}
              >
                <Text style={styles.buttonText}>Update Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteClient}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete Client</Text>
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          <TouchableOpacity
            onPress={() => setSelectedClient(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to list</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isAdmin && (
            <>
              <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={newClient.firstName}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, firstName: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={newClient.lastName}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, lastName: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email" // Add email input
                    value={newClient.email}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, email: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={newClient.address}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, address: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={newClient.phone}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, phone: text })
                    }
                  />
                  <Button title="Add Client" onPress={handleAddClient} />
                  <Button
                    title="Cancel"
                    onPress={() => setIsModalVisible(false)}
                  />
                </View>
              </Modal>
              <Modal
                visible={isUpdateModalVisible}
                animationType="slide"
                onRequestClose={() => setIsUpdateModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={newClient.firstName}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, firstName: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={newClient.lastName}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, lastName: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={newClient.email}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, email: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={newClient.address}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, address: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={newClient.phone}
                    onChangeText={(text) =>
                      setNewClient({ ...newClient, phone: text })
                    }
                  />
                  <Button title="Update Client" onPress={handleUpdateClient} />
                  <Button
                    title="Cancel"
                    onPress={() => setIsUpdateModalVisible(false)}
                  />
                </View>
              </Modal>
            </>
          )}
          <FlatList
            data={clients}
            renderItem={renderClient}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Add Client</Text>
          </TouchableOpacity>
        </>
      )}
      {isUpdateModalVisible && (
        <Modal
          visible={isUpdateModalVisible}
          animationType="slide"
          onRequestClose={() => setIsUpdateModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newClient.firstName}
              onChangeText={(text) =>
                setNewClient({ ...newClient, firstName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={newClient.lastName}
              onChangeText={(text) =>
                setNewClient({ ...newClient, lastName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newClient.email}
              onChangeText={(text) =>
                setNewClient({ ...newClient, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newClient.address}
              onChangeText={(text) =>
                setNewClient({ ...newClient, address: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newClient.phone}
              onChangeText={(text) =>
                setNewClient({ ...newClient, phone: text })
              }
            />
            <Button title="Update Client" onPress={handleUpdateClient} />
            <Button
              title="Cancel"
              onPress={() => setIsUpdateModalVisible(false)}
            />
          </View>
        </Modal>
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
  addButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffc107",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
