import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'
import { useEffect, useState } from 'react'

import { supabase } from 'src/utils/supabase'

import ScreenLayout from 'src/components/ScreenLayout'
import styled from 'styled-components/native'
import { Button } from 'src/components/Button/Button'

import { Common } from 'src/styles/common'
import { Product } from 'src/types/supabase'
import { useIsFocused } from '@react-navigation/native'
import { formatPrice } from 'src/utils/formatPrice'

import { router } from 'expo-router'

import { ProductRow } from 'src/domains/addFoodcost/ProductRow'
import { SelectedProductRow } from 'src/domains/addFoodcost/SelectedProductRow'
import { mapStateToApi } from 'src/domains/addFoodcost/utils'
import { addFoodCostWithProducts } from 'src/utils/api'
import { Typography } from 'src/components/Typography'
import { appTheme } from 'src/config/theme'
import { AddProductModal } from 'src/components/AddProductModal'

export type FoodcostProduct = {
  product_id: string
  name: string
  unit: string
  weight: number
  price: number
  baseUnit: string
  basePrice: number
  id: string
}

const AddFoodcost = () => {
  // api state
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<boolean | string>(false)
  const [products, setProducts] = useState<Product[]>([])

  // form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [foodcostProducts, setFoodcostProducts] = useState<FoodcostProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<FoodcostProduct | null>(null)

  const [foodcost, setFoodcost] = useState<number | null>(null)
  const [servings, setServings] = useState<number | null>(null)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const isFocused = useIsFocused()

  const addFoodcost = async () => {
    setIsLoading(true)

    try {
      foodcost &&
        servings &&
        (await addFoodCostWithProducts(mapStateToApi(name, description, foodcostProducts, foodcost, servings), () => {
          router.back()
        }))
    } catch {
      setIsError(true)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (foodcostProducts) {
      const foodcost = foodcostProducts.reduce((acc, curr) => acc + curr.price, 0)
      setFoodcost(foodcost)
    } else setFoodcost(null)
  }, [foodcostProducts])

  const submitEnabled = name && description && servings && servings > 0 && foodcostProducts.length > 0

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from('products').select()
      if (error) setIsError(true)
      if (data && data?.length > 0) {
        setProducts(data)
      }
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFocused) {
      getProducts()
    }
  }, [isFocused])

  const handleSelectPress = (item: Product) =>
    setSelectedProduct({
      product_id: item.id,
      baseUnit: item.unit,
      basePrice: item.price,
      unit: item.unit,
      weight: 1,
      price: item.price,
      name: item.name,
      id: item.id
    })

  return (
    <ScreenLayout>
      <Common.PageWrapper spaceBetween>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Stack.Screen options={{ title: 'Add Foodcost' }} />
          <Common.PageHeader>Add Foodcost</Common.PageHeader>

          <AddProductModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} handleSelectProduct={handleSelectPress} products={products} />

          <S.LabelAndInputWrapper>
            <S.FlexWrapper flex={3}>
              <Typography size={22} color={appTheme.dimmed}>
                Name:
              </Typography>
              <S.Input value={name} onChangeText={(text) => setName(text)} />
            </S.FlexWrapper>

            <S.FlexWrapper flex={2}>
              <Typography size={22} color={appTheme.dimmed}>
                Servings:
              </Typography>
              <S.Input keyboardType="numeric" value={servings?.toString()} onChangeText={(serving) => setServings(Number(serving))} />
            </S.FlexWrapper>
          </S.LabelAndInputWrapper>

          <S.LabelAndInputWrapper>
            <Typography size={22} color={appTheme.dimmed}>
              Description:
            </Typography>
            <S.Input value={description} onChangeText={(text) => setDescription(text)} />
          </S.LabelAndInputWrapper>
          <S.ProductsWrapper>
            <Typography size={30} color={appTheme.dimmed}>
              Products:
            </Typography>
            {foodcostProducts.map((foodcostProduct, index) => (
              <ProductRow key={foodcostProduct.product_id} {...foodcostProduct} index={index + 1} />
            ))}
            {selectedProduct && (
              <SelectedProductRow
                {...selectedProduct}
                setSelectedProduct={setSelectedProduct}
                setFoodcostProducts={setFoodcostProducts}
                index={foodcostProducts.length + 1}
              />
            )}
            {!selectedProduct && (
              <Typography size={24} handlePress={() => setIsModalVisible(true)}>
                {foodcostProducts.length > 0 ? 'Add more...' : 'Add product...'}
              </Typography>
            )}
          </S.ProductsWrapper>
        </ScrollView>

        <S.PageFooter>
          {foodcost ? (
            <S.PageFooterTopRow>
              <S.PageFooterLeftColumn>
                <Typography size={26} color={appTheme.dimmed}>
                  Foodcost:
                </Typography>
              </S.PageFooterLeftColumn>
              <S.PageFooterRightColumn>
                <Typography size={30} color={appTheme.dimmed}>
                  {formatPrice(foodcost)} zł
                </Typography>
              </S.PageFooterRightColumn>
            </S.PageFooterTopRow>
          ) : null}
          <Button disabled={!submitEnabled || isLoading} onPress={addFoodcost} isLoading={isLoading}>
            {isError ? 'Something went wrong, try again' : 'Add Foodcost'}
          </Button>
        </S.PageFooter>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  ModalOuterWrapper: styled.View`
    flex: 1;
    justify-content: 'center';
    align-items: 'center';
    margin-top: 38%;
    background-color: ${(p) => p.theme.primary};
    border-radius: 20px;
  `,
  ModalInnerWrapper: styled.View`
    background-color: 'white';
    padding: 8px 4px;
    align-items: 'center';
  `,
  PageFooter: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 15%;
    justify-content: flex-end;
  `,
  FlexWrapper: styled.View<{ flex?: number }>`
    display: flex;
    flex-direction: row;
    gap: 2px;
    flex: ${(p) => p.flex || 1};
    align-items: center;
  `,
  PageFooterTopRow: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
  `,
  PageFooterLeftColumn: styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `,
  PageFooterRightColumn: styled.View`
    flex: 1;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
  `,
  ProductsWrapper: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;
  `,
  Input: styled.TextInput`
    height: 48px;
    margin: 12px;
    padding: 10px;
    border-radius: 8px;
    background-color: ${(p) => p.theme.primary};
    flex: 1;
    font-family: dmSerif;
    font-size: 20px;
  `,
  LabelAndInputWrapper: styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: row;
  `
}

export default AddFoodcost
