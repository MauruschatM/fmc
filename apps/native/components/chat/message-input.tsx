import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MessageInput({
	onSend,
}: {
	onSend: (content: string) => void;
}) {
	const [text, setText] = useState("");
	const insets = useSafeAreaInsets();
	const foreground = useThemeColor("foreground");
	const muted = useThemeColor("muted");
	const accent = useThemeColor("accent");
	const secondary = useThemeColor("secondary");

	const handleSend = () => {
		const trimmed = text.trim();
		if (trimmed.length === 0) {
			return;
		}
		onSend(trimmed);
		setText("");
	};

	return (
		<View
			className="flex-row items-end gap-2 border-t border-t-secondary px-4 pt-2"
			style={{ paddingBottom: Math.max(insets.bottom, 8) }}
		>
			<TextInput
				className="max-h-[120px] min-h-[36px] flex-1 rounded-2xl px-4 py-2 text-sm"
				multiline
				onChangeText={setText}
				placeholder="Nachricht..."
				placeholderTextColor={muted}
				style={{
					fontFamily: "SpaceGrotesk_400Regular",
					color: foreground,
					backgroundColor: secondary,
				}}
				value={text}
			/>
			<Pressable
				className="mb-0.5 h-9 w-9 items-center justify-center rounded-full"
				onPress={handleSend}
				style={{
					backgroundColor: text.trim().length > 0 ? accent : secondary,
				}}
			>
				<Ionicons
					color={text.trim().length > 0 ? "#fff" : muted}
					name="arrow-up"
					size={20}
				/>
			</Pressable>
		</View>
	);
}
