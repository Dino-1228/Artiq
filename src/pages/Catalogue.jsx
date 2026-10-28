import { useMemo, useState } from 'react'
import SectionHeading from '../components/common/SectionHeading'
import Carousel3D from '../components/3d/Carousel3D'
import CatalogueFilters, { matchesSearch } from '../components/gallery/CatalogueFilters'
import MasonryGallery from '../components/gallery/MasonryGallery'
import { useArtworks } from '../hooks/useArtwork'

export default function Catalogue() {
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [year, setYear] = useState('all')
  const [search, setSearch] = useState('')
  const { artworks, loading, error, retry } = useArtworks()
  const categories = useMemo(
    () => ['all', ...new Set(artworks.map((artwork) => artwork.category))],
    [artworks],
  )
  const years = useMemo(
    () => [...new Set(artworks.map((artwork) => artwork.year ? String(artwork.year) : 'missing'))]
      .sort((a, b) => a === 'missing' ? 1 : b === 'missing' ? -1 : Number(b) - Number(a)),
    [artworks],
  )

  const filtered = useMemo(
    () => artworks.filter((artwork) => {
      const matchesCategory = category === 'all' || artwork.category === category
      const matchesStatus = status === 'all' || artwork.status === status
      const matchesYear = year === 'all' || (year === 'missing' ? !artwork.year : String(artwork.year) === year)
      return matchesCategory && matchesStatus && matchesYear && matchesSearch(artwork, search)
    }),
    [category, status, year, search, artworks],
  )

  return (
    <div className="pt-32 sm:pt-40">
      <section className="px-6 pb-16 text-center sm:px-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Catalogue</span>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl md:text-7xl">
          THE COLLECTION
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
          {loading ? 'Loading the collection...' : error ? 'The collection is temporarily unavailable.' : `${artworks.length} paintings of gardens, landscapes and places.`}
        </p>
      </section>

      {error ? (
        <div className="px-6 pb-24 text-center text-zinc-600 sm:px-10" role="alert">
          <p>The collection could not be loaded right now.</p>
          <button type="button" onClick={retry} className="mt-4 min-h-11 rounded border border-neutral-300 px-5 py-2 font-medium text-zinc-950">Try again</button>
        </div>
      ) : loading ? (
        <p className="px-6 pb-24 text-center text-zinc-600 sm:px-10" aria-live="polite">Loading artwork...</p>
      ) : artworks.length > 0 ? (
        <section className="px-6 pb-24 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <Carousel3D artworks={artworks} />
          </div>
        </section>
      ) : null}

      {!loading && !error && <section className="px-6 pb-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker="Browse" title="Full Catalogue" className="mb-10" />
          <div className="mb-10">
            <CatalogueFilters
              categories={categories}
              activeCategory={category}
              onCategoryChange={setCategory}
              activeStatus={status}
              onStatusChange={setStatus}
              years={years}
              activeYear={year}
              onYearChange={setYear}
              search={search}
              onSearchChange={setSearch}
            />
          </div>
          <MasonryGallery artworks={filtered} />
        </div>
      </section>}
    </div>
  )
}
