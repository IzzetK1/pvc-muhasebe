"use client";

import { ReactNode } from "react";

// Geçici olarak SessionProvider'ı devre dışı bıraktık
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
