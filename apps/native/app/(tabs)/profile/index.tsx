import { Ionicons } from "@expo/vector-icons";
import { api } from "@fmc/backend/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Redirect, Stack } from "expo-router";
import {
	Button,
	Input,
	Label,
	Spinner,
	TextField,
	useThemeColor,
} from "heroui-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

import { AvatarDisplay } from "@/components/profile/avatar-display";
import { useAppTheme } from "@/contexts/app-theme-context";
import { authClient } from "@/lib/auth-client";

function SectionHeader({ title }: { title: string }) {
	return (
		<Text
			style={{
				fontFamily: "SpaceGrotesk_600SemiBold",
				fontSize: 12,
				textTransform: "uppercase",
				letterSpacing: 1,
				opacity: 0.5,
				marginBottom: 8,
				paddingHorizontal: 4,
			}}
		>
			{title}
		</Text>
	);
}

function SettingsRow({
	icon,
	label,
	value,
	trailing,
	onPress,
}: {
	icon: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
	value?: string;
	trailing?: React.ReactNode;
	onPress?: () => void;
}) {
	const muted = useThemeColor("muted");
	const Wrapper = onPress ? Pressable : View;

	return (
		<Wrapper
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 12,
				paddingHorizontal: 16,
				paddingVertical: 14,
			}}
			{...(onPress ? { onPress } : {})}
		>
			<Ionicons color={muted} name={icon} size={20} />
			<View style={{ flex: 1 }}>
				<Text style={{ fontFamily: "SpaceGrotesk_500Medium", fontSize: 15 }}>
					{label}
				</Text>
				{value ? (
					<Text
						numberOfLines={1}
						style={{
							fontFamily: "SpaceGrotesk_400Regular",
							fontSize: 13,
							opacity: 0.5,
							marginTop: 2,
						}}
					>
						{value}
					</Text>
				) : null}
			</View>
			{trailing}
		</Wrapper>
	);
}

function StatBadge({ count, label }: { count: number; label: string }) {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				borderRadius: 12,
				paddingHorizontal: 12,
				paddingVertical: 12,
				backgroundColor: "rgba(128,128,128,0.1)",
			}}
		>
			<Text
				style={{
					fontFamily: "SpaceGrotesk_700Bold",
					fontSize: 18,
					fontVariant: ["tabular-nums"],
				}}
			>
				{count}
			</Text>
			<Text
				style={{
					fontFamily: "SpaceGrotesk_400Regular",
					fontSize: 12,
					opacity: 0.5,
					marginTop: 2,
				}}
			>
				{label}
			</Text>
		</View>
	);
}

function Divider() {
	return (
		<View
			style={{
				height: 0.5,
				marginHorizontal: 16,
				backgroundColor: "rgba(128,128,128,0.2)",
			}}
		/>
	);
}

