import { useState } from 'react'
import bcrypt from 'bcryptjs'
import Modal from './Modal'

export default function DeleteTripModal({ open, onClose, travel, onConfirm }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!travel) return
    setChecking(true)
    setError('')
    try {
      const match = await bcrypt.compare(password, travel.passwordHash)
      if (match) {
        onConfirm(travel.id)
        onClose()
        setPassword('')
      } else {
        setError('Incorrect password.')
      }
    } finally {
      setChecking(false)
    }
  }

  function handleClose() {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Delete Trip">
      <p className="text-sm text-gray-600 mb-4">
        Enter the trip password to permanently delete <span className="font-medium">{travel?.name}</span>.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Trip password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={handleClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={checking || !password}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50">
            {checking ? 'Checking...' : 'Delete'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
