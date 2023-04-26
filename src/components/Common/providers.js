"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
// import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" enableSystem="false" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}
