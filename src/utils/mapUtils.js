export function extractCoords(locationStr) {
  if (!locationStr) return null
  // Prefer !3d{lat}!...!4d{lng} — exact place pin in the data parameter
  const latM = locationStr.match(/!3d(-?\d+\.\d+)/)
  const lngM = locationStr.match(/!4d(-?\d+\.\d+)/)
  if (latM && lngM) return { lat: parseFloat(latM[1]), lng: parseFloat(lngM[1]) }
  // Fall back to @lat,lng — map view centre (less precise)
  const m = locationStr.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (!m) return null
  return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
}

export function computeMapPosition(allItems, selectedId, homeCoords) {
  if (!selectedId) return homeCoords || null

  const sorted = [...allItems].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return (a.startTime || '').localeCompare(b.startTime || '')
  })

  const idx = sorted.findIndex(i => i.id === selectedId)
  if (idx === -1) return homeCoords || null

  for (let i = idx; i >= 0; i--) {
    const coords = extractCoords(sorted[i].location)
    if (coords) return coords
  }

  return homeCoords || null
}
