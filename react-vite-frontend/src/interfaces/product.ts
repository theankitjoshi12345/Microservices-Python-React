export interface Product {
  id: number
  title: string
  image: string
  likes?: number
}

export interface ProductInput {
  title: string
  image: string
}
