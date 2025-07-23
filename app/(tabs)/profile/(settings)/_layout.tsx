import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="my-cards" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile-details" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="trainees" />
    </Stack>
  );
}
