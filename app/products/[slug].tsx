import ScreenLayout from 'src/components/ScreenLayout'
import { Common, CommonForm, CommonLayout } from 'src/styles/common'
import { ScrollView } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { supabase } from 'src/utils/supabase'
import { useIsFocused } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import { UNITS } from 'src/consts'
import { Button } from 'src/components/Button/Button'
import Spinner from 'src/components/Spinner'
import { Product } from 'src/types/supabase'
import { PageFooter } from 'src/components/PageFooter'
import { findRecipesByProductId } from 'src/utils/supabase/findRecipesByProductId'
import { EditProductConfirmationModal } from 'src/components/EditProductConfirmationModal/EditProductConfirmationModal'
import styled from 'styled-components'
import { Typography } from 'src/components/Typography'
import { formatPrice } from 'src/utils/formatPrice'
import { findAllElementsOfSameTypeByValue } from 'src/domains/addFoodcost/utils'
import { UNITS_WEIGHT_RELATION_MAP, UNITS_PRICE_RELATION_MAP } from 'src/domains/addFoodcost/utils'

const ProductScreen = () => {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [unit, setUnit] = useState(UNITS[0].value)
  const [price, setPrice] = useState(0)
  const [weight, setWeight] = useState('1')

  const [newPrice, setNewPrice] = useState<string | null>(null)
  const [associatedRecipes, setAssociatedRecipes] = useState(null)
  const [associatedRecipesData, setAssociatedRecipesData] = useState(null)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const { slug } = useLocalSearchParams()
  const isFocused = useIsFocused()

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', slug).single()

      if (error) throw error
      setData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const findRecipesByProductId = async (productId: string) => {
      const { data: recipeIds, error: recipeIdsError } = await supabase
        .from('recipe_products')
        .select('recipe_id, weight, unit, price')
        .eq('product_id', productId)

      if (recipeIdsError) {
        console.error('Error fetching recipe IDs:', recipeIdsError)
        return
      }

      recipeIds && recipeIds.length > 0 && setAssociatedRecipesData(recipeIds)

      const ids = recipeIds.map((rp) => rp.recipe_id)

      const { data: recipes, error: recipesError } = await supabase.from('recipes').select('id, name, foodcost').in('id', ids)
      setAssociatedRecipes(recipes)
    }
    if (slug) {
      findRecipesByProductId(slug)
    }
  }, [slug])

  useEffect(() => {
    if (data && price !== 0) {
      if (weight !== '1' || Number(price) !== data?.price) {
        const newPrice = (price / Number(weight)).toFixed(2)

        if (Number(newPrice) === 0) {
          setError('Weight to big, please change to smaller amount.')
        } else setError(null)
       
        setNewPrice(`${newPrice} zł / ${unit}`)
      }
    }
  }, [weight, price, data, unit])

  useEffect(() => {
    if (data) {
      setUnit(data.unit)
      setPrice(data.price)
    }
  }, [data])

  useEffect(() => {
    if (isFocused) fetchProduct()
  }, [isFocused])

  // const handleSaveProduct = async () => {
  //   console.log('data', associatedRecipesData)
  //   console.log('data', associatedRecipes)
  //   console.log('newData', price, weight, unit)

  //   const newPricePerUnit = (price / Number(weight)).toFixed(2)
  //   const newPrice = newPricePerUnit * associatedRecipesData[0].weight
  //   const priceDelta = newPrice - associatedRecipesData[0].price

  //   try {
  //     const { data: productUpdateData, error: productUpdateError } = await supabase.from('products').update({ price: price }).match({ id: slug })
  //     const { data: recipeProductsUpdateData, error: recipeProductsUpdateError } = await supabase
  //       .from('recipe_products')
  //       .update({ price: newPrice })
  //       .eq('product_id', slug)

  //     const { data: recipeUpdateData, error: recipeUpdateError } = await supabase
  //       .from('recipes')
  //       .update({
  //         foodcost: associatedRecipes[0].foodcost + priceDelta,
  //         previousFoodcost: associatedRecipes[0].foodcost,
  //         lastFoodcostUpdate: new Date().toISOString()
  //       })
  //       .eq('id', associatedRecipesData[0].recipe_id)

  //     console.log('productUpdateData', productUpdateData)
  //     console.log('recipeProductsUpdateData', recipeProductsUpdateData)
  //     console.log('recipeUpdateData', recipeUpdateData)
  //     console.log('productUpdateError', productUpdateError)
  //     console.log('recipeProductsUpdateError', recipeProductsUpdateError)
  //     console.log('recipeUpdateError', recipeUpdateError)
  //   } catch (error) {
  //     console.error('Error updating product:', error)
  //   }
  // }

  //TODO: handle negative delta
  const handleSaveProduct = () => {
    const newPricePerUnit = (price / Number(weight)).toFixed(2)

    associatedRecipesData &&
      associatedRecipesData.length > 0 &&
      associatedRecipesData.forEach(async (recipe) => {
        const newPrice = newPricePerUnit * recipe.weight
        const priceDelta = newPrice - recipe.price

        try {
          const { data: productUpdateData, error: productUpdateError } = await supabase.from('products').update({ price: price }).match({ id: slug })
          const { data: recipeProductsUpdateData, error: recipeProductsUpdateError } = await supabase
            .from('recipe_products')
            .update({ price: newPrice })
            .eq('product_id', slug)

          const recipeData = associatedRecipes.find((r) => r.id === recipe.recipe_id)

          const { data: recipeUpdateData, error: recipeUpdateError } = await supabase
            .from('recipes')
            .update({
              foodcost: recipeData.foodcost + priceDelta,
              previousFoodcost: recipeData.foodcost,
              lastFoodcostUpdate: new Date().toISOString()
            })
            .eq('id', recipe.recipe_id)

          console.log('productUpdateData', productUpdateData)
          console.log('recipeProductsUpdateData', recipeProductsUpdateData)
          console.log('recipeUpdateData', recipeUpdateData)
          console.log('productUpdateError', productUpdateError)
          console.log('recipeProductsUpdateError', recipeProductsUpdateError)
          console.log('recipeUpdateError', recipeUpdateError)
        } catch (error) {
          console.error('Error updating product:', error)
        }
      })
  }

  const handleUnitChange = (value: string) => {
    setUnit(value)
    const weightRelation = UNITS_WEIGHT_RELATION_MAP[`${unit}/${value}`]
    const newWeight = (Number(weight) * weightRelation).toString()
    setWeight(newWeight)

    const newPrice = price / Number(newWeight)
    const newPriceFormatted = newPrice.toFixed(2)

    if (Number(newPriceFormatted) === 0) {
      setError('Unit to small, please change to bigger unit.')
    } else setError(null)
   
    setNewPrice(`${Number(newPriceFormatted)}/${value}`)
  }

  return (
    <ScreenLayout>
      {showConfirmationModal && (
        <EditProductConfirmationModal isOpen={showConfirmationModal} setIsOpen={setShowConfirmationModal} handleConfirmation={handleSaveProduct} />
      )}
      <Common.PageWrapper spaceBetween>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
              <Stack.Screen options={{ title: 'Edit Product' }} />
              <Common.PageHeader>Edit {data?.name}</Common.PageHeader>

              <CommonForm.WeightAndUnitInputsWrapper>
                <CommonForm.NumericalInputWrapper>
                  <CommonForm.InputLabel>Weight:</CommonForm.InputLabel>
                  <CommonForm.Input value={weight} onChangeText={(text) => setWeight(text)} keyboardType="numeric" />
                </CommonForm.NumericalInputWrapper>
                <CommonForm.PickerInputWrapper>
                  <RNPickerSelect
                    value={unit}
                    style={{
                      inputIOS: {
                        fontFamily: 'dmSerif',
                        color: '#597E52'
                      }
                    }}
                    items={findAllElementsOfSameTypeByValue(unit)}
                    onValueChange={handleUnitChange}
                  />
                </CommonForm.PickerInputWrapper>
              </CommonForm.WeightAndUnitInputsWrapper>

              <CommonForm.PriceInputWrapper>
                <CommonForm.InputLabel>Price:</CommonForm.InputLabel>
                <CommonForm.Input value={String(price)} onChangeText={(text) => setPrice(Number(text))} keyboardType="numeric" />
                <CommonForm.PriceLabel>zł</CommonForm.PriceLabel>
              </CommonForm.PriceInputWrapper>
            </ScrollView>
          </>
        )}

        <CommonLayout.Flex direction="column">
          {newPrice && associatedRecipes && associatedRecipes.length > 0 && (
            <CommonLayout.Flex justifyContent="space-between">
              <Typography>Affected foodcosts:</Typography>
              <Typography weight="700">{associatedRecipes.map((recipe) => recipe.name).join(', ')}</Typography>
            </CommonLayout.Flex>
          )}
          {newPrice && <PageFooter isCompact title="Old price" text={`${formatPrice(data?.price)} zł / ${data?.unit}`} />}
          {newPrice && <PageFooter title="New price" text={newPrice} />}
          <Button disabled={!newPrice || !!error} isLoading={loading} onPress={() => setShowConfirmationModal(true)}>
            {error || 'Save product'}
          </Button>
        </CommonLayout.Flex>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  AssiociatedRecipes: styled.View``
}

export default ProductScreen
