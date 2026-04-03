import { createContext, useContext, useState } from 'react'

const TravelContext = createContext(null)

const STORAGE_KEY = 'travel_helper_unlocked'

function getUnlockedSet() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

function saveUnlockedSet(set) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function TravelProvider({ children }) {
  const [currentTravel, setCurrentTravel] = useState(null)
  const [unlockedIds] = useState(() => getUnlockedSet())

  function unlockTravel(travelId) {
    unlockedIds.add(travelId)
    saveUnlockedSet(unlockedIds)
  }

  function isUnlocked(travelId) {
    return unlockedIds.has(travelId)
  }

  return (
    <TravelContext.Provider value={{ currentTravel, setCurrentTravel, unlockTravel, isUnlocked }}>
      {children}
    </TravelContext.Provider>
  )
}

export function useTravelContext() {
  return useContext(TravelContext)
}
