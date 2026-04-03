import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
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

  return { travel, loading }
}
