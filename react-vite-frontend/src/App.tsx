import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './admin/components/AdminLayout'
import { CreateProduct } from './admin/components/CreateProduct'
import { EditProduct } from './admin/components/EditProduct'
import { ProductList } from './admin/components/ProductList'
import { Navigation } from './components/Navigation'
import { MainProducts } from './main/components/MainProducts'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<MainProducts />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
