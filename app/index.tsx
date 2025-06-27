import { useApp } from "@/contexts/AppContext";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  const { isAuthenticated } = useApp();

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
