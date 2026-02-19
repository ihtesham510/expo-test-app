import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import { registerForPushNotificationsAsync } from '@/lib/register-for-push-notification'
import { useMutation } from 'convex/react'
import * as Notifications from 'expo-notifications'
import type React from 'react'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
})

interface NotificationContextType {
	expoPushToken: string | null
	notification: Notifications.Notification | null
	error: Error | null
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
	const context = useContext(NotificationContext)
	if (context === undefined) {
		throw new Error('useNotification must be used within a NotificationProvider')
	}
	return context
}

interface NotificationProviderProps {
	children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
	const [notification, setNotification] = useState<Notifications.Notification | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const addPushToken = useMutation(api.notifications.recordPushNotificationToken)
	const { data } = authClient.useSession()

	useEffect(() => {
		registerForPushNotificationsAsync().then(
			token => setExpoPushToken(token),
			error => setError(error),
		)

		const notificationListener = Notifications.addNotificationReceivedListener(notification => {
			console.log('🔔 Notification Received: ', notification)
			setNotification(notification)
		})

		const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
			console.log('🔔 Notification Response: ', response)
		})

		return () => {
			notificationListener.remove()
			responseListener.remove()
		}
	}, [])

	useEffect(() => {
		if (expoPushToken && data?.session.id) {
			; (async () => {
				console.log('🔔 Adding push token: ', expoPushToken)
				await addPushToken({ token: expoPushToken })
			})()
		}
	}, [expoPushToken, addPushToken, data?.session.id])

	return <NotificationContext.Provider value={{ expoPushToken, notification, error }}>{children}</NotificationContext.Provider>
}
