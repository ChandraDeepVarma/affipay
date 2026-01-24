// src/app/providers.jsx
"use client";

import { SessionProvider } from "next-auth/react";
import { UserStatusProvider } from "@/context/UserStatusContext";

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <UserStatusProvider>{children}</UserStatusProvider>
        </SessionProvider>
    );
}
