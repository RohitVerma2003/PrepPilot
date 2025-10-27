"use client";
import React from "react";
import { store } from "@/app/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/nextjs";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider> <Provider store={store}>{children}</Provider> </ClerkProvider>;
};

export default StoreProvider;
