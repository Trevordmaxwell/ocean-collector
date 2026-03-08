import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CollectionItemScreen } from "../screens/CollectionItemScreen";
import { CollectionScreen } from "../screens/CollectionScreen";
import { FactsScreen } from "../screens/FactsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { IdentifyScreen } from "../screens/IdentifyScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import { AddSeaGlassScreen } from "../screens/AddSeaGlassScreen";
import { AddTrashScreen } from "../screens/AddTrashScreen";
import { RewardsScreen } from "../screens/RewardsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, shadows, spacing } from "../theme";
import type { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.deep,
        tabBarInactiveTintColor: palette.mist,
        tabBarStyle: {
          position: "absolute",
          left: spacing.md,
          right: spacing.md,
          bottom: spacing.sm,
          height: 92,
          paddingBottom: spacing.sm,
          paddingTop: spacing.xs,
          borderRadius: radius.lg,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderTopWidth: 0,
          ...shadows.card,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito_700Bold",
          fontSize: 13,
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Ionicons name="home" size={size} color={color} />;
            case "Collection":
              return <Ionicons name="albums" size={size} color={color} />;
            case "Rewards":
              return (
                <MaterialCommunityIcons name="star-four-points" size={size} color={color} />
              );
            case "Settings":
              return <Ionicons name="settings" size={size} color={color} />;
          }
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Collection" component={CollectionScreen} />
      <Tabs.Screen name="Rewards" component={RewardsScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const hasSeenWelcome = useOceanStore((state) => state.hasSeenWelcome);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.sand,
          primary: palette.deep,
          text: palette.ink,
          card: palette.pearl,
          border: "transparent",
        },
      }}
    >
      <Stack.Navigator
        initialRouteName={hasSeenWelcome ? "MainTabs" : "Welcome"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Identify" component={IdentifyScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="AddSeaGlass" component={AddSeaGlassScreen} />
        <Stack.Screen name="AddTrash" component={AddTrashScreen} />
        <Stack.Screen name="Facts" component={FactsScreen} />
        <Stack.Screen name="CollectionItem" component={CollectionItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
