import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <Button mode="contained" onPress={() => navigation.navigate("TutorialScreen")}>Go Tutorial</Button>
    </View>
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

export default SettingsScreen;