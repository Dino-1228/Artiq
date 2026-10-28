import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'
import { artworks as fallbackArtworks } from '../data/artworks'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const fallbackBySlug = new Map(fallbackArtworks.map((artwork) => [artwork.slug, artwork]))

function imageUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

function normalizeArtwork(artwork) {
  const fallback = fallbackBySlug.get(artwork.slug)
  const images = (artwork.images || []).map((image) => imageUrl(image.path)).filter(Boolean)

  return {
    ...fallback,
    ...artwork,
    id: String(artwork.id),
    categoryLabel: artwork.category_label || fallback?.categoryLabel || artwork.category,
    image: images[0] || fallback?.image || '',
    images: images.length ? images : fallback?.images || [],
    alt: artwork.alt || fallback?.alt || artwork.title,
  }
}

export function useArtworks({ featured = false } = {}) {
  const [remoteArtworks, setRemoteArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let active = true
    let retryTimer
    const query = featured ? '?featured=1' : ''

    setLoading(true)
    setError(null)

    async function load(attempt = 0) {
      try {
        const data = await apiGet(`/artworks${query}`)
        if (!Array.isArray(data)) throw new Error('Invalid artwork response')
        if (!active) return
        setRemoteArtworks(data.map(normalizeArtwork))
        setLoading(false)
      } catch (loadError) {
        if (!active) return
        if (attempt < 2) {
          retryTimer = setTimeout(() => load(attempt + 1), 1500 * (attempt + 1))
          return
        }
        setError(loadError)
        setLoading(false)
      }
    }

    load()

    return () => {
      active = false
      clearTimeout(retryTimer)
    }
  }, [featured, requestVersion])

  return {
    artworks: remoteArtworks,
    loading,
    error,
    retry: () => setRequestVersion((version) => version + 1),
  }
}
