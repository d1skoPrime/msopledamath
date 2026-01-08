'use client'

import { CheckCircle, Clock, Sparkles } from 'lucide-react'
import type React from 'react'

interface QueuePositionProps {
	position: number
}

export const QueuePosition: React.FC<QueuePositionProps> = ({ position }) => {
	return (
		<div className="text-center py-8">
			<div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
				<div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-full animate-pulse" />
				<div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
					<CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
				</div>
			</div>

			<h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
				<Sparkles className="w-5 h-5 text-emerald-500" />
				You're in line!
			</h2>
			<p className="text-muted-foreground mb-8 text-balance">
				Your teacher will help you soon
			</p>

			<div className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-br from-chart-1/10 to-chart-2/10 rounded-2xl border border-border backdrop-blur-sm">
				<Clock className="w-6 h-6 text-chart-1" />
				<span className="text-4xl font-bold bg-linear-to-br from-chart-1 to-chart-2 bg-clip-text text-transparent">
					#{position}
				</span>
				<span className="text-muted-foreground font-medium">in line</span>
			</div>
		</div>
	)
}
