import type { Metadata } from 'next'
import { AuthScreen } from '@/components/auth-screen'

export const metadata: Metadata = { title: 'Log in | Dailymart', description: 'Your everyday favourites, all in one place. Log in to Dailymart.' }
export default function LoginPage() { return <AuthScreen mode="login" /> }
