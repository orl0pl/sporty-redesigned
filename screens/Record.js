import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
const haversine = require('haversine')
import {
  Provider as PaperProvider,
  DefaultTheme,
  Button,
  Text,
  useTheme,
  Avatar,
} from "react-native-paper";
import MapView from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { UrlTile, Polyline, Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

function StatsCard({
  t,
  theme = DefaultTheme,
  icon = "help",
  statsName = "",
  value = 0,
  unit = "",
  details = [],
}) {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: theme.colors.primaryContainer,
        borderColor: theme.colors.outlineVariant,
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <MaterialCommunityIcons name={icon} size={24} color="black" />
        <Text variant="titleMedium">{statsName}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Text variant="displayMedium">{value}</Text>
        <Text style={{ position: "relative", bottom: 6 }} variant="bodyLarge">
          {unit}
        </Text>
      </View>
      {details && (
        <View>
          {details.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  {item.icon && <MaterialCommunityIcons name={item.icon} size={20} color="black" />}
                  <Text variant="labelLarge">{item.name}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text variant="bodyMedium">{item.value}</Text>
                  {item.unit !== unit && <Text variant="bodyMedium">{item.unit}</Text>}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
function FlexColumn({ children, columns = 3 }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: columns,
      }}
    >
      {children}
    </View>
  );
}
function RecordScreen({ navigation, t, route }) {
  const theme = useTheme();
  const [sport, setSport] = useState("bike");
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [workoutTrack, setWorkoutTrack] = useState([])
  const [workoutStarted, setWorkoutStarted] = useState(false)
  useEffect(() => {
    if (route.params && route.params.sport) {
      setSport(route.params.sport);
    }
    if (route.params && route.params.trackingActivity) {
      setWorkoutStarted(route.params.workoutStarted)
    }
  })
  const startActivity = () => {
    setWorkoutStarted(true)
  };
  const pauseOrUnpauseActivity = () => {
    setWorkoutStarted(!workoutStarted)
  }
  useEffect(() => {
    if (workoutStarted) {
      var interval = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
      }, 1000)
      return () => clearInterval(interval);
    }
  })
  useEffect(() => {

    // Start tracking the user's location
    if (workoutStarted) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced
          },
          (location) => {
            // Update the location state
            setLocation(location);

            // Calculate the distance and speed
            if (prevLatLng) {
              const distanceInMeters = haversine(prevLatLng, location.coords);
              const timeElapsedInSeconds = (location.timestamp - prevLatLng.timestamp) / 1000;
              const speed = distanceInMeters / timeElapsedInSeconds;
              setDistance((distance) => distance + distanceInMeters);
              //setElapsedTime((elapsedTime) => elapsedTime + timeElapsedInSeconds);
              setWorkoutTrack([...workoutTrack, {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }])
              setSpeed((speed) => speed);
            }

            // Update the previous location
            setPrevLatLng(location);
          }
        );
      })();
    }
  }, []);

  return (

    <View style={styles.container}>
      <StatusBar style="light" translucent={false} backgroundColor={theme.colors.primary} />
      <MapView
        showsUserLocation
        followsUserLocation={true}
        mapType="standard"
        userLocationFastestInterval={1000}
        showsScale
        style={styles.map}
      >
        <Polyline coordinates={workoutTrack} strokeColor={theme.colors.primary} strokeWidth={6} />
      </MapView>
      <View style={styles.details}>
        {route.params !== undefined && route.params.trackingActivity == false ? (
          <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Avatar.Icon icon="bike" size={48} />
            <View style={{ flex: 1, flexDirection: "column", gap: 0 }}>
              <Text variant="labelSmall">{t("record.sport.choose")}</Text>
              <Text variant="bodyLarge">{t(`sports.${sport}.short`)}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.primary} />
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={{
            rowGap: 8,
          }}
          style={{ flex: 1, flexDirection: "column", marginTop: 16 }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <StatsCard
              theme={theme}
              t={t}
              icon="map-marker-distance"
              value={distance}
              unit="km"
              statsName="Distance"
            />
            <StatsCard
              theme={theme}
              t={t}
              icon="speedometer"
              value={speed}
              unit="km/h"
              statsName="Speed"
              details={[
                {
                  name: "Max",
                  value: 20,
                  unit: "km/h",
                },
                {
                  name: "Avg",
                  value: 10,
                  unit: "km/h",
                },
              ]}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <StatsCard
              theme={theme}
              t={t}
              icon="heart-pulse"
              value={100}
              unit="bpm"
              statsName="Heart Rate"
              details={[
                {
                  name: "Max",
                  value: 110,
                  unit: "bpm",
                },
                {
                  name: "Avg",
                  value: 102,
                  unit: "bpm",
                },
                {
                  name: "Min",
                  value: 80,
                  unit: "bpm",
                },
              ]}
            />

            <StatsCard
              icon="timer"
              statsName="Time"
              unit=""
              value={new Date(elapsedTime * 1000).toISOString().slice(11, 19)}
              theme={theme}
              t={t}
            />
          </View>
          <View></View>
        </ScrollView>
        {true ? (
          workoutStarted ? (
            <Button mode="outlined" onPress={() => pauseOrUnpauseActivity()}>
              {t("record.button.pause")}
            </Button>
          ) :
            <Button mode="contained" onPress={() => pauseOrUnpauseActivity()}>
              {t("record.button.unpause")}
            </Button>
        ) :
          <Button mode="contained" onPress={() => startActivity()}>
            {t("record.button.start")}
          </Button>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  details: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
    width: "100%",
    minHeight: 10,
  },
});

export default RecordScreen;
