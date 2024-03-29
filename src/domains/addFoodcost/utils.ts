import { FoodcostProduct } from 'app/foodcosts/addFoodcost'
import { AddFoodcostDTO } from 'src/types/supabase'

const UNITS_PRICE_RELATION_MAP = {
  'g/kg': 1000,
  'g/mg': 0.001,
  'mg/kg': 1000000,
  'mg/g': 1000,
  'kg/g': 0.001,
  'kg/mg': 0.000001
}

const UNITS_WEIGHT_RELATION_MAP = {
  'g/kg': 0.001,
  'g/mg': 1000,
  'mg/kg': 0.000001,
  'mg/g': 0.001,
  'kg/g': 1000,
  'kg/mg': 1000000,
  'mg/mg': 1,
  'g/g': 1,
  'kg/kg': 1
}

// TODO: add unit tests
export const calculateWeightOnUnitChange = (product: FoodcostProduct, unit: string): number => {
  if (product.unit === unit) {
    return product.weight
  } else {
    const relation = UNITS_WEIGHT_RELATION_MAP[`${product.unit}/${unit}`]
    return product.weight * relation
  }
}

export const calculatePriceOnWeightChange = (product: FoodcostProduct, unit: string, weight: number): number => {
  if (product.baseUnit === product.unit) {
    return weight * product.basePrice
  } else {
    const relation = UNITS_PRICE_RELATION_MAP[`${product.baseUnit}/${unit}`]
    return product.basePrice * weight * relation
  }
}

export const mapStateToApi = (
  name: string,
  description: string,
  foodcostProducts: FoodcostProduct[],
  foodcost: number,
  servings: number
): AddFoodcostDTO => ({
  name,
  description,
  products: foodcostProducts.map((product) => ({
    product_id: product.id,
    weight: product.weight,
    price: product.price,
    unit: product.unit
  })),
  foodcost,
  servings
})
