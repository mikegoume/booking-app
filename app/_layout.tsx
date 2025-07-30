import { AppProvider } from "@/contexts/AppContext";
import ThemeProvider from "@/contexts/ThemeContext";
import "@/global.css";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const publicKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publicKey}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <AppProvider>
            <ThemeProvider>
              <StatusBar style="auto" />
              <Slot />
            </ThemeProvider>
          </AppProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
