import { AddFoodcostDTO } from 'src/types/supabase'
import { supabase } from './supabase'

async function addFoodCostWithProducts(foodCost: AddFoodcostDTO, onSuccess: () => void) {
  const {
    data: recipe,
    error: recipeError,
    status: recipesTableInsertStatus
  } = await supabase
    .from('recipes')
    .insert({
      name: foodCost.name,
      description: foodCost.description,
      foodcost: foodCost.foodcost,
      servings_number: foodCost.servings || 1,
      serving_foodcost: foodCost.foodcost / (foodCost.servings || 1)
    })
    .select('*')

  if (recipeError) {
    console.error('Error inserting recipe:', recipeError)
    return
  }

  const recipeId = recipe[0].id

  const productInserts = foodCost.products.map((product) => ({
    recipe_id: recipeId,
    product_id: product.product_id,
    weight: product.weight,
    price: product.price,
    unit: product.unit
  }))

  const { error: productsError, status: recipeProductsTableInsertStatus } = await supabase.from('recipe_products').insert(productInserts)

  if (productsError) {
    console.error('Error inserting products:', productsError)
    // Optionally, handle rollback or cleanup here
    return
  }

  if (recipeProductsTableInsertStatus && recipeProductsTableInsertStatus === 201 && recipesTableInsertStatus && recipesTableInsertStatus === 201) {
    onSuccess && onSuccess()
  }

  console.log('Food cost and products added successfully')
}

async function deleteFoodCost(foodCostId: string, onSuccess: () => void) {
  // First, delete associated products in the recipe_products table
  const { error: deleteProductsError } = await supabase.from('recipe_products').delete().match({ recipe_id: foodCostId })

  if (deleteProductsError) {
    console.error('Error deleting associated products:', deleteProductsError)
    return
  }

  // Then, delete the recipe itself
  const { error: deleteRecipeError } = await supabase.from('recipes').delete().match({ id: foodCostId })

  if (deleteRecipeError) {
    console.error('Error deleting recipe:', deleteRecipeError)
    return
  }

  console.log('Food cost deleted successfully')
  onSuccess && onSuccess()
}

export { addFoodCostWithProducts, deleteFoodCost }
