import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const NUMBERED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

function makeIcon(content, extra = '') {
  return L.divIcon({
    className: '',
    html: `<div style="font-size:22px;line-height:1;${extra}">${content}</div>`,
    iconAnchor: [11, 22],
    popupAnchor: [0, -24],
  })
}

function pinIcon(n) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:#6b7280;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:600;
      box-shadow:0 1px 3px rgba(0,0,0,0.3);
    ">${n}</div>`,
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  })
}

const positionIcon = makeIcon('📍')
const homeIcon = makeIcon('🏠')

function MapController({ position }) {
  const map = useMap()
  const prev = useRef(null)
  useEffect(() => {
    if (!position) return
    if (prev.current && prev.current.lat === position.lat && prev.current.lng === position.lng) return
    prev.current = position
    map.flyTo([position.lat, position.lng], 15, { animate: true, duration: 1.2 })
  }, [position, map])
  return null
}

export default function TravelMap({ open, onToggle, position, pins, homeCoords, noLocations }) {
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

            <MapController position={position} />

            {homeCoords && (
              <Marker position={[homeCoords.lat, homeCoords.lng]} icon={homeIcon}>
                <Popup>Starting point</Popup>
              </Marker>
            )}

            {pins.map((pin, i) => (
              <Marker
                key={pin.id}
                position={[pin.coords.lat, pin.coords.lng]}
                icon={pinIcon(NUMBERED[i] || i + 1)}
              >
                <Popup>{pin.title}{pin.startTime ? ` · ${pin.startTime}` : ''}</Popup>
              </Marker>
            ))}

            {position && (
              <Marker position={[position.lat, position.lng]} icon={positionIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
