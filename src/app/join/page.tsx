'use client'

import { ErrorAlert } from '@/app/components/ErrorAlert'
import { PeriodSelector } from '@/app/components/PeriodSelector'
import { QueuePosition } from '@/app/components/QueuePosition'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { addToQueue, getPeriodData, subscribeToQueue } from '@/lib/firestore'
import { getStorageKey } from '@/lib/utils'
import { ArrowRight, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function JoinPage() {
	const router = useRouter()
	const [period, setPeriod] = useState('1')
	const [groupName, setGroupName] = useState('')
	const [code, setCode] = useState('')
	const [joined, setJoined] = useState(false)
	const [position, setPosition] = useState(0)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Check if already joined this period
		const hasJoined = localStorage.getItem(
			getStorageKey(Number.parseInt(period))
		)
		if (hasJoined) {
			setJoined(true)
		}
	}, [period])

	useEffect(() => {
		if (!joined) return

		// Subscribe to queue updates to track position
		const unsubscribe = subscribeToQueue(Number.parseInt(period), queue => {
			const myGroup = localStorage.getItem(
				getStorageKey(Number.parseInt(period))
			)
			const pos = queue.findIndex(item => item.groupName === myGroup)

			if (pos >= 0) {
				setPosition(pos + 1)
			} else {
				// Group was removed from queue
				setJoined(false)
				localStorage.removeItem(getStorageKey(Number.parseInt(period)))
			}
		})

		return () => unsubscribe()
	}, [joined, period])

	const handleJoin = async () => {
		setError('')

		if (!groupName.trim()) {
			setError('Please enter a group name')
			return
		}

		if (!code.trim()) {
			setError('Please enter the period code')
			return
		}

		setLoading(true)

		try {
			// Verify the period code
			const periodData = await getPeriodData(Number.parseInt(period))

			if (!periodData || periodData.activeCode !== code.toUpperCase()) {
				setError('Invalid code. Please check with your teacher.')
				setLoading(false)
				return
			}

			if (periodData.expiresAt < Date.now()) {
				setError(
					'This code has expired. Please get a new code from your teacher.'
				)
				setLoading(false)
				return
			}

			// Add to queue
			await addToQueue(Number.parseInt(period), groupName.trim())

			// Store in localStorage to prevent duplicate joins
			localStorage.setItem(
				getStorageKey(Number.parseInt(period)),
				groupName.trim()
			)
			setJoined(true)
		} catch (err) {
			setError('Something went wrong. Please try again.')
			console.error(err)
		}

		setLoading(false)
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl animate-pulse delay-1000" />

			<ThemeToggle />

			<div className="w-full max-w-lg relative z-10">
				<div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-chart-1/10 to-chart-2/10 rounded-full blur-3xl -z-10" />

					<div className="text-center mb-8">
						<div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
							<div className="absolute inset-0 bg-linear-to-br from-chart-1/20 to-chart-2/20 rounded-2xl rotate-6 animate-pulse" />
							<div className="relative w-18 h-18 bg-linear-to-br from-chart-1 to-chart-2 rounded-2xl flex items-center justify-center shadow-lg">
								<Users className="w-10 h-10 text-white" />
							</div>
						</div>
						<h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
							Join Help Queue
							<Sparkles className="w-5 h-5 text-chart-1" />
						</h1>
						<p className="text-muted-foreground text-balance">
							Request help from your teacher
						</p>
					</div>

					{!joined ? (
						<div className="space-y-5">
							<PeriodSelector
								value={period}
								onChange={setPeriod}
							/>

							<div>
								<label className="block text-sm font-semibold text-foreground mb-3">
									Group Name
								</label>
								<input
									type="text"
									value={groupName}
									onChange={e => setGroupName(e.target.value)}
									placeholder="Enter your group name (Enter the name of one person from your group)"
									className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-chart-1 focus:border-transparent outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-foreground mb-3">
									Period Code
								</label>
								<input
									type="text"
									value={code}
									onChange={e => setCode(e.target.value.toUpperCase())}
									placeholder="Enter code from teacher"
									className="w-full px-4 py-3.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-chart-1 focus:border-transparent outline-none uppercase tracking-widest font-mono text-lg transition-all"
									maxLength={6}
								/>
							</div>

							<ErrorAlert message={error} />

							<button
								onClick={handleJoin}
								disabled={loading}
								className="w-full bg-linear-to-r from-chart-1 to-chart-2 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-chart-1/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
							>
								{loading ? 'Joining...' : 'Join Help Queue'}
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>
					) : (
						<QueuePosition position={position} />
					)}
				</div>

				<button
					onClick={() => router.push('/teacher')}
					className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group"
				>
					Teacher Dashboard
					<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</button>
				<h1 className="w-full mt-6 text-lg text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 group">
					Made by Roman R.
				</h1>
			</div>
		</div>
	)
}
