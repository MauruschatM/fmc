import { api } from "@fmc/backend/convex/_generated/api";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Spinner } from "heroui-native";
import { useCallback } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";

export default function ChannelScreen() {
	const { channelSlug } = useLocalSearchParams<{ channelSlug: string }>();
	const channel = useQuery(api.channels.getBySlug, { slug: channelSlug });
	const currentUser = useQuery(api.auth.getCurrentUser);
	const sendMessage = useMutation(api.messages.send);

	const {
		results: messages,
		status,
		loadMore,
	} = usePaginatedQuery(
		api.messages.listByChannel,
		channel ? { channelId: channel._id } : "skip",
		{ initialNumItems: 30 }
	);

	const handleLoadMore = useCallback(() => {
		if (status === "CanLoadMore") {
			loadMore(20);
		}
	}, [status, loadMore]);

	const handleSend = useCallback(
		async (content: string) => {
			if (!channel) {
				return;
			}
			await sendMessage({ channelId: channel._id, content });
		},
		[channel, sendMessage]
	);

	if (!channel) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner size="sm" />
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: channel.name,
				}}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-background"
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				{messages.length === 0 && status !== "CanLoadMore" ? (
					<View className="flex-1 items-center justify-center px-6">
						<Text
							className="text-center text-muted"
							style={{ fontFamily: "SpaceGrotesk_400Regular" }}
						>
							Noch keine Nachrichten. Schreibe die erste!
						</Text>
					</View>
				) : (
					<MessageList
						currentUserId={currentUser?._id ?? ""}
						isLoadingMore={status === "LoadingMore"}
						messages={messages}
						onLoadMore={handleLoadMore}
					/>
				)}
				<MessageInput onSend={handleSend} />
			</KeyboardAvoidingView>
		</>
	);
}
