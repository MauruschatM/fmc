import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	channels: defineTable({
		name: v.string(),
		slug: v.string(),
		type: v.union(v.literal("channel"), v.literal("region")),
		icon: v.string(),
		iconLibrary: v.string(),
		description: v.optional(v.string()),
		isDefault: v.boolean(),
		sortOrder: v.number(),
	})
		.index("by_type", ["type", "sortOrder"])
		.index("by_slug", ["slug"]),

	channelMembers: defineTable({
		userId: v.string(),
		channelId: v.id("channels"),
		joinedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_channel", ["channelId"])
		.index("by_user_channel", ["userId", "channelId"]),

	conversations: defineTable({
		participantIds: v.array(v.string()),
		createdAt: v.number(),
	}).index("by_participants", ["participantIds"]),

	conversationMembers: defineTable({
		userId: v.string(),
		conversationId: v.id("conversations"),
	})
		.index("by_user", ["userId"])
		.index("by_conversation", ["conversationId"])
		.index("by_user_conversation", ["userId", "conversationId"]),

	messages: defineTable({
		channelId: v.optional(v.id("channels")),
		conversationId: v.optional(v.id("conversations")),
		authorId: v.string(),
		content: v.string(),
		createdAt: v.number(),
	})
		.index("by_channel", ["channelId", "createdAt"])
		.index("by_conversation", ["conversationId", "createdAt"]),

	userProfiles: defineTable({
		userId: v.string(),
		displayName: v.string(),
		bio: v.optional(v.string()),
		avatarUrl: v.optional(v.string()),
		location: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.searchIndex("search_name", { searchField: "displayName" }),
});
