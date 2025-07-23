import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SlotInfo = () => {
  const { id } = useLocalSearchParams();

  console.log(id);

  return (
    <View className="bg-red-500">
      <Text>{id}</Text>
    </View>
  );
};

export default SlotInfo;
