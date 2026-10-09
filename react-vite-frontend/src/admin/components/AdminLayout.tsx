import { Outlet } from 'react-router-dom'
import { Menu } from '../../components/Menu'

export function AdminLayout() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[13rem_1fr]">
      <Menu />
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Product management</h1>
        <div className="mt-8"><Outlet /></div>
      </section>
    </main>
  )
}
