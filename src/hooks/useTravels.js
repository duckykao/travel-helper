import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'
import bcrypt from 'bcryptjs'

const DEFAULT_CATEGORIES = [
  { label: 'Hotel', color: '#FF6384' },
  { label: 'Food', color: '#36A2EB' },
  { label: 'Transport', color: '#FFCE56' },
  { label: 'Entertainment', color: '#4BC0C0' },
  { label: 'Other', color: '#9966FF' },
]

export function useTravels() {
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'travels'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setTravels(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  async function addTravel({ name, members, date, endDate, password, currency = 'USD' }) {
    const passwordHash = await bcrypt.hash(password, 10)
    const travelRef = await addDoc(collection(db, 'travels'), {
      name,
      members,
      date,
      endDate,
      passwordHash,
      currency,
      createdAt: serverTimestamp(),
    })
    // Seed default categories
    const catCol = collection(db, 'travels', travelRef.id, 'categories')
    await Promise.all(
      DEFAULT_CATEGORIES.map(cat =>
        addDoc(catCol, { ...cat, createdAt: serverTimestamp() })
      )
    )
  }

  async function deleteTravel(travelId) {
    await deleteDoc(doc(db, 'travels', travelId))
  }

  return { travels, loading, addTravel, deleteTravel }
}
