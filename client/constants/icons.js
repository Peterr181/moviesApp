import React from "react";
import { Image } from "react-native";
import home from "../assets/icons/home.png";
import movies from "../assets/icons/movies.png";
import users from "../assets/icons/users.png";

export const HomeIcon = ({ color, size }) => (
  <Image source={home} style={{ width: size, height: size }} />
);

export const MoviesIcon = ({ color, size }) => (
  <Image source={movies} style={{ width: size, height: size }} />
);

export const UsersIcon = ({ color, size }) => (
  <Image source={users} style={{ width: size, height: size }} />
);
