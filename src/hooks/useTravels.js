import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'
import bcrypt from 'bcryptjs'
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
    await addDoc(collection(db, 'travels'), {
      name,
      members,
      date,
      endDate,
      passwordHash,
      currency,
      createdAt: serverTimestamp(),
    })
  }

  async function deleteTravel(travelId) {
    await deleteDoc(doc(db, 'travels', travelId))
  }

  return { travels, loading, addTravel, deleteTravel }
}
