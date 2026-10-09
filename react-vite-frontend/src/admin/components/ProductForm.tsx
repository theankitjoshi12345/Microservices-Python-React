import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, ProductInput } from '../../interfaces/product'
import { ADMIN_API_URL, getErrorMessage } from '../../lib/api'

interface ProductFormProps {
  productId?: string
}

export function ProductForm({ productId }: ProductFormProps) {
  const navigate = useNavigate()
  const isEditing = Boolean(productId)
  const [values, setValues] = useState<ProductInput>({ title: '', image: '' })
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) return
    let active = true

    async function loadProduct() {
      try {
        const response = await fetch(`${ADMIN_API_URL}/products/${productId}`)
        if (!response.ok) throw new Error(await getErrorMessage(response))
        const product: Product = await response.json()
        if (active) setValues({ title: product.title, image: product.image })
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load product.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadProduct()
    return () => { active = false }
  }, [productId])

  async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isEditing && !window.confirm('Save these product changes?')) return

    setSubmitting(true)
    setError('')
    try {
      const response = await fetch(isEditing ? `${ADMIN_API_URL}/products/${productId}` : `${ADMIN_API_URL}/products/`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error(await getErrorMessage(response))
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-slate-400">Loading product…</p>

  return (
    <form onSubmit={(event) => void submitProduct(event)} className="max-w-xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
      <div>
        <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit product' : 'Create product'}</h2>
        <p className="mt-1 text-sm text-slate-400">The ID and like count are assigned by the backend.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
      <label className="block text-sm font-semibold text-slate-200">
        Title
        <input required value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
      </label>
      <label className="block text-sm font-semibold text-slate-200">
        Image URL
        <input required type="url" value={values.image} onChange={(event) => setValues((current) => ({ ...current, image: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
      </label>
      <button type="submit" disabled={submitting} className="rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
      </button>
    </form>
  )
}
