import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const listByType = query({
	args: { type: v.union(v.literal("channel"), v.literal("region")) },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("channels")
			.withIndex("by_type", (q) => q.eq("type", args.type))
			.collect();
	},
});

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("channels")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.unique();
	},
});

export const listJoined = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}

		const memberships = await ctx.db
			.query("channelMembers")
			.withIndex("by_user", (q) => q.eq("userId", authUser._id))
			.collect();

		const channels = await Promise.all(
			memberships.map((m) => ctx.db.get(m.channelId))
		);

		return channels.filter(Boolean);
	},
});

export const listAvailable = query({
	args: { type: v.union(v.literal("channel"), v.literal("region")) },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}

		const allChannels = await ctx.db
			.query("channels")
			.withIndex("by_type", (q) => q.eq("type", args.type))
			.collect();

		const memberships = await ctx.db
			.query("channelMembers")
			.withIndex("by_user", (q) => q.eq("userId", authUser._id))
			.collect();

		const joinedIds = new Set(memberships.map((m) => m.channelId.toString()));

		return allChannels.filter((c) => !joinedIds.has(c._id.toString()));
	},
});

export const join = mutation({
	args: { channelId: v.id("channels") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const existing = await ctx.db
			.query("channelMembers")
			.withIndex("by_user_channel", (q) =>
				q.eq("userId", authUser._id).eq("channelId", args.channelId)
			)
			.unique();

		if (existing) {
			return existing._id;
		}

		return await ctx.db.insert("channelMembers", {
			userId: authUser._id,
			channelId: args.channelId,
			joinedAt: Date.now(),
		});
	},
});

export const leave = mutation({
	args: { channelId: v.id("channels") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const membership = await ctx.db
			.query("channelMembers")
			.withIndex("by_user_channel", (q) =>
				q.eq("userId", authUser._id).eq("channelId", args.channelId)
			)
			.unique();

		if (membership) {
			await ctx.db.delete(membership._id);
		}
	},
});
