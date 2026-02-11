import { api } from "@fmc/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	let healthStatusLabel = "API Disconnected";
	if (healthCheck === undefined) {
		healthStatusLabel = "Checking...";
	} else if (healthCheck === "OK") {
		healthStatusLabel = "Connected to API";
	}

	return (
		<Container className="p-4">
			<View className="mb-4 py-6">
				<Text className="font-semibold text-3xl text-foreground tracking-tight">
					Better T Stack
				</Text>
				<Text className="mt-1 text-muted text-sm">
					Full-stack TypeScript starter
				</Text>
			</View>

			{user ? (
				<Surface className="mb-4 rounded-lg p-4" variant="secondary">
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="font-medium text-foreground">{user.name}</Text>
							<Text className="mt-0.5 text-muted text-xs">{user.email}</Text>
						</View>
						<Button
							onPress={() => {
								authClient.signOut();
							}}
							size="sm"
							variant="danger"
						>
							Sign Out
						</Button>
					</View>
				</Surface>
			) : null}
			<Surface className="rounded-lg p-4" variant="secondary">
				<Text className="mb-2 font-medium text-foreground">API Status</Text>
				<View className="flex-row items-center gap-2">
					<View
						className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-success" : "bg-danger"}`}
					/>
					<Text className="text-muted text-xs">{healthStatusLabel}</Text>
				</View>
			</Surface>
			{!user && (
				<View className="mt-4 gap-4">
					<SignIn />
					<SignUp />
				</View>
			)}
		</Container>
	);
}
