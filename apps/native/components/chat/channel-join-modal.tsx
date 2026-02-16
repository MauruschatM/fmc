import { Ionicons } from "@expo/vector-icons";
import { api } from "@fmc/backend/convex/_generated/api";
import type { Doc } from "@fmc/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { DynamicIcon } from "@/lib/icons";

function AvailableChannelsList({
	available,
	type,
	muted,
	onJoin,
}: {
	available: Doc<"channels">[] | undefined;
	type: "channel" | "region";
	muted: string;
	onJoin: (channelId: Doc<"channels">["_id"]) => void;
}) {
	if (!available) {
		return (
			<View className="items-center py-8">
				<Spinner size="sm" />
			</View>
		);
	}

	if (available.length === 0) {
		return (
			<Text
				className="py-8 text-center text-muted"
				style={{ fontFamily: "SpaceGrotesk_400Regular" }}
			>
				{type === "channel"
					? "Du bist bereits allen Kanälen beigetreten"
					: "Du bist bereits allen Regionen beigetreten"}
			</Text>
		);
	}

	return (
		<View className="gap-2">
			{available.map((channel) => (
				<View
					className="flex-row items-center justify-between rounded-xl bg-secondary p-4"
					key={channel._id}
				>
					<View className="flex-1 flex-row items-center gap-3">
						<DynamicIcon
							color={muted}
							library={channel.iconLibrary}
							name={channel.icon}
							size={24}
						/>
						<View className="flex-1">
							<Text
								className="text-foreground text-sm"
								style={{ fontFamily: "SpaceGrotesk_500Medium" }}
							>
								{channel.name}
							</Text>
							{channel.description ? (
								<Text
									className="mt-0.5 text-muted text-xs"
									style={{ fontFamily: "SpaceGrotesk_400Regular" }}
								>
									{channel.description}
								</Text>
							) : null}
						</View>
					</View>
					<Button onPress={() => onJoin(channel._id)} size="sm">
						<Button.Label style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
							Beitreten
						</Button.Label>
					</Button>
				</View>
			))}
		</View>
	);
}

export function ChannelJoinModal({
	visible,
	onClose,
	type,
}: {
	visible: boolean;
	onClose: () => void;
	type: "channel" | "region";
}) {
	const available = useQuery(
		api.channels.listAvailable,
		visible ? { type } : "skip"
	);
	const join = useMutation(api.channels.join);
	const foreground = useThemeColor("foreground");
	const muted = useThemeColor("muted");

	const title = type === "channel" ? "Kanal beitreten" : "Region beitreten";

	const handleJoin = async (channelId: Doc<"channels">["_id"]) => {
		await join({ channelId });
	};

	return (
		<Modal
			animationType="slide"
			onRequestClose={onClose}
			presentationStyle="pageSheet"
			visible={visible}
		>
			<View className="flex-1 bg-background">
				<View className="flex-row items-center justify-between border-b border-b-secondary px-4 py-4">
					<Text
						className="text-foreground text-lg"
						style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
					>
						{title}
					</Text>
					<Pressable hitSlop={8} onPress={onClose}>
						<Ionicons color={foreground} name="close" size={24} />
					</Pressable>
				</View>

				<ScrollView className="flex-1 p-4">
					<AvailableChannelsList
						available={available}
						muted={muted}
						onJoin={handleJoin}
						type={type}
					/>
				</ScrollView>
			</View>
		</Modal>
	);
}
