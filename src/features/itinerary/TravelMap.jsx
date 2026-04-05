import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CAR_DURATION = 2400  // 20% faster than 3000

// ── Icon factories ────────────────────────────────────────────────────────────

function makeIcon(content) {
  return L.divIcon({
    className: '',
    html: `<div style="font-size:22px;line-height:1">${content}</div>`,
    iconAnchor: [11, 22],
    popupAnchor: [0, -24],
  })
}

// Plain dot pin — no number
const dotPin = L.divIcon({
  className: '',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#6b7280;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
  iconAnchor: [5, 5],
  popupAnchor: [0, -8],
})

const CAR_SCHEMES = {
  taxi:      { body: '#FBBF24', dark: '#92400E',  isTaxi: true  },
  'blue-car':{ body: '#3B82F6', dark: '#1E40AF',  isTaxi: false },
  'red-car': { body: '#EF4444', dark: '#B91C1C',  isTaxi: false },
}

const LINE_COLORS = {
  'taxi':     '#FBBF24',
  'blue-car': '#3B82F6',
  'red-car':  '#EF4444',
}

function makeCarSideIcon(facingRight, { body, dark, isTaxi }) {
  const flip = facingRight ? 'none' : 'scaleX(-1)'
  const stripeSquares = [2,7,12,17,22,27,32,37,42]
    .map(x => `<rect x="${x}" y="15.5" width="2.5" height="2" fill="${body}"/>`)
    .join('')
  const taxi = isTaxi ? `
    <rect x="1" y="15" width="46" height="3" fill="#1F2937"/>${stripeSquares}
    <rect x="19" y="1" width="10" height="4"  rx="0.5" fill="#1F2937"/>
    <rect x="20" y="1.5" width="8" height="3" rx="0.5" fill="${body}"/>` : ''

  return L.divIcon({
    className: '',
    // viewBox kept at 0 0 48 26; rendered at 80% (38×21)
    html: `<div style="width:38px;height:21px;transform:${flip};transform-origin:center">
      <svg width="38" height="21" viewBox="0 0 48 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="12" width="46" height="11" rx="2" fill="${body}"/>
        <path d="M8 12 L13 4 L35 4 L41 12 Z" fill="${body}"/>
        <path d="M36 12 L33 5 L35 4 L41 12 Z" fill="#7DD3FC" opacity="0.85"/>
        <rect x="14" y="5" width="18" height="7" rx="1" fill="#BAE6FD" opacity="0.85"/>
        <path d="M8 12 L13 4 L15 4 L10 12 Z" fill="#7DD3FC" opacity="0.85"/>
        ${taxi}
        <circle cx="35" cy="23" r="4"   fill="#374151"/>
        <circle cx="35" cy="23" r="1.8" fill="#9CA3AF"/>
        <circle cx="13" cy="23" r="4"   fill="#374151"/>
        <circle cx="13" cy="23" r="1.8" fill="#9CA3AF"/>
        <rect x="43" y="17" width="4" height="2.5" rx="1" fill="#FEF08A"/>
        <rect x="1"  y="17" width="4" height="2.5" rx="1" fill="#FCA5A5"/>
        <line x1="25" y1="12" x2="25" y2="18" stroke="${dark}" stroke-width="0.8" opacity="0.5"/>
        <rect x="44" y="20" width="3" height="3" rx="0.5" fill="${dark}"/>
        <rect x="1"  y="20" width="3" height="3" rx="0.5" fill="${dark}"/>
      </svg>
    </div>`,
    iconAnchor: [19, 10],
    popupAnchor: [0, -12],
  })
}

