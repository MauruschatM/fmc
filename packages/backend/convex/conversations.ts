import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const listForUser = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}

		const memberships = await ctx.db
			.query("conversationMembers")
			.withIndex("by_user", (q) => q.eq("userId", authUser._id))
			.collect();

		const conversations = await Promise.all(
			memberships.map(async (m) => {
				const conversation = await ctx.db.get(m.conversationId);
				if (!conversation) {
					return null;
				}

				const otherUserId = conversation.participantIds.find(
					(id) => id !== authUser._id
				);

				const otherProfile = otherUserId
					? await ctx.db
							.query("userProfiles")
							.withIndex("by_userId", (q) => q.eq("userId", otherUserId))
							.unique()
					: null;

				const lastMessage = await ctx.db
					.query("messages")
					.withIndex("by_conversation", (q) =>
						q.eq("conversationId", conversation._id)
					)
					.order("desc")
					.first();

				return {
					...conversation,
					otherUser: otherProfile
						? {
								userId: otherUserId ?? "",
								displayName: otherProfile.displayName,
								avatarUrl: otherProfile.avatarUrl,
							}
						: { userId: otherUserId ?? "", displayName: "Unknown" },
					lastMessage: lastMessage
						? { content: lastMessage.content, createdAt: lastMessage.createdAt }
						: null,
				};
			})
		);

		const filtered = conversations.filter(
			(c): c is NonNullable<typeof c> => c !== null
		);
		return filtered.sort((a, b) => {
			const aTime = a.lastMessage?.createdAt ?? a.createdAt;
			const bTime = b.lastMessage?.createdAt ?? b.createdAt;
			return bTime - aTime;
		});
	},
});

export const getOrCreate = mutation({
	args: { otherUserId: v.string() },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		if (args.otherUserId === authUser._id) {
			throw new Error("Cannot create a conversation with yourself");
		}

		const sortedIds = [authUser._id, args.otherUserId].sort();

		const existing = await ctx.db
			.query("conversations")
			.withIndex("by_participants", (q) => q.eq("participantIds", sortedIds))
			.unique();

		if (existing) {
			return existing._id;
		}

		const conversationId = await ctx.db.insert("conversations", {
			participantIds: sortedIds,
			createdAt: Date.now(),
		});

		await ctx.db.insert("conversationMembers", {
			userId: authUser._id,
			conversationId,
		});

		await ctx.db.insert("conversationMembers", {
			userId: args.otherUserId,
			conversationId,
		});

		return conversationId;
	},
});
