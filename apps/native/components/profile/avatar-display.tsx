import { Image, Text, View } from "react-native";

const AVATAR_COLORS = [
	"#6366f1",
	"#8b5cf6",
	"#ec4899",
	"#f43f5e",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#3b82f6",
];

function hashColor(name: string): string {
	let hash = 0;
	for (const char of name) {
		hash = char.charCodeAt(0) + hash * 31;
	}
	return (
		AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function AvatarDisplay({
	name,
	avatarUrl,
	size = 40,
}: {
	name: string;
	avatarUrl?: string | null;
	size?: number;
}) {
	if (avatarUrl) {
		return (
			<Image
				source={{ uri: avatarUrl }}
				style={{
					width: size,
					height: size,
					borderRadius: size / 2,
				}}
			/>
		);
	}

	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: hashColor(name),
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text
				style={{
					color: "#fff",
					fontSize: size * 0.4,
					fontFamily: "SpaceGrotesk_600SemiBold",
				}}
			>
				{getInitials(name)}
			</Text>
		</View>
	);
}
