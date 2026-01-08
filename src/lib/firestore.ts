import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'
import { PeriodData, QueueItem } from './types'

/**
 * Add a group to the help queue
 */
export const addToQueue = async (
	period: number,
	groupName: string
): Promise<void> => {
	await addDoc(collection(db, `classes/period_${period}/queue`), {
		groupName,
		createdAt: serverTimestamp()
	})
}

/**
 * Remove a group from the queue
 */
export const removeFromQueue = async (
	period: number,
	itemId: string
): Promise<void> => {
	await deleteDoc(doc(db, `classes/period_${period}/queue`, itemId))
}

/**
 * Listen to queue updates in real-time
 */
export const subscribeToQueue = (
	period: number,
	callback: (queue: QueueItem[]) => void
): Unsubscribe => {
	const q = query(
		collection(db, `classes/period_${period}/queue`),
		orderBy('createdAt', 'asc')
	)

	return onSnapshot(q, snapshot => {
		const queue = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		})) as QueueItem[]
		callback(queue)
	})
}

/**
 * Generate and save a new period code
 */
export const generatePeriodCode = async (
	period: number,
	code: string
): Promise<void> => {
	const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

	await setDoc(doc(db, `classes/period_${period}`), {
		activeCode: code,
		expiresAt
	})
}

/**
 * Get current period data
 */
export const getPeriodData = async (
	period: number
): Promise<PeriodData | null> => {
	const docRef = doc(db, `classes/period_${period}`)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		return docSnap.data() as PeriodData
	}
	return null
}

/**
 * Listen to period data changes
 */
export const subscribeToPeriodData = (
	period: number,
	callback: (data: PeriodData | null) => void
): Unsubscribe => {
	return onSnapshot(doc(db, `classes/period_${period}`), doc => {
		if (doc.exists()) {
			callback(doc.data() as PeriodData)
		} else {
			callback(null)
		}
	})
}
