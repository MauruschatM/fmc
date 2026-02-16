import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
	return (
		<NativeTabs>
			<NativeTabs.Trigger name="chat">
				<Icon
					sf={{
						default: "bubble.left.and.bubble.right",
						selected: "bubble.left.and.bubble.right.fill",
					}}
				/>
				<Label>Chat</Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="asks">
				<Icon
					sf={{
						default: "questionmark.circle",
						selected: "questionmark.circle.fill",
					}}
				/>
				<Label>Asks</Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="profile">
				<Icon sf={{ default: "person", selected: "person.fill" }} />
				<Label>Profil</Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
