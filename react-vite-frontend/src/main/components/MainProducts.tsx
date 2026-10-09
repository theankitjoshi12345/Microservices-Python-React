import { useEffect, useState } from 'react'
import type { Product } from '../../interfaces/product'
import { MAIN_API_URL, getErrorMessage } from '../../lib/api'

export function MainProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedProductIds, setLikedProductIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let active = true
    async function getProducts() {
      try {
        const response = await fetch(`${MAIN_API_URL}/products`)
        if (!response.ok) throw new Error(await getErrorMessage(response))
        const data: Product[] = await response.json()
        if (active) setProducts(data)
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load products.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void getProducts()
    return () => { active = false }
  }, [])

  async function likeProduct(product: Product) {
    setError('')
    setLikedProductIds((current) => new Set(current).add(product.id))
    try {
      const response = await fetch(`${MAIN_API_URL}/products/${product.id}/like`, { method: 'POST' })
      if (!response.ok) throw new Error(await getErrorMessage(response))
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, likes: (item.likes ?? 0) + 1 } : item))
    } catch (requestError) {
      setLikedProductIds((current) => {
        const next = new Set(current)
        next.delete(product.id)
        return next
      })
      setError(requestError instanceof Error ? requestError.message : 'Unable to like product.')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Storefront</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Products you will love.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-400">Browse the replicated Main product catalog and leave a like.</p>
      </div>
      {error && <p role="alert" className="mt-8 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</p>}
      {loading ? <p className="mt-10 text-slate-400">Loading products…</p> : products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400">No products are available yet.</p>
      ) : (
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
              <img src={product.image} alt={product.title} className="h-52 w-full bg-slate-800 object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-white">{product.title}</h2>
                  <span className="shrink-0 text-sm font-semibold text-slate-400">♥ {product.likes ?? 0}</span>
                </div>
                <button type="button" onClick={() => void likeProduct(product)} disabled={likedProductIds.has(product.id)} className="w-full rounded-lg border border-cyan-400/70 px-4 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                  {likedProductIds.has(product.id) ? 'Liked' : 'Like product'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
