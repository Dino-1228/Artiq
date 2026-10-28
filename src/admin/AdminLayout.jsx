import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminFetch } from './api'
import { useAdminAuth } from './AdminAuthContext'
import { site } from '../data/site'

const PAGES = [
  { to: '/admin/home', label: 'Home' },
  { to: '/admin/about', label: 'About' },
  { to: '/admin/catalogue', label: 'Catalogue' },
  { to: '/admin/cart', label: 'Cart & Checkout' },
  { to: '/admin/site', label: 'Site-wide' },
]

export default function AdminLayout() {
  const { setAuthed } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await adminFetch('/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('admin_token')
    setAuthed(false)
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink md:flex-row">
      <header className="border-b border-neutral-200 p-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="max-w-[14rem] font-display text-sm font-semibold leading-tight text-ink">{site.brandName}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">Admin</p>
          </div>
          <button type="button" onClick={handleLogout} className="min-h-11 px-3 text-sm text-neutral-600 hover:text-ink">
            Log out
          </button>
        </div>
        <nav aria-label="Admin navigation" className="mt-2 -mx-1 flex gap-1 overflow-x-auto pb-1">
          {PAGES.map((page) => (
            <NavLink
              key={page.to}
              to={page.to}
              className={({ isActive }) =>
                `shrink-0 rounded px-3 py-2 text-sm ${isActive ? 'bg-ink text-white' : 'text-neutral-700 hover:bg-neutral-100'}`
              }
            >
              {page.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <aside className="hidden w-56 shrink-0 border-r border-neutral-200 p-6 md:block">
        <p className="max-w-[11rem] font-display text-base font-semibold leading-tight text-ink">{site.brandName}</p>
        <p className="mb-6 mt-2 text-xs uppercase tracking-wide text-neutral-500">Admin pages</p>
        <nav aria-label="Admin navigation">
          <ul className="space-y-1">
            {PAGES.map((page) => (
              <li key={page.to}>
                <NavLink
                  to={page.to}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-ink text-white' : 'text-neutral-700 hover:bg-neutral-100'}`
                  }
                >
                  {page.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" onClick={handleLogout} className="mt-8 text-sm text-neutral-500 hover:text-ink">
          Log out
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8"><Outlet /></main>
    </div>
  )
}
