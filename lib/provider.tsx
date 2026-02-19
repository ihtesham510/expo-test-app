import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type PropsWithChildren, StrictMode } from "react";

const convex = new ConvexReactClient(
    process.env.EXPO_PUBLIC_CONVEX_URL as string,
    {
        expectAuth: true,
        unsavedChangesWarning: false,
    },
);

export function ConvexClientProvider({ children }: PropsWithChildren) {
    return (
        <StrictMode>
            <ConvexProvider client={convex}>
                <ConvexBetterAuthProvider client={convex} authClient={authClient}>
                    {children}
                </ConvexBetterAuthProvider>
            </ConvexProvider>
        </StrictMode>
    );
}
