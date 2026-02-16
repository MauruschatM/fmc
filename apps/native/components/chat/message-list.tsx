import { Spinner } from "heroui-native";
import { useCallback } from "react";
import { FlatList, Text, View } from "react-native";

import { MessageBubble } from "@/components/chat/message-bubble";

interface MessageItem {
	_id: string;
	content: string;
	authorId: string;
	authorName: string;
	authorAvatarUrl?: string | null;
	createdAt: number;
}

function formatDateSeparator(timestamp: number): string {
	const date = new Date(timestamp);
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return "Heute";
	}
	if (date.toDateString() === yesterday.toDateString()) {
		return "Gestern";
	}
	return date.toLocaleDateString("de-DE", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function MessageList({
	messages,
	currentUserId,
	onLoadMore,
	isLoadingMore,
	isDm,
}: {
	messages: MessageItem[];
	currentUserId: string;
	onLoadMore?: () => void;
	isLoadingMore?: boolean;
	isDm?: boolean;
}) {
	const renderItem = useCallback(
		({ item, index }: { item: MessageItem; index: number }) => {
			const prevMessage = messages[index + 1];
			const showAuthor =
				!isDm && (!prevMessage || prevMessage.authorId !== item.authorId);

			const showDateSeparator =
				!prevMessage ||
				new Date(item.createdAt).toDateString() !==
					new Date(prevMessage.createdAt).toDateString();

			return (
				<>
					<MessageBubble
						authorAvatarUrl={item.authorAvatarUrl}
						authorName={item.authorName}
						content={item.content}
						createdAt={item.createdAt}
						isOwn={item.authorId === currentUserId}
						showAuthor={showAuthor}
					/>
					{showDateSeparator ? (
						<View className="my-3 flex-row items-center justify-center">
							<Text
								className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted"
								style={{ fontFamily: "SpaceGrotesk_500Medium" }}
							>
								{formatDateSeparator(item.createdAt)}
							</Text>
						</View>
					) : null}
				</>
			);
		},
		[messages, currentUserId, isDm]
	);

	return (
		<FlatList
			contentContainerStyle={{ paddingVertical: 8 }}
			data={messages}
			inverted
			keyExtractor={(item) => item._id}
			ListFooterComponent={
				isLoadingMore ? (
					<View className="items-center py-4">
						<Spinner size="sm" />
					</View>
				) : null
			}
			onEndReached={onLoadMore}
			onEndReachedThreshold={0.5}
			renderItem={renderItem}
		/>
	);
}
