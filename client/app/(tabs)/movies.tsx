import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  ActivityIndicator,
  TextInput,
  Modal,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useMoviesStore from "../../hooks/useMoviesStore";
import useRentalsStore from "../../hooks/useRentalsStore";
import { useGlobalContext } from "@/context/GlobalProvider";

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

export default function MoviesScreen() {
  const {
    movies,
    loading,
    error,
    fetchMovies,
    addMovie,
    updateMovie,
    deleteMovie,
  } = useMoviesStore();
  const { userProfile, isAdmin } = useGlobalContext();
  const { rentMovie } = useRentalsStore();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [isModalVisible, setModalVisible] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    director: "",
    duration: "",
    rating: "",
    description: "",
    actors: "",
  });

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const resetFilters = () => {
    setSearch("");
    setGenre("");
    setSortBy("title");
  };

  const handleRentMovie = async (movie: Movie) => {
    const clientId = userProfile?._id;

    if (clientId) {
      try {
        await rentMovie(clientId, movie._id);
        await fetchMovies(); // Fetch movies to update the list
      } catch (error) {
        console.error("Error renting movie:", error);
      }
    } else {
      console.error("Client ID is undefined");
    }
  };

  const handleAddMovie = async () => {
    if (!isAdmin) {
      console.error("Only admins can add movies");
      return;
    }
    if (Number(movieData.rating) < 1 || Number(movieData.rating) > 10) {
      Alert.alert("Validation Error", "Rating must be between 1 and 10");
      return;
    }
    try {
      await addMovie({
        ...movieData,
        duration: Number(movieData.duration),
        rating: Number(movieData.rating),
        actors: movieData.actors.split(","),
      });
      setModalVisible(false);
      setMovieData({
        title: "",
        genre: "",
        director: "",
        duration: "",
        rating: "",
        description: "",
        actors: "",
      });
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleUpdateMovie = async () => {
    if (!isAdmin) {
      console.error("Only admins can update movies");
      return;
    }
    if (Number(movieData.rating) < 1 || Number(movieData.rating) > 10) {
      Alert.alert("Validation Error", "Rating must be between 1 and 10");
      return;
    }
    if (selectedMovie) {
      try {
        await updateMovie(selectedMovie._id, {
          ...movieData,
          duration: Number(movieData.duration),
          rating: Number(movieData.rating),
          actors: movieData.actors.split(","),
        });
        setSelectedMovie(null);
        setModalVisible(false);
      } catch (error) {
        console.error("Error updating movie:", error);
      }
    }
  };

  const handleDeleteMovie = async (id: string, available: boolean) => {
    if (!isAdmin) {
      console.error("Only admins can delete movies");
      return;
    }
    if (!available) {
      Alert.alert(
        "Cannot Delete",
        "This movie is currently rented and cannot be deleted."
      );
      return;
    }
    try {
      await deleteMovie(id);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const openModal = (movie?: Movie) => {
    if (movie) {
      setMovieData({
        title: movie.title,
        genre: movie.genre,
        director: movie.director,
        duration: movie.duration.toString(),
        rating: movie.rating.toString(),
        description: movie.description,
        actors: movie.actors.join(","),
      });
      setSelectedMovie(movie);
    } else {
      setMovieData({
        title: "",
        genre: "",
        director: "",
        duration: "",
        rating: "",
        description: "",
        actors: "",
      });
      setSelectedMovie(null);
    }
    setModalVisible(true);
  };

  const filteredMovies = movies
    .filter((movie) => movie.available)
    .filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase()))
    .filter((movie) => (genre ? movie.genre === genre : true))
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => openModal(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.genre}>{item.genre}</Text>
      <Text style={styles.details}>
        {item.director} • {item.duration} min • Rating: {item.rating}/10
      </Text>
      {item.available && (
        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => handleRentMovie(item)}
        >
          <Text style={styles.rentButtonText}>Rent</Text>
        </TouchableOpacity>
      )}
      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMovie(item._id, item.available)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
            Duration: {selectedMovie.duration} min
          </Text>
          <Text style={styles.detailsText}>
            Rating: {selectedMovie.rating}/10
          </Text>
          <Text style={styles.detailsText}>
            Description: {selectedMovie.description}
          </Text>
          <Text style={styles.detailsText}>
            Actors: {selectedMovie.actors.join(", ")}
          </Text>
          <Text style={styles.detailsText}>
            Added: {new Date(selectedMovie.addedDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedMovie(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to list</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title"
              value={search}
              onChangeText={setSearch}
            />
            <Picker
              selectedValue={genre}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setGenre(itemValue);
                if (itemValue === "") {
                  resetFilters();
                }
              }}
            >
              <Picker.Item label="All Genres" value="" />
              <Picker.Item label="Sci-Fi" value="Sci-Fi" />
              <Picker.Item label="Crime" value="Crime" />
              <Picker.Item label="Action" value="Action" />
              {/* Add more genres as needed */}
            </Picker>
            <Picker
              selectedValue={sortBy}
              style={styles.picker}
              onValueChange={(itemValue) => setSortBy(itemValue)}
            >
              <Picker.Item label="Sort by Title" value="title" />
              <Picker.Item label="Sort by Rating" value="rating" />
            </Picker>
          </View>
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          {isAdmin && <Button title="Add Movie" onPress={() => openModal()} />}
          <FlatList
            data={filteredMovies}
            renderItem={renderMovie}
            keyExtractor={(item) => item._id}
            contentContainerStyle={[styles.list, { paddingBottom: 200 }]}
          />
        </View>
      )}
      <Modal visible={isModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={movieData.title}
            onChangeText={(text) => setMovieData({ ...movieData, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Genre"
            value={movieData.genre}
            onChangeText={(text) => setMovieData({ ...movieData, genre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Director"
            value={movieData.director}
            onChangeText={(text) =>
              setMovieData({ ...movieData, director: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (in minutes)"
            value={movieData.duration}
            onChangeText={(text) =>
              setMovieData({ ...movieData, duration: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Rating (1-10)"
            value={movieData.rating}
            onChangeText={(text) =>
              setMovieData({ ...movieData, rating: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={movieData.description}
            onChangeText={(text) =>
              setMovieData({ ...movieData, description: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Actors (comma separated)"
            value={movieData.actors}
            onChangeText={(text) =>
              setMovieData({ ...movieData, actors: text })
            }
          />
          {isAdmin && (
            <View style={styles.updateBtn}>
              <Button
                title={selectedMovie ? "Update Movie" : "Add Movie"}
                onPress={selectedMovie ? handleUpdateMovie : handleAddMovie}
              />
            </View>
          )}
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </ScrollView>
      </Modal>
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
  updateBtn: {
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  resetButton: {
    padding: 10,
    backgroundColor: "#FF6347",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  rentButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
