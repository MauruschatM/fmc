import { api } from "@fmc/backend/convex/_generated/api";
import type { Id } from "@fmc/backend/convex/_generated/dataModel";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Spinner } from "heroui-native";
import { useCallback } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";

function DmContent({
	messages,
	currentUserId,
	isLoadingMore,
	canLoadMore,
	onLoadMore,
}: {
	messages: Array<{
		_id: string;
		content: string;
		authorId: string;
		authorName: string;
		authorAvatarUrl?: string | null;
		createdAt: number;
	}>;
	currentUserId: string;
	isLoadingMore: boolean;
	canLoadMore: boolean;
	onLoadMore: () => void;
}) {
	if (messages.length === 0 && !canLoadMore) {
		return (
			<View className="flex-1 items-center justify-center px-6">
				<Text
					className="text-center text-muted"
					style={{ fontFamily: "SpaceGrotesk_400Regular" }}
				>
					Schreibe die erste Nachricht
				</Text>
			</View>
		);
	}

	return (
		<MessageList
			currentUserId={currentUserId}
			isDm
			isLoadingMore={isLoadingMore}
			messages={messages}
			onLoadMore={onLoadMore}
		/>
	);
}

export default function DmScreen() {
	const { conversationId } = useLocalSearchParams<{
		conversationId: string;
	}>();
	const currentUser = useQuery(api.auth.getCurrentUser);
	const conversations = useQuery(api.conversations.listForUser);
	const sendMessage = useMutation(api.messages.send);

	const conversation = conversations?.find((c) => c._id === conversationId);

	const {
		results: messages,
		status,
		loadMore,
	} = usePaginatedQuery(
		api.messages.listByConversation,
		conversationId
			? { conversationId: conversationId as Id<"conversations"> }
			: "skip",
		{ initialNumItems: 30 }
	);

	const handleLoadMore = useCallback(() => {
		if (status === "CanLoadMore") {
			loadMore(20);
		}
	}, [status, loadMore]);

	const handleSend = useCallback(
		async (content: string) => {
			if (!conversationId) {
				return;
			}
			await sendMessage({
				conversationId: conversationId as Id<"conversations">,
				content,
			});
		},
		[conversationId, sendMessage]
	);

	const otherUserName = conversation?.otherUser?.displayName ?? "...";

	return (
		<>
			<Stack.Screen options={{ headerTitle: otherUserName }} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-background"
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				{messages ? (
					<DmContent
						canLoadMore={status === "CanLoadMore"}
						currentUserId={currentUser?._id ?? ""}
						isLoadingMore={status === "LoadingMore"}
						messages={messages}
						onLoadMore={handleLoadMore}
					/>
				) : (
					<View className="flex-1 items-center justify-center">
						<Spinner size="sm" />
					</View>
				)}
				<MessageInput onSend={handleSend} />
			</KeyboardAvoidingView>
		</>
	);
}
