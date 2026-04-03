import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export function useExpenses(travelId) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!travelId) return
    const q = query(
      collection(db, 'travels', travelId, 'expenses'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [travelId])

  async function addExpense(data) {
    await addDoc(collection(db, 'travels', travelId, 'expenses'), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  async function updateExpense(expenseId, data) {
    await updateDoc(doc(db, 'travels', travelId, 'expenses', expenseId), data)
  }

  async function deleteExpense(expenseId) {
    await deleteDoc(doc(db, 'travels', travelId, 'expenses', expenseId))
  }

  return { expenses, loading, addExpense, updateExpense, deleteExpense }
}
