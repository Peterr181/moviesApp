import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import useRentalsStore from "../../hooks/useRentalsStore";
import useMoviesStore from "../../hooks/useMoviesStore";
import { useGlobalContext } from "../../context/GlobalProvider";

interface Rental {
  _id: string;
  clientId:
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      }
    | string;
  movieId:
    | {
        _id: string;
        title: string;
        genre: string;
        director: string;
      }
    | string;
  rentalDate: string;
  returnDate: string;
  actualReturnDate?: string;
  returned: boolean;
}

const Rentals: React.FC = () => {
  const { rentals, fetchRentals, returnMovie } = useRentalsStore();
  const { fetchMovies } = useMoviesStore();
  const { userProfile, isAdmin } = useGlobalContext();
  const [search, setSearch] = useState<string>("");
  const [sortedRentals, setSortedRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    const rentalsWithDetails = rentals
      .filter(
        (rental) =>
          isAdmin ||
          (typeof rental.clientId !== "string" &&
            rental.clientId._id === userProfile?._id)
      )
      .map((rental) => ({
        ...rental,
        clientId:
          typeof rental.clientId === "string"
            ? { _id: rental.clientId, firstName: "", lastName: "", email: "" }
            : rental.clientId,
        movieId:
          typeof rental.movieId === "string"
            ? { _id: rental.movieId, title: "", genre: "", director: "" }
            : rental.movieId,
      }));

    setSortedRentals(rentalsWithDetails);
  }, [rentals, isAdmin, userProfile]);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredRentals = rentals.filter(
      (rental) =>
        (typeof rental.clientId !== "string" &&
          (rental.clientId.firstName
            .toLowerCase()
            .includes(text.toLowerCase()) ||
            rental.clientId.lastName
              .toLowerCase()
              .includes(text.toLowerCase()) ||
            rental.clientId.email
              .toLowerCase()
              .includes(text.toLowerCase()))) ||
        (typeof rental.movieId !== "string" &&
          (rental.movieId._id.includes(text) ||
            rental.movieId.title.toLowerCase().includes(text.toLowerCase()))) ||
        rental.rentalDate.includes(text)
    );
    setSortedRentals(filteredRentals);
  };

  const handleSort = (key: keyof Rental) => {
    const sorted = [...sortedRentals].sort((a, b) =>
      a[key] > b[key] ? 1 : -1
    );
    setSortedRentals(sorted);
  };

  const handleReturnMovie = async (rentalId: string) => {
    await returnMovie(rentalId);
    setSortedRentals((prevRentals) =>
      prevRentals.map((rental) =>
        rental._id === rentalId
          ? {
              ...rental,
              returned: true,
            }
          : rental
      )
    );
    await fetchMovies(); // Fetch movies to update the list
  };

  const renderItem = ({ item }: { item: Rental }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text>
        Customer:{" "}
        {typeof item.clientId !== "string"
          ? `${item.clientId.firstName} ${item.clientId.lastName} (${item.clientId.email})`
          : "Unknown"}
      </Text>
      <Text>
        Movie:{" "}
        {typeof item.movieId !== "string" ? item.movieId.title : "Unknown"}
      </Text>
      <Text>Rental Date: {new Date(item.rentalDate).toLocaleString()}</Text>
      <Text>
        Planned Return Date: {new Date(item.returnDate).toLocaleString()}
      </Text>
      <Text>
        Actual Return Date:{" "}
        {item.actualReturnDate
          ? new Date(item.actualReturnDate).toLocaleString()
          : "Not returned yet"}
      </Text>
      {isAdmin && !item.returned && (
        <TouchableOpacity onPress={() => handleReturnMovie(item._id)}>
          <Text style={{ color: "blue" }}>Return Movie</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search by customer, movie ID, title, or rental date"
        value={search}
        onChangeText={handleSearch}
        style={{
          marginBottom: 20,
          marginTop: 40,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Button
          title="Sort by Customer"
          onPress={() => handleSort("clientId")}
        />
        <Button
          title="Sort by Rental Date"
          onPress={() => handleSort("rentalDate")}
        />
      </View>
      <FlatList
        data={sortedRentals}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Rentals;
