export interface Product {
  createdAt: string
  name: string
  price: number
  unit: string
  id: string
}

export interface Foodcost {
  createdAt: string
  name: string
  id: string
  description: string
  foodcost: number
  serving_foodcost: number
  servings_number: number
}

export interface FoodcostDTO {
  foodcost: number
  recipe_id: string
  recipe_name: string
  recipe_description: string
  servings_number: number
  products: ProductDTO[]
}

export interface ProductDTO {
  base_unit: string
  base_price: number
  price: number
  product_id: number
  product_name: string
  unit: string
  weight: number
}

export interface ProductFoodcostDTO {
  product_id: string
  weight: number
  price: number
  unit: string
}

export interface AddFoodcostDTO {
  name: string
  description: string
  servings: number
  foodcost: number
  products: ProductFoodcostDTO[]
}
