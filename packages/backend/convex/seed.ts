import { internalMutation } from "./_generated/server";

export const seedChannels = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("channels").first();
		if (existing) {
			return "Channels already seeded";
		}

		const channelsData = [
			{
				name: "Ankündigungen",
				slug: "ankuendigungen",
				type: "channel" as const,
				icon: "megaphone-outline",
				iconLibrary: "Ionicons",
				description: "Wichtige Ankündigungen und Updates",
				isDefault: true,
				sortOrder: 1,
			},
			{
				name: "Intros",
				slug: "intros",
				type: "channel" as const,
				icon: "hand-left-outline",
				iconLibrary: "Ionicons",
				description: "Stell dich der Community vor",
				isDefault: true,
				sortOrder: 2,
			},
			{
				name: "Podcast",
				slug: "podcast",
				type: "channel" as const,
				icon: "mic-outline",
				iconLibrary: "Ionicons",
				description: "Podcast Diskussionen",
				isDefault: false,
				sortOrder: 3,
			},
			{
				name: "OpenClaw",
				slug: "openclaw",
				type: "channel" as const,
				icon: "code-slash-outline",
				iconLibrary: "Ionicons",
				description: "OpenClaw Projekt",
				isDefault: false,
				sortOrder: 4,
			},
			{
				name: "Off-Topic",
				slug: "off-topic",
				type: "channel" as const,
				icon: "chatbubble-ellipses-outline",
				iconLibrary: "Ionicons",
				description: "Alles was sonst nirgends passt",
				isDefault: false,
				sortOrder: 5,
			},
			{
				name: "Berlin",
				slug: "berlin",
				type: "region" as const,
				icon: "location-outline",
				iconLibrary: "Ionicons",
				isDefault: false,
				sortOrder: 1,
			},
			{
				name: "München",
				slug: "muenchen",
				type: "region" as const,
				icon: "location-outline",
				iconLibrary: "Ionicons",
				isDefault: false,
				sortOrder: 2,
			},
			{
				name: "Cape Town",
				slug: "cape-town",
				type: "region" as const,
				icon: "location-outline",
				iconLibrary: "Ionicons",
				isDefault: false,
				sortOrder: 3,
			},
			{
				name: "NRW",
				slug: "nrw",
				type: "region" as const,
				icon: "location-outline",
				iconLibrary: "Ionicons",
				isDefault: false,
				sortOrder: 4,
			},
		];

		for (const channel of channelsData) {
			await ctx.db.insert("channels", channel);
		}

		return "Seeded 9 channels/regions";
	},
});
