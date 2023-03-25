import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapView from 'react-native-maps';
import { UrlTile, Polyline, Marker } from "react-native-maps";
import * as Localization from "expo-localization";
import moment from "moment";
import "moment/min/locales";
moment.locale(Localization.locale.slice(0, 2));
import {
  Provider as PaperProvider,
  DefaultTheme,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
  Surface,
  Avatar,
  Card
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
const example = require("./example.json");
const exampleTrack = [{ lat: 51.509865, lng: -0.1818092 },
{ lat: 51.509875, lng: -0.1818092 },
{ lat: 51.509868, lng: -0.1918092 },
{ lat: 51.509885, lng: -0.1218092 }]
const sportsIconMap = {
  'cycling': 'bike',
  'running': 'run',
  'walking': 'walk',
}
const MapForHome = ({ track = exampleTrack, navigation, item }) => {

  const latitudes = track.map(point => point.lat);
  const longitudes = track.map(point => point.lon);

  const center = {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
  };

  const latDelta = Math.max(...latitudes) - Math.min(...latitudes);
  const lngDelta = Math.max(...longitudes) - Math.min(...longitudes);

  return (
    <MapView
      style={{ width: "100%", height: 200 }}
      zoomEnabled={false}
      scrollEnabled={false}
      onDoublePress={(e) => navigation.navigate("ActivityInfo", { item: item})}
      initialRegion={{
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      }}
    >
      <Polyline
        coordinates={track.map(point => ({ latitude: point.lat, longitude: point.lon }))}
        strokeColor="#F00"
        strokeWidth={4}
      />
    </MapView>
  );
};
function Header({ navigation, theme, t, data }) {
  return (
    <>
      <Text variant="headlineSmall">{t("welcome", { name: data.user.name })}</Text>
      <View style={{ paddingVertical: 8 }}>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate("RecordScreen");
          }}
        >
          {t("home.start_journey")}
        </Button>
      </View>
      <Text variant="titleLarge">
        {t("home.activities_list.title")}
      </Text>

    </>
  )
}
function ActivityCard({ item = example[0], navigation, theme = DefaultTheme }) {
  const chipStyle = {
    flex: 1,
    gap: 2,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.roundness * 2,
    paddingVertical: theme.roundness * 1,
    borderColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.secondaryContainer,
    borderWidth: 1,
  }
  return (
    <View style={{ borderRadius: 16, overflow: 'hidden', elevation: 0, borderColor: theme.colors.outlineVariant, borderWidth: 0.5 , marginVertical: 8, backgroundColor: theme.colors.surface, }} >
      <MapForHome navigation={navigation} track={item.track} item={item} />
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar.Icon icon={sportsIconMap[item.sport]} size={32} />
          <Text variant="headlineSmall" style={{ marginVertical: 0 }}>{item.title}</Text>
        </View>
        <View style={{ marginVertical: 4 }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 4, marginVertical: 4 }}>
            <View
              style={chipStyle}
            >
              <MaterialCommunityIcons name="fire" size={20} />
              <Text variant="bodyLarge">{item.calories} kcal</Text>
            </View>
            <View
              style={chipStyle}
            >
              <MaterialCommunityIcons name="map-marker-distance" size={20} />
              <Text variant="bodyLarge">{item.distance} km</Text>
            </View>
            <View
              style={chipStyle}
            >
              <MaterialCommunityIcons name="timer-outline" size={20} />
              <Text variant="bodyLarge">{moment.utc(moment.duration(item.duration, "seconds").asMilliseconds()).format("hh:mm:ss")}</Text>
            </View>
          </View>
          <Text variant="labelSmall">
            {
              moment(item.timestamp * 1000).fromNow()
            }
          </Text>
        </View>
      </View>

    </View>
  );
}
function HomeScreen({ navigation, t, ...props }) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const theme = useTheme();
  const [data, setData] = React.useState(null);
  useState(() => {
    !isLoaded &&
      setTimeout(() => {
        setIsLoaded(true);
        const mockedData = {
          user: {
            name: "John Doe",
          },
          activites: example
        };
        setData(mockedData);
      }, 2000);
  });
  if (isLoaded) {
    if (data !== null) {
      return (
        <View style={styles.appContainer}>
          <StatusBar translucent={false} style="light" backgroundColor={theme.colors.primary} />

          <View>

            <FlatList style={{ padding: 16 }} ListFooterComponent={<View style={{ height: 16 }} />} data={data.activites} ListHeaderComponent={
              <Header navigation={navigation} theme={theme} t={t} data={data} />
            } renderItem={({ item }) => <ActivityCard navigation={navigation} item={item} theme={theme} />} />
          </View>



        </View>
      );
    }
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  appContainer: {
    flex: 1,

  },
});

export default HomeScreen;
