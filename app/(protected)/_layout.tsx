import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AppProtectedLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="./(chat)" />
      <Stack.Screen name="+not-found" />
      {/* Modal screen */}
      <Stack.Screen
        name="(modals)/slot/[id]"
        options={{
          presentation: "modal",
          headerShown: true, // or false
        }}
      />
      <Stack.Screen
        name="(modals)/slot/manage/[id]"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Manage Slot",
        }}
      />
    </Stack>
  );
}
