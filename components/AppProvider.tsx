import { AppProvider } from "@/contexts/AppContext";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AppProviderWrapper({ children }: Props) {
  return <AppProvider>{children}</AppProvider>;
}
