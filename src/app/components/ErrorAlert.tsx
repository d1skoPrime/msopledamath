'use client'

import { AlertCircle } from 'lucide-react'
import type React from 'react'

interface ErrorAlertProps {
	message: string
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
	if (!message) return null

	return (
		<div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl backdrop-blur-sm">
			<AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
			<p className="text-sm text-destructive leading-relaxed">{message}</p>
		</div>
	)
}
