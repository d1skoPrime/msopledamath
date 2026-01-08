'use client'

import { PERIODS } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import type React from 'react'

interface PeriodSelectorProps {
	value: string
	onChange: (value: string) => void
	label?: string
	size?: 'default' | 'large'
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
	value,
	onChange,
	label = 'Period',
	size = 'default'
}) => {
	const sizeClasses = size === 'large' ? 'text-lg py-4' : 'py-3.5'

	return (
		<div>
			<label className="block text-sm font-semibold text-foreground mb-3  items-center gap-2">
				<Calendar className="w-4 h-4" />
				{label}
			</label>
			<select
				value={value}
				onChange={e => onChange(e.target.value)}
				className={`w-full px-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-chart-1 focus:border-transparent outline-none transition-all ${sizeClasses} cursor-pointer hover:border-chart-1/40`}
			>
				{PERIODS.map(p => (
					<option
						key={p}
						value={p}
					>
						Period {p}
					</option>
				))}
			</select>
		</div>
	)
}
