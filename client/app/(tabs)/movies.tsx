import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";

// Przykładowe dane filmów
const movies = [
  {
    id: "1",
    title: "Inception",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    duration: "148 min",
    rating: 9,
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology.",
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
    addedDate: "2020-01-01",
  },
  {
    id: "2",
    title: "The Godfather",
    genre: "Crime",
    director: "Francis Ford Coppola",
    duration: "175 min",
    rating: 10,
    description:
      "The aging patriarch of an organized crime dynasty transfers control to his son.",
    actors: "Marlon Brando, Al Pacino, James Caan",
    addedDate: "2019-06-15",
  },
  // Dodaj więcej filmów, aby przetestować widok
];

interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;
  duration: string;
  rating: number;
  description: string;
  actors: string;
  addedDate: string;
}

export default function MoviesScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => setSelectedMovie(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.genre}>{item.genre}</Text>
      <Text style={styles.details}>
        {item.director} • {item.duration} • Rating: {item.rating}/10
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedMovie ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedMovie.title}</Text>
          <Text style={styles.detailsGenre}>{selectedMovie.genre}</Text>
          <Text style={styles.detailsText}>
            Director: {selectedMovie.director}
          </Text>
          <Text style={styles.detailsText}>
            Duration: {selectedMovie.duration}
          </Text>
          <Text style={styles.detailsText}>
            Rating: {selectedMovie.rating}/10
          </Text>
          <Text style={styles.detailsText}>
            Description: {selectedMovie.description}
          </Text>
          <Text style={styles.detailsText}>Actors: {selectedMovie.actors}</Text>
          <Text style={styles.detailsText}>
            Added: {selectedMovie.addedDate}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedMovie(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to list</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
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
  movieItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  genre: {
    fontSize: 14,
    color: "#555",
  },
  details: {
    fontSize: 12,
    color: "#777",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsGenre: {
    fontSize: 18,
    color: "#555",
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
