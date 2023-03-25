import React from "react";
import { StyleSheet, View} from "react-native";
import MapView from "react-native-maps";
import { UrlTile, Polyline, Marker } from "react-native-maps";
import { Text, useTheme } from "react-native-paper";

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
        style={{ width: "100%", height: 300,  }}
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
function ActivityInfo({ navigation, route }) {
    const theme = useTheme()
  return (
    <View style={styles.container}>
        <Text variant="headlineSmall">{route.params.item.title}</Text>
        <View style={{borderColor: theme.colors.outlineVariant, borderWidth: 1, marginVertical: 8, borderRadius: 16, overflow: "hidden"}}>
            <MapForHome track={route.params.item.track} navigation={navigation} item={route.params.item} />
        </View>
      {//<Text>{JSON.stringify(route.params.item)}</Text>
}
    <Text variant="headlineSmall">
        TODO: Other stats
    </Text>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
});

export default ActivityInfo;
