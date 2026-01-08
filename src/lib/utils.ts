export const generateCode = (): string => {
	return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const getStorageKey = (period: number): string => {
	return `queue_joined_period_${period}`
}

export const PERIODS = [1, 2, 3, 4, 5, 6]
