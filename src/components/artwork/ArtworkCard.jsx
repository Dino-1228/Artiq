import { useEffect, useRef, useState } from 'react'
import { attachTilt } from '../../animations/microInteractions'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice'
import { formatPrice } from '../../utils/formatPrice'
import AddToCartButton from '../cart/AddToCartButton'

export function artworkMeta(artwork) {
  const size = artwork.dimensions && artwork.dimensions !== 'Dimensions on request'
    ? artwork.dimensions
    : 'Size on request'
  const year = artwork.year || 'Year not provided'
  return [artwork.medium || 'Medium not provided', size, year].join(' · ')
}

export function artworkPrice(artwork) {
  return artwork.status === 'sold' ? 'Sold' : formatPrice(artwork.price)
}

export function artworkStatusLabel(artwork) {
  if (artwork.status === 'exhibition') return 'On show/exhibition purpose'
  if (artwork.status === 'sold' || artwork.available === false) return 'Sold'
  return 'For sale'
}

export function artworkStatusClass(artwork) {
  if (artwork.status === 'exhibition') return 'bg-amber-50 text-amber-700'
  if (artwork.status === 'sold' || artwork.available === false) return 'bg-neutral-100 text-neutral-500'
  return 'bg-emerald-50 text-emerald-700'
}

export default function ArtworkCard({ artwork, priority = false, tilt = true, className = '' }) {
  const cardRef = useRef(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const [portraitImage, setPortraitImage] = useState(artwork.aspect === 'portrait')
  const frameClass = portraitImage ? 'aspect-[4/5]' : artwork.aspect === 'square' ? 'aspect-square' : 'aspect-[5/4]'
  const details = [
    ['Medium', artwork.medium || 'Medium not provided'],
    ['Size', artwork.dimensions && artwork.dimensions !== 'Dimensions on request' ? artwork.dimensions : 'Size on request'],
    ['Year', artwork.year || 'Year not provided'],
  ]

  useEffect(() => {
    if (!tilt) return
    return attachTilt(cardRef.current, { reduced: reduced || isTouch, max: 5, scale: 1.015 })
  }, [tilt, reduced, isTouch])

  return (
    <div className={`group ${className}`}>
      <div
        ref={cardRef}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative ${frameClass} overflow-hidden rounded-2xl bg-neutral-100`}
      >
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.alt}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={(event) => setPortraitImage(event.currentTarget.naturalHeight > event.currentTarget.naturalWidth)}
            className={`h-full w-full ${portraitImage ? 'object-contain bg-neutral-50 p-2' : 'object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]'}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">Image not provided</div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-display text-lg font-semibold text-zinc-950">{artwork.title}</h3>
        <dl className="mt-2 space-y-1 text-base">
          {details.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[4rem_1fr] gap-2">
              <dt className="text-zinc-500">{label}</dt>
              <dd className="min-w-0 text-zinc-700">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3"><span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${artworkStatusClass(artwork)}`}>{artworkStatusLabel(artwork)}</span></p>
        {artworkStatusLabel(artwork) !== 'Sold' && (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-zinc-950">{artworkPrice(artwork)}</p>
            <AddToCartButton artwork={artwork} size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
