import { useThemeColor } from "heroui-native";
import { Pressable, Text } from "react-native";

import { DynamicIcon } from "@/lib/icons";

export function ChannelListItem({
	name,
	icon,
	iconLibrary,
	onPress,
}: {
	name: string;
	icon: string;
	iconLibrary: string;
	onPress: () => void;
}) {
	const muted = useThemeColor("muted");

	return (
		<Pressable
			className="flex-row items-center gap-3 px-4 py-2.5"
			onPress={onPress}
		>
			<DynamicIcon color={muted} library={iconLibrary} name={icon} size={20} />
			<Text
				className="flex-1 text-foreground text-sm"
				style={{ fontFamily: "SpaceGrotesk_400Regular" }}
			>
				{name}
			</Text>
		</Pressable>
	);
}
