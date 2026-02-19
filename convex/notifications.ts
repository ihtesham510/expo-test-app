import { PushNotifications } from '@convex-dev/expo-push-notifications'
import { v } from 'convex/values'
import { components } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { mutation } from './_generated/server'
import { getuserIdentity } from './auth'

const pushNotifications = new PushNotifications<Id<'user'>>(components.pushNotifications, {
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
		const normalizedId = ctx.db.normalizeId('user', args.to)
		if (normalizedId) {
			return await pushNotifications.sendPushNotification(ctx, {
				userId: normalizedId,
				notification: {
					title: args.title,
				},
			})
		}
	},
})
