import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy, writeBatch
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
          .sort((a, b) => {
            const aOrder = a.sortOrder ?? Infinity
            const bOrder = b.sortOrder ?? Infinity
            if (aOrder !== bOrder) return aOrder - bOrder
            return (a.startTime || '').localeCompare(b.startTime || '')
          })
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
      sortOrder: Date.now(),
      createdAt: serverTimestamp(),
    })
  }

  async function updateItem(itemId, data) {
    await updateDoc(doc(db, 'travels', travelId, 'itinerary', itemId), data)
  }

  async function deleteItem(itemId) {
    await deleteDoc(doc(db, 'travels', travelId, 'itinerary', itemId))
  }

  async function reorderItems(orderedIds) {
    const batch = writeBatch(db)
    orderedIds.forEach((id, index) => {
      batch.update(doc(db, 'travels', travelId, 'itinerary', id), { sortOrder: index * 1000 })
    })
    await batch.commit()
  }

  return { items, loading, addItem, updateItem, deleteItem, reorderItems }
}
