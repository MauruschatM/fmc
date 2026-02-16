import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const get = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return null;
		}

		const profile = await ctx.db
			.query("userProfiles")
			.withIndex("by_userId", (q) => q.eq("userId", authUser._id))
			.unique();

		return {
			authUser: {
				id: authUser._id,
				name: authUser.name,
				email: authUser.email,
			},
			profile,
		};
	},
});

export const getByUserId = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("userProfiles")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.unique();
	},
});

export const update = mutation({
	args: {
		displayName: v.optional(v.string()),
		bio: v.optional(v.string()),
		avatarUrl: v.optional(v.string()),
		location: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const existing = await ctx.db
			.query("userProfiles")
			.withIndex("by_userId", (q) => q.eq("userId", authUser._id))
			.unique();

		const now = Date.now();

		if (existing) {
			const updates: Record<string, unknown> = { updatedAt: now };
			if (args.displayName !== undefined) {
				updates.displayName = args.displayName;
			}
			if (args.bio !== undefined) {
				updates.bio = args.bio;
			}
			if (args.avatarUrl !== undefined) {
				updates.avatarUrl = args.avatarUrl;
			}
			if (args.location !== undefined) {
				updates.location = args.location;
			}

			await ctx.db.patch(existing._id, updates);
			return existing._id;
		}

		return await ctx.db.insert("userProfiles", {
			userId: authUser._id,
			displayName: args.displayName ?? authUser.name ?? "User",
			bio: args.bio,
			avatarUrl: args.avatarUrl,
			location: args.location,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const searchUsers = query({
	args: { searchTerm: v.string() },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}

		if (args.searchTerm.trim().length === 0) {
			return [];
		}

		const results = await ctx.db
			.query("userProfiles")
			.withSearchIndex("search_name", (q) =>
				q.search("displayName", args.searchTerm)
			)
			.take(20);

		return results.filter((p) => p.userId !== authUser._id);
	},
});
