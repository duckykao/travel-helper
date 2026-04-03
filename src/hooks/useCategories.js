import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export function useCategories(travelId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!travelId) return
    const q = query(
      collection(db, 'travels', travelId, 'categories'),
      orderBy('createdAt')
    )
    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [travelId])

  async function addCategory({ label, color }) {
    await addDoc(collection(db, 'travels', travelId, 'categories'), {
      label, color, createdAt: serverTimestamp()
    })
  }

  async function deleteCategory(categoryId) {
    await deleteDoc(doc(db, 'travels', travelId, 'categories', categoryId))
  }

  return { categories, loading, addCategory, deleteCategory }
}
