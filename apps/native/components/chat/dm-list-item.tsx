import { Pressable, Text, View } from "react-native";

import { AvatarDisplay } from "@/components/profile/avatar-display";

export function DmListItem({
	displayName,
	avatarUrl,
	lastMessage,
	onPress,
}: {
	displayName: string;
	avatarUrl?: string | null;
	lastMessage?: string | null;
	onPress: () => void;
}) {
	return (
		<Pressable
			className="flex-row items-center gap-3 px-4 py-2.5"
			onPress={onPress}
		>
			<AvatarDisplay avatarUrl={avatarUrl} name={displayName} size={32} />
			<View className="flex-1">
				<Text
					className="text-foreground text-sm"
					numberOfLines={1}
					style={{ fontFamily: "SpaceGrotesk_500Medium" }}
				>
					{displayName}
				</Text>
				{lastMessage ? (
					<Text
						className="mt-0.5 text-muted text-xs"
						numberOfLines={1}
						style={{ fontFamily: "SpaceGrotesk_400Regular" }}
					>
						{lastMessage}
					</Text>
				) : null}
			</View>
		</Pressable>
	);
}
