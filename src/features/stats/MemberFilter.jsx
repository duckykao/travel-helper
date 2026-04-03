export default function MemberFilter({ members, selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
          selected === null
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        }`}
      >
        Overall
      </button>
      {members.map(m => (
        <button key={m} onClick={() => onSelect(m)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            selected === m
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}>
          {m}
        </button>
      ))}
    </div>
  )
}
