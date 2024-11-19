import { Stack } from "expo-router";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, MoviesIcon, UsersIcon } from "../../constants/icons";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      >
        {() => (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="home" options={{ title: "Home" }} />
          </Stack>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ color, size }) => (
            <MoviesIcon color={color} size={size} />
          ),
        }}
      >
        {() => (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="movies" options={{ title: "Movies" }} />
          </Stack>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ color, size }) => (
            <UsersIcon color={color} size={size} />
          ),
        }}
      >
        {() => (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="clients" options={{ title: "Clients" }} />
          </Stack>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
