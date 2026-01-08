import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Classroom Help Queue',
	description: 'Real-time classroom help queue system'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={`font-sans antialiased`}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
