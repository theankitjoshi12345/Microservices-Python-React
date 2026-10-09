import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../interfaces/product'
import { ADMIN_API_URL, getErrorMessage } from '../../lib/api'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    async function syncProducts() {
      try {
        const response = await fetch(`${ADMIN_API_URL}/products/`)
        if (!response.ok) throw new Error(await getErrorMessage(response))
        const data: Product[] = await response.json()
        if (active) setProducts(data)
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load products.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void syncProducts()
    return () => { active = false }
  }, [])

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return

    setDeletingId(product.id)
    setError('')
    try {
      const response = await fetch(`${ADMIN_API_URL}/products/${product.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(await getErrorMessage(response))
      setProducts((currentProducts) => currentProducts.filter(({ id }) => id !== product.id))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="text-slate-400">Loading products…</p>

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-slate-400">Create, update, or remove products from the source-of-truth catalog.</p>
        <Link to="/admin/products/create" className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">Add product</Link>
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</p>}
      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">No products yet. Create the first one.</p>
      ) : (
        <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <img src={product.image} alt="" className="h-14 w-14 rounded-lg bg-slate-800 object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-white">{product.title}</h2>
                <p className="text-sm text-slate-400">#{product.id} · {product.likes ?? 0} likes</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/products/${product.id}/edit`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-300">Edit</Link>
                <button type="button" onClick={() => void deleteProduct(product)} disabled={deletingId === product.id} className="rounded-lg border border-rose-500/50 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                  {deletingId === product.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
