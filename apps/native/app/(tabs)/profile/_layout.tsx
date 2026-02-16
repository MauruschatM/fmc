import { Stack } from "expo-router/stack";

export default function ProfileLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{ title: "Profil", headerLargeTitle: true }}
			/>
		</Stack>
	);
}
