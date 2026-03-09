import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { CollectionCategory, LibraryCategory } from "../types/models";

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Identify: { category: LibraryCategory };
  Library: { category: LibraryCategory; initialQuery?: string };
  ItemDetail: { category: LibraryCategory; id: string };
  AddSeaGlass: undefined;
  AddTrash: undefined;
  Facts: undefined;
  CollectionItem: { itemId: string; category: CollectionCategory };
};

export type MainTabParamList = {
  Home: undefined;
  Collection: undefined;
  Rewards: undefined;
  Settings: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
