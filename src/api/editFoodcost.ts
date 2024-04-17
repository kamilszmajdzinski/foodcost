import { ProductDTO } from 'src/types/supabase'
import { supabase } from 'src/utils/supabase'

interface RecipeInterface {
  name: string
  description: string
  foodcost: number
  servings: number
}

interface EditFoodcostInterface {
  recipeId: string
  updatedRecipe: RecipeInterface
  products: ProductDTO[]
}

async function updateRecipeDetails(recipeId: string, updatedRecipe: RecipeInterface) {
  const { data, error } = await supabase
    .from('recipes')
    .update({
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      foodcost: updatedRecipe.foodcost,
      servings_number: updatedRecipe.servings
    })
    .match({ id: recipeId })

  if (error) {
    console.error('Error updating recipe:', error)
    return
  }

  console.log('Recipe updated successfully:', data)
}

async function updateRecipeProducts(recipeId: string, products: ProductDTO[]) {
  // Delete existing product associations
  const { error: deleteError } = await supabase.from('recipe_products').delete().match({ recipe_id: recipeId })

  if (deleteError) {
    console.error('Error deleting old products:', deleteError)
    return
  }

  // Add new product associations
  const { error: insertError } = await supabase.from('recipe_products').insert(
    products.map((product) => ({
      recipe_id: recipeId,
      product_id: product.product_id,
      weight: product.weight,
      price: product.price,
      unit: product.unit
    }))
  )

  if (insertError) {
    console.error('Error inserting new products:', insertError)
    return
  }

  console.log('Recipe products updated successfully')
}

export const editFoodcost = async ({ recipeId, updatedRecipe, products }: EditFoodcostInterface) => {
  await updateRecipeDetails(recipeId, updatedRecipe)
  await updateRecipeProducts(recipeId, products)
}
