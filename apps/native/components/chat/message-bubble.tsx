import { Text, View } from "react-native";

import { AvatarDisplay } from "@/components/profile/avatar-display";

function formatTime(timestamp: number): string {
	const date = new Date(timestamp);
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({
	content,
	authorName,
	authorAvatarUrl,
	createdAt,
	isOwn,
	showAuthor,
}: {
	content: string;
	authorName: string;
	authorAvatarUrl?: string | null;
	createdAt: number;
	isOwn: boolean;
	showAuthor: boolean;
}) {
	if (isOwn) {
		return (
			<View className="mb-1 flex-row justify-end px-4">
				<View className="max-w-[75%]">
					<View className="rounded-2xl rounded-br-sm bg-accent px-3 py-2">
						<Text
							className="text-accent-foreground text-sm"
							style={{ fontFamily: "SpaceGrotesk_400Regular" }}
						>
							{content}
						</Text>
					</View>
					<Text
						className="mt-0.5 text-right text-[10px] text-muted"
						style={{ fontFamily: "SpaceGrotesk_400Regular" }}
					>
						{formatTime(createdAt)}
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View className="mb-1 flex-row items-end gap-2 px-4">
			{showAuthor ? (
				<AvatarDisplay
					avatarUrl={authorAvatarUrl}
					name={authorName}
					size={28}
				/>
			) : (
				<View style={{ width: 28 }} />
			)}
			<View className="max-w-[75%]">
				{showAuthor ? (
					<Text
						className="mb-0.5 ml-1 text-[11px] text-muted"
						style={{ fontFamily: "SpaceGrotesk_500Medium" }}
					>
						{authorName}
					</Text>
				) : null}
				<View className="rounded-2xl rounded-bl-sm bg-secondary px-3 py-2">
					<Text
						className="text-foreground text-sm"
						style={{ fontFamily: "SpaceGrotesk_400Regular" }}
					>
						{content}
					</Text>
				</View>
				<Text
					className="mt-0.5 ml-1 text-[10px] text-muted"
					style={{ fontFamily: "SpaceGrotesk_400Regular" }}
				>
					{formatTime(createdAt)}
				</Text>
			</View>
		</View>
	);
}
