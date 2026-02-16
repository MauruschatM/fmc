import { Stack } from "expo-router/stack";

export default function ChatLayout() {
	return (
		<Stack
			screenOptions={{
				headerBackButtonDisplayMode: "minimal",
			}}
		>
			<Stack.Screen
				name="index"
				options={{ title: "Chat", headerLargeTitle: true }}
			/>
			<Stack.Screen
				name="[channelSlug]"
				options={{ headerLargeTitle: false }}
			/>
			<Stack.Screen
				name="dm/[conversationId]"
				options={{ headerLargeTitle: false }}
			/>
		</Stack>
	);
}
