import type { Metadata } from 'next'
import { AuthScreen } from '@/components/auth-screen'

export const metadata: Metadata = { title: 'Create an account | Dailymart', description: 'Make yourself at home. Create your Dailymart account.' }
export default function RegisterPage() { return <AuthScreen mode="register" /> }
