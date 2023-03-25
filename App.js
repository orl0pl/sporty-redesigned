import React from "react";
import { StyleSheet, View, Button, Image, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./screens/Home";
import RecordScreen from "./screens/Record";
import SettingsScreen from "./screens/Settings";
import i18next, { t } from 'i18next';
import * as Localization from 'expo-localization';
import ActivityInfo from "./screens/ActivityInfo";
const pl = require('./locales/pl.json');
const en = require('./locales/en.json');
i18next.init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.substring(0, 2),
  fallbackLng: 'en', // if you're using a language detector, do not define the lng option
  debug: false,
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  }
});
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
console.log(t('welcome', { name: 'John Doe' }));
const theme = {
  ...DefaultTheme,
};

function TutorialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Tutorial Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate("RecordScreen")} />
    </View>
  );
}
function TabStack({ navigation, route }) {
  return (
    <Tab.Navigator
      theme={theme}
      initialRouteName="RecordScreen"

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home-variant" : "home-variant-outline";
          } else if (route.name === "RecordScreen") {
            iconName = focused ? "record-circle" : "record-circle-outline";
          } else if (route.name === "SettingsScreen") {
            iconName = focused ? "cog" : "cog-outline";
          }

          // You can return any component that you like here!
          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"

        options={{
          title: "Home",
        }}
      >
        {() => <HomeScreen navigation={navigation} t={t} />}
      </Tab.Screen>
      <Tab.Screen
        name="RecordScreen"
        initialParams={{
          trackingActivity: false
        }}
        options={{
          title: "Record",
        }}
        

      >
        {() => <RecordScreen navigation={navigation} route={route} t={t} />}
      </Tab.Screen>
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}

        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}
function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }} />
          <Stack.Screen name="TutorialScreen" options={{ headerShown: false }} component={TutorialScreen} />
          <Stack.Screen name="ActivityInfo" options={{ headerTitle: t('activity.info.title') }} component={ActivityInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
