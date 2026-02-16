import { Ionicons } from "@expo/vector-icons";
import { api } from "@fmc/backend/convex/_generated/api";
import type { Id } from "@fmc/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Spinner, useThemeColor } from "heroui-native";
import { useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";

import { AvatarDisplay } from "@/components/profile/avatar-display";

function SearchResults({
	searchTerm,
	results,
	onSelect,
}: {
	searchTerm: string;
	results:
		| Array<{
				_id: string;
				userId: string;
				displayName: string;
				avatarUrl?: string;
				location?: string;
		  }>
		| undefined;
	onSelect: (userId: string) => void;
}) {
	if (searchTerm.trim().length === 0) {
		return (
			<Text
				className="px-4 py-8 text-center text-muted"
				style={{ fontFamily: "SpaceGrotesk_400Regular" }}
			>
				Suche nach einem Namen
			</Text>
		);
	}

	if (!results) {
		return (
			<View className="items-center py-8">
				<Spinner size="sm" />
			</View>
		);
	}

	if (results.length === 0) {
		return (
			<Text
				className="px-4 py-8 text-center text-muted"
				style={{ fontFamily: "SpaceGrotesk_400Regular" }}
			>
				Keine Benutzer gefunden
			</Text>
		);
	}

	return (
		<>
			{results.map((user) => (
				<Pressable
					className="flex-row items-center gap-3 px-4 py-3"
					key={user._id}
					onPress={() => onSelect(user.userId)}
				>
					<AvatarDisplay
						avatarUrl={user.avatarUrl}
						name={user.displayName}
						size={40}
					/>
					<View>
						<Text
							className="text-foreground text-sm"
							style={{ fontFamily: "SpaceGrotesk_500Medium" }}
						>
							{user.displayName}
						</Text>
						{user.location ? (
							<Text
								className="mt-0.5 text-muted text-xs"
								style={{ fontFamily: "SpaceGrotesk_400Regular" }}
							>
								{user.location}
							</Text>
						) : null}
					</View>
				</Pressable>
			))}
		</>
	);
}

export function UserSearchModal({
	visible,
	onClose,
	onConversationCreated,
}: {
	visible: boolean;
	onClose: () => void;
	onConversationCreated: (conversationId: Id<"conversations">) => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const results = useQuery(
		api.userProfiles.searchUsers,
		visible && searchTerm.trim().length > 0
			? { searchTerm: searchTerm.trim() }
			: "skip"
	);
	const getOrCreate = useMutation(api.conversations.getOrCreate);
	const foreground = useThemeColor("foreground");
	const muted = useThemeColor("muted");
	const secondary = useThemeColor("secondary");

	const handleSelect = async (userId: string) => {
		const conversationId = await getOrCreate({ otherUserId: userId });
		setSearchTerm("");
		onConversationCreated(conversationId);
		onClose();
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
						Nachricht schreiben
					</Text>
					<Pressable hitSlop={8} onPress={onClose}>
						<Ionicons color={foreground} name="close" size={24} />
					</Pressable>
				</View>

				<View className="px-4 py-3">
					<TextInput
						autoFocus
						className="rounded-xl px-4 py-3 text-sm"
						onChangeText={setSearchTerm}
						placeholder="Name suchen..."
						placeholderTextColor={muted}
						style={{
							fontFamily: "SpaceGrotesk_400Regular",
							color: foreground,
							backgroundColor: secondary,
						}}
						value={searchTerm}
					/>
				</View>

				<ScrollView className="flex-1">
					<SearchResults
						onSelect={handleSelect}
						results={results}
						searchTerm={searchTerm}
					/>
				</ScrollView>
			</View>
		</Modal>
	);
}