export default function ProfileScreen() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const accent = useThemeColor("accent");
	const muted = useThemeColor("muted");
	const { isLight, toggleTheme } = useAppTheme();

	const profileData = useQuery(
		api.userProfiles.get,
		isAuthenticated ? {} : "skip"
	);
	const joinedChannels = useQuery(
		api.channels.listJoined,
		isAuthenticated ? {} : "skip"
	);
	const conversations = useQuery(
		api.conversations.listForUser,
		isAuthenticated ? {} : "skip"
	);
	const updateProfile = useMutation(api.userProfiles.update);

	const [displayName, setDisplayName] = useState("");
	const [bio, setBio] = useState("");
	const [location, setLocation] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (profileData?.profile) {
			setDisplayName(profileData.profile.displayName);
			setBio(profileData.profile.bio ?? "");
			setLocation(profileData.profile.location ?? "");
		} else if (profileData?.authUser) {
			setDisplayName(profileData.authUser.name ?? "");
		}
	}, [profileData]);

	const hasChanges = useMemo(() => {
		if (!profileData?.profile) {
			return displayName.trim().length > 0;
		}
		return (
			displayName.trim() !== profileData.profile.displayName ||
			bio.trim() !== (profileData.profile.bio ?? "") ||
			location.trim() !== (profileData.profile.location ?? "")
		);
	}, [displayName, bio, location, profileData]);

	const memberSince = useMemo(() => {
		if (!profileData?.profile?.createdAt) {
			return null;
		}
		return new Date(profileData.profile.createdAt).toLocaleDateString("de-DE", {
			month: "long",
			year: "numeric",
		});
	}, [profileData?.profile?.createdAt]);

	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			await updateProfile({
				displayName: displayName.trim() || undefined,
				bio: bio.trim() || undefined,
				location: location.trim() || undefined,
			});
			setIsEditing(false);
		} finally {
			setIsSaving(false);
		}
	}, [displayName, bio, location, updateProfile]);

	const handleCancelEdit = useCallback(() => {
		if (profileData?.profile) {
			setDisplayName(profileData.profile.displayName);
			setBio(profileData.profile.bio ?? "");
			setLocation(profileData.profile.location ?? "");
		}
		setIsEditing(false);
	}, [profileData]);

	const handleSignOut = useCallback(() => {
		authClient.signOut();
	}, []);

	if (!(isLoading || isAuthenticated)) {
		return <Redirect href="/(auth)/login" />;
	}

	if (!profileData) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Spinner size="sm" />
			</View>
		);
	}

	const currentDisplayName = displayName || profileData.authUser.name || "User";

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () =>
						isEditing ? (
							<Pressable onPress={handleCancelEdit}>
								<Text
									style={{
										fontFamily: "SpaceGrotesk_500Medium",
										fontSize: 15,
										opacity: 0.5,
									}}
								>
									Abbrechen
								</Text>
							</Pressable>
						) : (
							<Pressable onPress={() => setIsEditing(true)}>
								<Text
									style={{
										fontFamily: "SpaceGrotesk_500Medium",
										fontSize: 15,
										color: accent,
									}}
								>
									Bearbeiten
								</Text>
							</Pressable>
						),
				}}
			/>

			<ScrollView
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
				contentInsetAdjustmentBehavior="automatic"
				keyboardDismissMode="on-drag"
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Header */}
				<View
					style={{ alignItems: "center", paddingTop: 8, paddingBottom: 24 }}
				>
					<AvatarDisplay
						avatarUrl={profileData.profile?.avatarUrl}
						name={currentDisplayName}
						size={96}
					/>
					<Text
						selectable
						style={{
							fontFamily: "SpaceGrotesk_700Bold",
							fontSize: 22,
							marginTop: 16,
						}}
					>
						{currentDisplayName}
					</Text>
					<Text
						selectable
						style={{
							fontFamily: "SpaceGrotesk_400Regular",
							fontSize: 14,
							opacity: 0.5,
							marginTop: 4,
						}}
					>
						{profileData.authUser.email}
					</Text>
					{memberSince ? (
						<Text
							style={{
								fontFamily: "SpaceGrotesk_400Regular",
								fontSize: 12,
								opacity: 0.4,
								marginTop: 4,
							}}
						>
							Mitglied seit {memberSince}
						</Text>
					) : null}
				</View>

				{/* Stats */}
				<View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
					<StatBadge count={joinedChannels?.length ?? 0} label="Kanäle" />
					<StatBadge count={conversations?.length ?? 0} label="Chats" />
				</View>

				{/* Edit Form or Read-only info */}
				{isEditing ? (
					<View style={{ marginBottom: 24 }}>
						<SectionHeader title="Profil bearbeiten" />
						<View className="gap-4 rounded-2xl bg-secondary p-4">
							<TextField>
								<Label>Anzeigename</Label>
								<Input
									onChangeText={setDisplayName}
									placeholder="Dein Name"
									value={displayName}
								/>
							</TextField>
							<TextField>
								<Label>Bio</Label>
								<Input
									multiline
									numberOfLines={3}
									onChangeText={setBio}
									placeholder="Erzähl etwas über dich..."
									value={bio}
								/>
							</TextField>
							<TextField>
								<Label>Standort</Label>
								<Input
									onChangeText={setLocation}
									placeholder="z.B. Berlin, Deutschland"
									value={location}
								/>
							</TextField>
							<Button isDisabled={!hasChanges || isSaving} onPress={handleSave}>
								{isSaving ? (
									<Spinner color="default" size="sm" />
								) : (
									<Button.Label
										style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
									>
										Speichern
									</Button.Label>
								)}
							</Button>
						</View>
					</View>
				) : (
					<View style={{ marginBottom: 24 }}>
						<SectionHeader title="Persönliche Daten" />
						<View
							style={{
								borderRadius: 16,
								overflow: "hidden",
								backgroundColor: "rgba(128,128,128,0.08)",
								borderCurve: "continuous",
							}}
						>
							<SettingsRow
								icon="person-outline"
								label="Anzeigename"
								value={profileData.profile?.displayName}
							/>
							<Divider />
							<SettingsRow
								icon="document-text-outline"
								label="Bio"
								value={profileData.profile?.bio || "Noch keine Bio"}
							/>
							<Divider />
							<SettingsRow
								icon="location-outline"
								label="Standort"
								value={profileData.profile?.location || "Kein Standort"}
							/>
						</View>
					</View>
				)}

				{/* Settings */}
				<View style={{ marginBottom: 24 }}>
					<SectionHeader title="Einstellungen" />
					<View
						style={{
							borderRadius: 16,
							overflow: "hidden",
							backgroundColor: "rgba(128,128,128,0.08)",
							borderCurve: "continuous",
						}}
					>
						<SettingsRow
							icon={isLight ? "sunny-outline" : "moon-outline"}
							label="Dunkelmodus"
							trailing={
								<Switch
									onValueChange={toggleTheme}
									trackColor={{ true: accent }}
									value={!isLight}
								/>
							}
						/>
					</View>
				</View>

				{/* Account */}
				<View style={{ marginBottom: 24 }}>
					<SectionHeader title="Konto" />
					<View
						style={{
							borderRadius: 16,
							overflow: "hidden",
							backgroundColor: "rgba(128,128,128,0.08)",
							borderCurve: "continuous",
						}}
					>
						<SettingsRow
							icon="mail-outline"
							label="E-Mail"
							value={profileData.authUser.email}
						/>
						<Divider />
						<SettingsRow
							icon="log-out-outline"
							label="Abmelden"
							onPress={handleSignOut}
							trailing={
								<Ionicons color={muted} name="chevron-forward" size={18} />
							}
						/>
					</View>
				</View>
			</ScrollView>
		</>
	);
}
