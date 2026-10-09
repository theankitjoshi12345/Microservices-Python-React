import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export function Navigation() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Primary navigation">
        <NavLink to="/" className="text-lg font-bold tracking-tight text-white">Product Workspace</NavLink>
        <div className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>Storefront</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Admin</NavLink>
        </div>
      </nav>
    </header>
  )
}
