import PostHog from 'posthog-react-native'

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const isConfigured = !!projectToken

if (__DEV__ && !isConfigured) {
  console.error(
    'EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  )
}

export const posthog = new PostHog(projectToken ?? 'placeholder_key', {
  host,
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
})
