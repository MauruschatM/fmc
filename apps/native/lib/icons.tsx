import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const iconLibraries = {
	Ionicons,
	MaterialIcons,
} as const;

type IconLibrary = keyof typeof iconLibraries;

export function DynamicIcon({
	library,
	name,
	size,
	color,
}: {
	library: string;
	name: string;
	size: number;
	color: string;
}) {
	const IconComponent = iconLibraries[library as IconLibrary];
	if (!IconComponent) {
		return null;
	}
	return <IconComponent color={color} name={name as never} size={size} />;
}
