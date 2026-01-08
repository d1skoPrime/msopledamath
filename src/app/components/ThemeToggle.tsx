'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()

	return (
		<button
			onClick={toggleTheme}
			className="fixed top-6 right-6 p-3 rounded-xl bg-card border border-border hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl z-50"
			aria-label="Toggle theme"
		>
			{theme === 'light' ? (
				<Moon className="w-5 h-5 text-foreground" />
			) : (
				<Sun className="w-5 h-5 text-foreground" />
			)}
		</button>
	)
}
