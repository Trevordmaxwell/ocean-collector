import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Platform, StyleSheet, Text, View } from "react-native";

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
const tabIcons: Record<keyof MainTabParamList, string> = {
  Home: "🏠",
  Collection: "🐚",
  Rewards: "⭐",
  Settings: "⚙️",
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.deep,
        tabBarInactiveTintColor: palette.mist,
        tabBarStyle:
          Platform.OS === "web"
            ? {
                position: "relative",
                height: 92,
                marginHorizontal: spacing.md,
                marginBottom: spacing.md,
                paddingHorizontal: spacing.xs,
                paddingBottom: spacing.xs,
                paddingTop: spacing.xs,
                borderRadius: radius.lg,
                backgroundColor: "rgba(255, 253, 248, 0.98)",
                borderWidth: 1,
                borderColor: "rgba(143, 201, 232, 0.28)",
                borderTopWidth: 0,
                ...shadows.card,
              }
            : {
                position: "absolute",
                left: spacing.md,
                right: spacing.md,
                bottom: spacing.sm,
                height: 92,
                paddingHorizontal: spacing.xs,
                paddingBottom: spacing.sm,
                paddingTop: spacing.xs,
                borderRadius: radius.lg,
                backgroundColor: "rgba(255, 253, 248, 0.96)",
                borderWidth: 1,
                borderColor: "rgba(143, 201, 232, 0.24)",
                borderTopWidth: 0,
                ...shadows.card,
              },
        tabBarItemStyle: {
          paddingVertical: spacing.xxs,
          marginHorizontal: spacing.xxs,
          borderRadius: radius.md,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito_700Bold",
          fontSize: 12,
          marginTop: 0,
        },
        tabBarButton: ({ children, onPress, onLongPress, style, accessibilityState }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={onPress}
            onLongPress={onLongPress}
            style={style}
          >
            {children}
          </Pressable>
        ),
        tabBarIcon: ({ focused }) => (
          <View style={[styles.tabIconBubble, focused && styles.tabIconBubbleActive]}>
            <Text style={styles.tabIconEmoji}>{tabIcons[route.name]}</Text>
          </View>
        ),
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

const styles = StyleSheet.create({
  tabIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(143, 201, 232, 0.12)",
  },
  tabIconBubbleActive: {
    backgroundColor: "rgba(143, 201, 232, 0.24)",
    transform: [{ translateY: -1 }],
  },
  tabIconEmoji: {
    fontSize: 20,
  },
});
