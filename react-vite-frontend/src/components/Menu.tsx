import { NavLink } from 'react-router-dom'

const menuClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
    isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export function Menu() {
  return (
    <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-xl shadow-slate-950/20">
      <p className="px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Admin menu</p>
      <nav aria-label="Admin navigation" className="space-y-1">
        <NavLink to="/admin/products" end className={menuClass}>Products</NavLink>
        <NavLink to="/admin/products/create" className={menuClass}>Add product</NavLink>
      </nav>
    </aside>
  )
}
