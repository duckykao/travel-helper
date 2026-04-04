import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export function useItinerary(travelId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!travelId) return
    const q = query(
      collection(db, 'travels', travelId, 'itinerary'),
      orderBy('date')
    )
    const unsub = onSnapshot(q,
      (snap) => {
        const sorted = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
        setItems(sorted)
        setLoading(false)
      },
      (err) => {
        console.error('Failed to load itinerary:', err)
        setLoading(false)
      }
    )
    return unsub
  }, [travelId])

  async function addItem(data) {
    await addDoc(collection(db, 'travels', travelId, 'itinerary'), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  async function updateItem(itemId, data) {
    await updateDoc(doc(db, 'travels', travelId, 'itinerary', itemId), data)
  }

  async function deleteItem(itemId) {
    await deleteDoc(doc(db, 'travels', travelId, 'itinerary', itemId))
  }

  return { items, loading, addItem, updateItem, deleteItem }
}
