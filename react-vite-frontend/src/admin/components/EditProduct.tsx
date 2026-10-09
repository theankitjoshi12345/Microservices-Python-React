import { Navigate, useParams } from 'react-router-dom'
import { ProductForm } from './ProductForm'

export function EditProduct() {
  const { id } = useParams()
  return id ? <ProductForm productId={id} /> : <Navigate to="/admin/products" replace />
}
