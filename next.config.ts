import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Keep it simple - no export
	images: {
		unoptimized: true
	},
	reactStrictMode: false,
	reactCompiler: true,
	trailingSlash: true // Important for Firebase
}

export default nextConfig
