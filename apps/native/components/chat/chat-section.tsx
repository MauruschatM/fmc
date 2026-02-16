import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { type PropsWithChildren, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function ChatSection({
	title,
	actionLabel,
	onAction,
	defaultExpanded = true,
	children,
}: PropsWithChildren<{
	title: string;
	actionLabel?: string;
	onAction?: () => void;
	defaultExpanded?: boolean;
}>) {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const muted = useThemeColor("muted");
	const accent = useThemeColor("accent");

	return (
		<View className="mb-2">
			<Pressable
				className="flex-row items-center justify-between px-4 py-3"
				onPress={() => setExpanded((prev) => !prev)}
			>
				<View className="flex-row items-center gap-2">
					<Ionicons
						color={muted}
						name={expanded ? "chevron-down" : "chevron-forward"}
						size={16}
					/>
					<Text
						className="text-muted text-xs uppercase tracking-wider"
						style={{ fontFamily: "SpaceGrotesk_600SemiBold" }}
					>
						{title}
					</Text>
				</View>
			</Pressable>

			{expanded ? (
				<Animated.View
					entering={FadeIn.duration(150)}
					exiting={FadeOut.duration(100)}
				>
					{children}

					{actionLabel && onAction ? (
						<Pressable
							className="flex-row items-center gap-2 px-4 py-2.5"
							onPress={onAction}
						>
							<Ionicons color={accent} name="add-circle-outline" size={20} />
							<Text
								className="text-sm"
								style={{
									fontFamily: "SpaceGrotesk_500Medium",
									color: accent,
								}}
							>
								{actionLabel}
							</Text>
						</Pressable>
					) : null}
				</Animated.View>
			) : null}
		</View>
	);
}
