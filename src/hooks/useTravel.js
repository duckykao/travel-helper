import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useTravel(travelId) {
  const [travel, setTravel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!travelId) return
    const unsub = onSnapshot(doc(db, 'travels', travelId), (snap) => {
      if (snap.exists()) {
        setTravel({ id: snap.id, ...snap.data() })
      }
      setLoading(false)
    })
    return unsub
  }, [travelId])

  async function updateTravel(fields) {
    await updateDoc(doc(db, 'travels', travelId), fields)
  }

  return { travel, loading, updateTravel }
}
