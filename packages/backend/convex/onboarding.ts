import { mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const ensureDefaults = mutation({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const existingProfile = await ctx.db
			.query("userProfiles")
			.withIndex("by_userId", (q) => q.eq("userId", authUser._id))
			.unique();

		if (!existingProfile) {
			const now = Date.now();
			await ctx.db.insert("userProfiles", {
				userId: authUser._id,
				displayName: authUser.name ?? "User",
				createdAt: now,
				updatedAt: now,
			});
		}

		const defaultChannels = await ctx.db
			.query("channels")
			.filter((q) => q.eq(q.field("isDefault"), true))
			.collect();

		for (const channel of defaultChannels) {
			const existing = await ctx.db
				.query("channelMembers")
				.withIndex("by_user_channel", (q) =>
					q.eq("userId", authUser._id).eq("channelId", channel._id)
				)
				.unique();

			if (!existing) {
				await ctx.db.insert("channelMembers", {
					userId: authUser._id,
					channelId: channel._id,
					joinedAt: Date.now(),
				});
			}
		}
	},
});
