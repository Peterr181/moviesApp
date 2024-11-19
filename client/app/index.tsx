import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

const Welcome = () => {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-vector/neon-lined-pattern-dark-background-vector_53876-173384.jpg?t=st=1732031024~exp=1732034624~hmac=a4df4469c32965bbd7c220dced2cee2bd0a3d0ded526e84f2805420d0f006a02&w=740",
        }}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.innerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Discover Movies with{" "}
                <Text style={styles.highlight}>MoviTime</Text>
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Browse amazing movies here for free
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                title="Continue with Email"
                onPress={() => router.push("/sign-in")}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollView: {
    height: "100%",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginTop: 50,
  },
  title: {
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  highlight: {
    color: "#FFD700",
  },
  subtitle: {
    fontSize: 16,
    color: "#D3D3D3",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 21,
  },
});

export default Welcome;
