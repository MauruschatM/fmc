import "@/global.css";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { env } from "@fmc/env/native";
import { ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { KeyboardProvider } from "@/components/keyboard-provider";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { authClient } from "@/lib/auth-client";

export const unstable_settings = {
	initialRouteName: "(auth)",
};

const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
	unsavedChangesWarning: false,
});

function StackLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(auth)" />
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}

export default function Layout() {
	const [fontsLoaded] = useFonts({
		SpaceGrotesk_300Light: require("@/assets/fonts/SpaceGrotesk_300Light.ttf"),
		SpaceGrotesk_400Regular: require("@/assets/fonts/SpaceGrotesk_400Regular.ttf"),
		SpaceGrotesk_500Medium: require("@/assets/fonts/SpaceGrotesk_500Medium.ttf"),
		SpaceGrotesk_600SemiBold: require("@/assets/fonts/SpaceGrotesk_600SemiBold.ttf"),
		SpaceGrotesk_700Bold: require("@/assets/fonts/SpaceGrotesk_700Bold.ttf"),
	});

	if (!fontsLoaded) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#000",
				}}
			>
				<Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
					FMC
				</Text>
			</View>
		);
	}

	const content = (
		<ConvexBetterAuthProvider authClient={authClient} client={convex}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppThemeProvider>
						<HeroUINativeProvider>
							<StackLayout />
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</ConvexBetterAuthProvider>
	);

	if (Platform.OS === "web") {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					backgroundColor: "#000",
				}}
			>
				<View
					style={{
						flex: 1,
						width: "100%",
						maxWidth: 430,
						overflow: "hidden",
					}}
				>
					{content}
				</View>
			</View>
		);
	}

	return content;
}
