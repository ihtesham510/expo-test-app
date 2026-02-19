import { PushNotifications } from '@convex-dev/expo-push-notifications'
import { v } from 'convex/values'
import { components } from './_generated/api'
import { internalMutation, mutation } from './_generated/server'
import { getuserIdentity } from './auth'

const pushNotifications = new PushNotifications<string>(components.pushNotifications, {
	logLevel: 'DEBUG',
})

export const recordPushNotificationToken = mutation({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const userId = await getuserIdentity(ctx)
		if (userId) {
			await pushNotifications.recordToken(ctx, {
				userId,
				pushToken: args.token,
			})
		}
	},
})

export const sendPushNotification = mutation({
	args: { title: v.string(), to: v.string() },
	handler: async (ctx, args) => {
		return await pushNotifications.sendPushNotification(ctx, {
			userId: args.to,
			notification: {
				title: args.title,
				badge: 1,
			},
		})
	},
})

export const sendInternalNotification = internalMutation({
	args: {
		title: v.string(),
		body: v.string(),
		to: v.string(),
		badge: v.optional(v.number()),
		data: v.record(v.string(), v.any()),
		priority: v.optional(v.union(v.literal('high'), v.literal('normal'), v.literal('default'))),
		subtitle: v.optional(v.string()),
		ttl: v.optional(v.number()),
		expiration: v.optional(v.number()),
		interruptionLevel: v.optional(v.union(v.literal('active'), v.literal('passive'), v.literal('critical'), v.literal('time-sensitive'))),
	},
	async handler(ctx, args) {
		await pushNotifications.sendPushNotification(ctx, {
			userId: args.to,
			notification: {
				body: args.body,
				title: args.title,
				badge: args.badge,
				data: args.data,
				priority: args.priority,
				subtitle: args.subtitle,
				ttl: args.ttl,
				expiration: args.expiration,
				interruptionLevel: args.interruptionLevel,
			},
		})
	},
})
