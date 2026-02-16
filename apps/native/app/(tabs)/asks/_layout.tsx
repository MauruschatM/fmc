import { Stack } from "expo-router/stack";

export default function AsksLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{ title: "Asks", headerLargeTitle: true }}
			/>
		</Stack>
	);
}
