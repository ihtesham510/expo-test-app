import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ThemedText } from './themed-text'
import { Collapsible } from './ui/collapsible'

export function Notifications({ userId }: { userId: string }) {
	const notifications = useQuery(api.notifications.getNotifications, {
		userId,
	})
	return (
		<>
			{notifications?.map(notification => (
				<Collapsible key={notification.id} title={notification.title ?? 'Unknown'}>
					<ThemedText>{notification.body ?? 'N/A'}</ThemedText>
				</Collapsible>
			))}
		</>
	)
}
