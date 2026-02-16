import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { ScrollView, Text } from "react-native";

export default function AsksScreen() {
	const muted = useThemeColor("muted");

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 24,
			}}
			contentInsetAdjustmentBehavior="automatic"
		>
			<Ionicons color={muted} name="help-circle-outline" size={64} />
			<Text
				style={{
					fontFamily: "SpaceGrotesk_600SemiBold",
					fontSize: 20,
					marginTop: 16,
				}}
			>
				Asks
			</Text>
			<Text
				style={{
					fontFamily: "SpaceGrotesk_400Regular",
					fontSize: 15,
					opacity: 0.5,
					marginTop: 8,
					textAlign: "center",
				}}
			>
				Coming soon
			</Text>
		</ScrollView>
	);
}
