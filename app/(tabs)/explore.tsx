import { StyleSheet } from 'react-native'
import { Notifications } from '@/components/notifications'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'
import { authClient } from '@/lib/auth-client'

export default function TabTwoScreen() {
	const { data } = authClient.useSession()
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			headerImage={<IconSymbol size={310} color='#808080' name='chevron.left.forwardslash.chevron.right' style={styles.headerImage} />}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText
					type='title'
					style={{
						fontFamily: Fonts.rounded,
					}}
				>
					Explore
				</ThemedText>
			</ThemedView>
			{data?.user.userId && <Notifications userId={data.user.userId} />}
		</ParallaxScrollView>
	)
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
})