function makeMovingIcon(iconKey, facingRight) {
  return makeCarSideIcon(facingRight, CAR_SCHEMES[iconKey] || CAR_SCHEMES.taxi)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getFacingRight(bear) {
  return Math.sin(bear * Math.PI / 180) >= 0
}

function getBearing(from, to) {
  const toRad = d => d * Math.PI / 180
  const lat1 = toRad(from.lat), lat2 = toRad(to.lat)
  const dLng = toRad(to.lng - from.lng)
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

const positionIcon = makeIcon('📍')
const homeIcon     = makeIcon('🏠')

// ── MapController ─────────────────────────────────────────────────────────────

function MapController({ position, mapIcon }) {
  const map = useMap()
  const prevPosRef = useRef(null)
  const animFrameRef = useRef(null)
  const moveEndHandlerRef = useRef(null)
  const [animPos, setAnimPos] = useState(null)
  const [facingRight, setFacingRight] = useState(true)
  const [routeLine, setRouteLine] = useState(null)
  const [arrived, setArrived] = useState(true)

  useEffect(() => {
    const cancelAll = () => {
      if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
      if (moveEndHandlerRef.current) { map.off('moveend', moveEndHandlerRef.current); moveEndHandlerRef.current = null }
    }

    if (!position) {
      cancelAll()
      setAnimPos(null)
      setRouteLine(null)
      prevPosRef.current = null
      return
    }

    const from = prevPosRef.current

    if (!from) {
      prevPosRef.current = position
      setAnimPos(position)
      map.setView([position.lat, position.lng], 15, { animate: false })
      return
    }

    if (from.lat === position.lat && from.lng === position.lng) return

    cancelAll()

    const bear = getBearing(from, position)
    setFacingRight(getFacingRight(bear))
    setRouteLine({ from, to: position })
    setArrived(false)

    const { lat: startLat, lng: startLng } = from
    const { lat: endLat, lng: endLng } = position

    map.flyToBounds(
      L.latLngBounds([[startLat, startLng], [endLat, endLng]]),
      { padding: [40, 40], maxZoom: 15, duration: 1.2 }
    )

    function startCarAnimation() {
      moveEndHandlerRef.current = null
      const startTime = performance.now()
      function animate(now) {
        const t = Math.min((now - startTime) / CAR_DURATION, 1)
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        setAnimPos({
          lat: startLat + (endLat - startLat) * ease,
          lng: startLng + (endLng - startLng) * ease,
        })
        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animate)
        } else {
          prevPosRef.current = position
          animFrameRef.current = null
          setArrived(true)
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }

    moveEndHandlerRef.current = startCarAnimation
    map.once('moveend', moveEndHandlerRef.current)

    return cancelAll
  }, [position, map])

  if (!animPos) return null

  const lineColor = LINE_COLORS[mapIcon] || LINE_COLORS.taxi

  return (
    <>
      {routeLine && (
        <Polyline
          positions={[[routeLine.from.lat, routeLine.from.lng], [routeLine.to.lat, routeLine.to.lng]]}
          pathOptions={{ color: lineColor, weight: 2, dashArray: '6 4', opacity: 0.8 }}
        />
      )}
      {!arrived && (
        <Marker position={[position.lat, position.lng]} icon={positionIcon}>
          <Popup>Current location</Popup>
        </Marker>
      )}
      <Marker position={[animPos.lat, animPos.lng]} icon={makeMovingIcon(mapIcon, facingRight)}>
        <Popup>Travelling</Popup>
      </Marker>
    </>
  )
}

// ── TravelMap ─────────────────────────────────────────────────────────────────

export default function TravelMap({ open, onToggle, position, pins, homeCoords, noLocations, mapIcon = 'taxi' }) {
  const defaultCenter = position
    ? [position.lat, position.lng]
    : homeCoords
    ? [homeCoords.lat, homeCoords.lng]
    : [25.0, 121.5]

  return (
    <div className="mb-4 isolate">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 mb-2"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
        {open ? 'Hide Map' : 'Show Map'}
        <span className="text-gray-400">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="relative rounded-xl overflow-hidden border border-gray-100 h-56">
          {noLocations && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-sm text-gray-400">No map locations on this day</p>
            </div>
          )}
          <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController position={position} mapIcon={mapIcon} />

            {homeCoords && (
              <Marker position={[homeCoords.lat, homeCoords.lng]} icon={homeIcon}>
                <Popup>Starting point</Popup>
              </Marker>
            )}

            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.coords.lat, pin.coords.lng]}
                icon={dotPin}
              >
                <Popup>{pin.title}{pin.startTime ? ` · ${pin.startTime}` : ''}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
