import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const listByChannel = query({
	args: {
		channelId: v.id("channels"),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
			.order("desc")
			.paginate(args.paginationOpts);

		const messagesWithAuthors = await Promise.all(
			messages.page.map(async (message) => {
				const profile = await ctx.db
					.query("userProfiles")
					.withIndex("by_userId", (q) => q.eq("userId", message.authorId))
					.unique();
				return {
					...message,
					authorName: profile?.displayName ?? "Unknown",
					authorAvatarUrl: profile?.avatarUrl,
				};
			})
		);

		return {
			...messages,
			page: messagesWithAuthors,
		};
	},
});

export const listByConversation = query({
	args: {
		conversationId: v.id("conversations"),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const membership = await ctx.db
			.query("conversationMembers")
			.withIndex("by_user_conversation", (q) =>
				q.eq("userId", authUser._id).eq("conversationId", args.conversationId)
			)
			.unique();

		if (!membership) {
			throw new Error("Not a participant");
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_conversation", (q) =>
				q.eq("conversationId", args.conversationId)
			)
			.order("desc")
			.paginate(args.paginationOpts);

		const messagesWithAuthors = await Promise.all(
			messages.page.map(async (message) => {
				const profile = await ctx.db
					.query("userProfiles")
					.withIndex("by_userId", (q) => q.eq("userId", message.authorId))
					.unique();
				return {
					...message,
					authorName: profile?.displayName ?? "Unknown",
					authorAvatarUrl: profile?.avatarUrl,
				};
			})
		);

		return {
			...messages,
			page: messagesWithAuthors,
		};
	},
});

export const send = mutation({
	args: {
		channelId: v.optional(v.id("channels")),
		conversationId: v.optional(v.id("conversations")),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		if (!(args.channelId || args.conversationId)) {
			throw new Error("Must specify channelId or conversationId");
		}
		if (args.channelId && args.conversationId) {
			throw new Error("Cannot specify both channelId and conversationId");
		}

		const { channelId, conversationId } = args;

		if (channelId) {
			const membership = await ctx.db
				.query("channelMembers")
				.withIndex("by_user_channel", (q) =>
					q.eq("userId", authUser._id).eq("channelId", channelId)
				)
				.unique();

			if (!membership) {
				throw new Error("Not a member of this channel");
			}
		}

		if (conversationId) {
			const membership = await ctx.db
				.query("conversationMembers")
				.withIndex("by_user_conversation", (q) =>
					q.eq("userId", authUser._id).eq("conversationId", conversationId)
				)
				.unique();

			if (!membership) {
				throw new Error("Not a participant in this conversation");
			}
		}

		return await ctx.db.insert("messages", {
			channelId: args.channelId,
			conversationId: args.conversationId,
			authorId: authUser._id,
			content: args.content.trim(),
			createdAt: Date.now(),
		});
	},
});
