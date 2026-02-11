import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { env } from "@fmc/env/native";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
	plugins: [convexClient()],
});
