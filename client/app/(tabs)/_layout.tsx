import { Stack } from "expo-router";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, MoviesIcon, UsersIcon } from "../../constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const { isAdmin } = useGlobalContext();
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

      {isAdmin && (
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
      )}
      <Tab.Screen
        name="Rentals"
        options={{
          title: "Rentals",
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
            <Stack.Screen name="rentals" options={{ title: "Rentals" }} />
          </Stack>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
