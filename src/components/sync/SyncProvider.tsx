"use client";

import React, { useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { pullFromCloud, initRealtimeSync } from "@/lib/supabase-sync";

interface SyncProviderProps {
  children: React.ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // 1. Initial background pull from Supabase to sync local storage with latest cloud records
    pullFromCloud().catch((err) => {
      console.warn("Initial Supabase cloud pull failed:", err);
    });

    // 2. Start realtime websocket listener for multi-device synchronization
    const unsubscribe = initRealtimeSync();

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
