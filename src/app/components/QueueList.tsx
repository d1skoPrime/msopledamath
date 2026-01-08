'use client'

import type { QueueItem } from '@/lib/types'
import { CheckCircle, Users } from 'lucide-react'
import type React from 'react'

interface QueueListProps {
	queue: QueueItem[]
	onMarkHelped: (id: string) => void
}

export const QueueList: React.FC<QueueListProps> = ({
	queue,
	onMarkHelped
}) => {
	if (queue.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
					<div className="absolute inset-0 bg-muted rounded-full animate-pulse" />
					<div className="relative w-20 h-20 bg-muted rounded-full flex items-center justify-center">
						<Users className="w-10 h-10 text-muted-foreground" />
					</div>
				</div>
				<p className="text-muted-foreground text-lg font-medium">
					No groups in queue
				</p>
				<p className="text-sm text-muted-foreground/60 mt-2">
					Students will appear here when they join
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			{queue.map((item, index) => (
				<div
					key={item.id}
					className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
						index === 0
							? 'bg-linear-to-br from-chart-1/10 to-chart-2/10 border-chart-1/30 shadow-lg shadow-chart-1/5'
							: 'bg-card border-border hover:border-chart-1/20 hover:bg-accent/50'
					}`}
				>
					<div className="flex items-center gap-5">
						<div
							className={`flex items-center justify-center w-14 h-14 rounded-xl font-bold text-2xl transition-all ${
								index === 0
									? 'bg-linear-to-br from-chart-1 to-chart-2 text-white shadow-lg'
									: 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10'
							}`}
						>
							#{index + 1}
						</div>
						<div>
							<p className="text-xl font-semibold text-foreground mb-1">
								{item.groupName}
							</p>
							<p className="text-sm text-muted-foreground flex items-center gap-2">
								<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
								{new Date(item.createdAt).toLocaleTimeString()}
							</p>
						</div>
					</div>
					<button
						onClick={() => onMarkHelped(item.id)}
						className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30"
					>
						<CheckCircle className="w-5 h-5" />
						Helped
					</button>
				</div>
			))}
		</div>
	)
}
