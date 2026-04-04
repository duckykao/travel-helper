import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, query
} from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_CATEGORIES } from '../utils/defaultCategories'

const DEFAULT_LABELS = new Set(DEFAULT_CATEGORIES.map(d => d.label))

export function useCategories(travelId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!travelId) return
    const unsub = onSnapshot(
      query(collection(db, 'travels', travelId, 'categories')),
      (snap) => {
        const firestoreDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        // For each default, use the Firestore version if it exists (real ID preserved),
        // otherwise show it as a virtual entry — no Firestore write needed
        const merged = DEFAULT_CATEGORIES.map((def, i) => {
          const existing = firestoreDocs.find(d => d.label === def.label)
          return existing ?? { ...def, id: `default-${i}`, _virtual: true }
        })

        // Append any custom (non-default) categories from Firestore
        const custom = firestoreDocs.filter(d => !DEFAULT_LABELS.has(d.label))

        setCategories([...merged, ...custom])
        setLoading(false)
      },
      (error) => {
        console.error('Categories listener error:', error)
        setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `default-${i}`, _virtual: true })))
        setLoading(false)
      }
    )
    return unsub
  }, [travelId])

  async function addCategory({ label, color, icon = '' }) {
    await addDoc(collection(db, 'travels', travelId, 'categories'), {
      label, color, icon, createdAt: new Date()
    })
  }

  async function deleteCategory(categoryId) {
    if (categoryId.startsWith('default-')) return // virtual default — nothing in Firestore
    await deleteDoc(doc(db, 'travels', travelId, 'categories', categoryId))
  }

  return { categories, loading, addCategory, deleteCategory }
}
