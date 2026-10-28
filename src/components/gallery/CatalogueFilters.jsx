import { CATEGORY_LABELS } from '../../data/artworks'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All artworks' },
  { value: 'exhibition', label: 'On show/exhibition purpose' },
  { value: 'for_sale', label: 'For sale' },
  { value: 'sold', label: 'Sold' },
]

const selectClass = 'mt-1 block min-w-0 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15'

export function matchesSearch(artwork, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [artwork.title, artwork.medium, artwork.dimensions, artwork.year, artwork.category_label || artwork.categoryLabel]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

export default function CatalogueFilters({ categories, activeCategory, onCategoryChange, activeStatus, onStatusChange, years, activeYear, onYearChange, search, onSearchChange }) {
  return (
    <div className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500 sm:col-span-2 lg:col-span-3">
        Search
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, medium, size or year"
          className={selectClass}
        />
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
        Category
        <select value={activeCategory} onChange={(event) => onCategoryChange(event.target.value)} className={selectClass}>
          {categories.map((category) => (
            <option key={category} value={category}>{CATEGORY_LABELS[category] || category}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
        Artwork status
        <select value={activeStatus} onChange={(event) => onStatusChange(event.target.value)} className={selectClass}>
          {STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
        Year
        <select value={activeYear} onChange={(event) => onYearChange(event.target.value)} className={selectClass}>
          <option value="all">All years</option>
          {years.map((year) => <option key={year} value={year}>{year === 'missing' ? 'Year not provided' : year}</option>)}
        </select>
      </label>
    </div>
  )
}
