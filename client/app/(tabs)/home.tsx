import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth"; // Adjust the import path as necessary

// Define the type for your navigation routes
type RootStackParamList = {
  Movies: undefined;
  Clients: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { signOut, userProfile } = useAuth();

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-vector/neon-lined-pattern-dark-background-vector_53876-173384.jpg?t=st=1732031024~exp=1732034624~hmac=a4df4469c32965bbd7c220dced2cee2bd0a3d0ded526e84f2805420d0f006a02&w=740",
      }} // Replace with your own background image URL
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        {userProfile && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>{userProfile.username}</Text>
            <Text style={styles.userInfoText}>({userProfile.role})</Text>
          </View>
        )}
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Welcome to Movie Rentals</Text>
          <Text style={styles.subtitle}>
            Find your favorite movies to rent!
          </Text>
        </View>

        {/* Call to Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate("Movies")}
          >
            <Text style={styles.buttonText}>Browse Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("Clients")}
          >
            <Text style={styles.buttonText}>All Clients</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
  welcomeContainer: {
    marginTop: 60,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  featuredContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  movieCard: {
    marginRight: 16,
    width: 220,
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  movieImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#FFA001",
  },
  secondaryButton: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginRight: 10,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
});
