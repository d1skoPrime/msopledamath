'use client'

import { PeriodSelector } from '@/app/components/PeriodSelector'
import { QueueList } from '@/app/components/QueueList'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { auth } from '@/lib/firebase'
import {
	generatePeriodCode,
	removeFromQueue,
	subscribeToPeriodData,
	subscribeToQueue
} from '@/lib/firestore'
import type { QueueItem } from '@/lib/types'
import { generateCode } from '@/lib/utils'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {
	ArrowLeft,
	Copy,
	Key,
	LayoutDashboard,
	RefreshCw,
	Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TeacherPage() {
	const router = useRouter()
	const [authenticated, setAuthenticated] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [authError, setAuthError] = useState('')
	const [period, setPeriod] = useState('1')
	const [currentCode, setCurrentCode] = useState('')
	const [queue, setQueue] = useState<QueueItem[]>([])
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		// Check if user is already authenticated
		const unsubscribe = auth.onAuthStateChanged(user => {
			setAuthenticated(!!user)
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		if (!authenticated) return

		// Subscribe to period data
		const unsubscribePeriod = subscribeToPeriodData(
			Number.parseInt(period),
			data => {
				if (data) {
					setCurrentCode(data.activeCode)
				} else {
					setCurrentCode('')
				}
			}
		)

		// Subscribe to queue
		const unsubscribeQueue = subscribeToQueue(Number.parseInt(period), setQueue)

		return () => {
			unsubscribePeriod()
			unsubscribeQueue()
		}
	}, [authenticated, period])

	const handleLogin = async () => {
		setAuthError('')
		try {
			await signInWithEmailAndPassword(auth, email, password)
			setAuthenticated(true)
		} catch (err) {
			setAuthError('Invalid email or password')
			console.error(err)
		}
	}

	const handleGenerateCode = async () => {
		const newCode = generateCode()
		await generatePeriodCode(Number.parseInt(period), newCode)
	}

	const handleMarkHelped = async (id: string) => {
		await removeFromQueue(Number.parseInt(period), id)
	}

	const handleCopyCode = () => {
		if (currentCode) {
			navigator.clipboard.writeText(currentCode)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	if (!authenticated) {
		return (
			<div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
				<div className="absolute top-0 right-1/4 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl animate-pulse" />

				<ThemeToggle />

				<div className="w-full max-w-md relative z-10">
					<div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-chart-1/10 to-chart-2/10 rounded-full blur-3xl -z-10" />

						<div className="text-center mb-8">
							<div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
								<div className="absolute inset-0 bg-linear-to-br from-chart-1/20 to-chart-2/20 rounded-2xl rotate-6 animate-pulse" />
								<div className="relative w-18 h-18 bg-linear-to-br from-chart-1 to-chart-2 rounded-2xl flex items-center justify-center shadow-lg">
									<Key className="w-9 h-9 text-white" />
								</div>
							</div>
							<h1 className="text-3xl font-bold text-foreground mb-2">
								Teacher Login
							</h1>
							<p className="text-muted-foreground">Access your dashboard</p>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-sm font-semibold text-foreground mb-3">
									Email
								</label>
								<input
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder="teacher@school.edu"
									className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-chart-1 focus:border-transparent outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-foreground mb-3">
									Password
								</label>
								<input
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									onKeyDown={e => e.key === 'Enter' && handleLogin()}
									placeholder="Enter password"
									className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-chart-1 focus:border-transparent outline-none transition-all"
								/>
							</div>

							{authError && (
								<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
									<p className="text-sm text-destructive">{authError}</p>
								</div>
							)}

							<button
								onClick={handleLogin}
								className="w-full bg-linear-to-r from-chart-1 to-chart-2 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-chart-1/30 active:scale-[0.98] transition-all"
							>
								Login
							</button>
						</div>

						<button
							onClick={() => router.push('/join')}
							className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group"
						>
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
							Back to Student View
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 p-4 md:p-8 relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
			<div className="absolute top-0 left-0 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl animate-pulse delay-1000" />

			<ThemeToggle />

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border p-6 md:p-8 mb-6">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-linear-to-br from-chart-1 to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
								<LayoutDashboard className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
									Teacher Dashboard
									<Sparkles className="w-6 h-6 text-chart-1" />
								</h1>
								<p className="text-sm text-muted-foreground">
									Manage your help queue
								</p>
							</div>
						</div>
						<button
							onClick={() => router.push('/join')}
							className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-accent"
						>
							Student View
							<ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<PeriodSelector
							value={period}
							onChange={setPeriod}
							label="Select Period"
							size="large"
						/>

						<div>
							<label className="block text-sm font-semibold text-foreground mb-3">
								Current Code
							</label>
							<div
								onClick={handleCopyCode}
								className="relative px-4 py-4 bg-linear-to-br from-chart-1/10 to-chart-2/10 rounded-xl border-2 border-chart-1/30 cursor-pointer hover:border-chart-1/50 transition-all group"
							>
								<span className="text-3xl font-bold bg-linear-to-br from-chart-1 to-chart-2 bg-clip-text text-transparent tracking-widest font-mono">
									{currentCode || '------'}
								</span>
								<Copy className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chart-1 opacity-0 group-hover:opacity-100 transition-opacity" />
								{copied && (
									<span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-foreground text-background px-2 py-1 rounded-lg">
										Copied!
									</span>
								)}
							</div>
						</div>

						<div className="flex items-end">
							<button
								onClick={handleGenerateCode}
								className="w-full bg-linear-to-r from-chart-1 to-chart-2 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-chart-1/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
							>
								<RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
								Generate New Code
							</button>
						</div>
					</div>
				</div>

				<div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-xl border border-border p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-foreground">Help Queue</h2>
						<div className="px-4 py-2 bg-muted rounded-xl">
							<span className="text-lg font-semibold text-foreground">
								{queue.length}
							</span>
							<span className="text-sm text-muted-foreground ml-2">
								{queue.length === 1 ? 'group' : 'groups'}
							</span>
						</div>
					</div>

					<QueueList
						queue={queue}
						onMarkHelped={handleMarkHelped}
					/>
				</div>
			</div>
			<h1 className="w-full mt-6 text-lg text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group">
				Made by Roman R.
			</h1>
		</div>
	)
}
