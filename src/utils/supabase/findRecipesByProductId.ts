import { supabase } from 'src/utils/supabase'

export const findRecipesByProductId = async (productId: string) => {
  const { data: recipeIds, error: recipeIdsError } = await supabase.from('recipe_products').select('recipe_id').eq('product_id', productId)

  if (recipeIdsError) {
    console.error('Error fetching recipe IDs:', recipeIdsError)
    return
  }

  const ids = recipeIds.map((rp) => rp.recipe_id)

  const { data: recipes, error: recipesError } = await supabase.from('recipes').select('id, name, foodcost').in('id', ids)
}
