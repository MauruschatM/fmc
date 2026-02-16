import { api } from "@fmc/backend/convex/_generated/api";
import type { Doc } from "@fmc/backend/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { Spinner } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { ChannelJoinModal } from "@/components/chat/channel-join-modal";
import { ChannelListItem } from "@/components/chat/channel-list-item";
import { ChatSection } from "@/components/chat/chat-section";
import { DmListItem } from "@/components/chat/dm-list-item";
import { UserSearchModal } from "@/components/chat/user-search-modal";

export default function ChatListScreen() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const router = useRouter();
	const joinedChannels = useQuery(
		api.channels.listJoined,
		isAuthenticated ? {} : "skip"
	);
	const conversations = useQuery(
		api.conversations.listForUser,
		isAuthenticated ? {} : "skip"
	);
	const ensureDefaults = useMutation(api.onboarding.ensureDefaults);
	const hasInitialized = useRef(false);

	const [joinModalType, setJoinModalType] = useState<
		"channel" | "region" | null
	>(null);
	const [userSearchVisible, setUserSearchVisible] = useState(false);

	useEffect(() => {
		if (
			joinedChannels !== undefined &&
			joinedChannels.length === 0 &&
			!hasInitialized.current
		) {
			hasInitialized.current = true;
			ensureDefaults();
		}
	}, [joinedChannels, ensureDefaults]);

	if (!(isLoading || isAuthenticated)) {
		return <Redirect href="/(auth)/login" />;
	}

	if (!joinedChannels) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner size="sm" />
			</View>
		);
	}

	const channels = joinedChannels.filter(
		(c): c is Doc<"channels"> => c !== null && c.type === "channel"
	);
	const regions = joinedChannels.filter(
		(c): c is Doc<"channels"> => c !== null && c.type === "region"
	);

	return (
		<View className="flex-1 bg-background">
			<ScrollView className="flex-1">
				<ChatSection
					actionLabel="Kanal beitreten"
					onAction={() => setJoinModalType("channel")}
					title="Kanäle"
				>
					{channels.map((channel) => (
						<ChannelListItem
							icon={channel.icon}
							iconLibrary={channel.iconLibrary}
							key={channel._id}
							name={channel.name}
							onPress={() => router.push(`/(tabs)/chat/${channel.slug}`)}
						/>
					))}
				</ChatSection>

				<ChatSection
					actionLabel="Region beitreten"
					onAction={() => setJoinModalType("region")}
					title="Regionen"
				>
					{regions.map((region) => (
						<ChannelListItem
							icon={region.icon}
							iconLibrary={region.iconLibrary}
							key={region._id}
							name={region.name}
							onPress={() => router.push(`/(tabs)/chat/${region.slug}`)}
						/>
					))}
				</ChatSection>

				<ChatSection
					actionLabel="Nachricht schreiben"
					onAction={() => setUserSearchVisible(true)}
					title="Direktnachrichten"
				>
					{conversations?.map((convo) => (
						<DmListItem
							avatarUrl={convo.otherUser.avatarUrl}
							displayName={convo.otherUser.displayName}
							key={convo._id}
							lastMessage={convo.lastMessage?.content}
							onPress={() => router.push(`/(tabs)/chat/dm/${convo._id}`)}
						/>
					))}
				</ChatSection>
			</ScrollView>

			<ChannelJoinModal
				onClose={() => setJoinModalType(null)}
				type={joinModalType ?? "channel"}
				visible={joinModalType !== null}
			/>

			<UserSearchModal
				onClose={() => setUserSearchVisible(false)}
				onConversationCreated={(id) => {
					router.push(`/(tabs)/chat/dm/${id}`);
				}}
				visible={userSearchVisible}
			/>
		</View>
	);
}
