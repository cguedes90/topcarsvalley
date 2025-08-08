import { useState, useEffect } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  shortDescription?: string | null
  date: string
  time: string
  location: string
  maxParticipants: number
  currentParticipants: number
  category: string
  price: string
  isPublic: boolean
  isActive: boolean
  image?: string | null
  createdAt: string
  updatedAt: string
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (!response.ok) {
        throw new Error('Falha ao buscar eventos')
      }
      const data = await response.json()
      setEvents(data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return { events, loading, error, refetch: fetchEvents }
}
