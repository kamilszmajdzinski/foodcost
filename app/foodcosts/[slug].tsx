import { Stack } from 'expo-router'
import ScreenLayout from 'src/components/ScreenLayout'
import { FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import styled from 'styled-components/native'
import { useLocalSearchParams } from 'expo-router'

import { supabase } from 'src/utils/supabase'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'

import { AddButton } from 'src/components/AddButton/AddButton'
import Spinner from 'src/components/Spinner'
import Error from 'src/components/Error'

import { Common } from 'src/styles/common'

import { FoodcostDTO, ProductDTO } from 'src/types/supabase'
import { formatPrice } from 'src/utils/formatPrice'

const ProductsScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [foodcost, setFoodcost] = useState<FoodcostDTO | null>(null)
  const { slug } = useLocalSearchParams()

  const isFocused = useIsFocused()

  const getFoodcosts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_recipe_with_products', { foodcost_id: slug })
      if (error) {
        setIsError(true)
        console.error(error)
      }
      if (data) {
        setFoodcost(data[0])
      }
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFocused) {
      getFoodcosts()
    }
  }, [isFocused])

  return (
    <ScreenLayout>
      <Common.PageWrapper>
        <Stack.Screen options={{ title: 'Foodcost' }} />
        {isLoading && <Spinner />}
        {foodcost && (
          <S.InnerPageWrapper>
            <Common.PageHeader>{foodcost.recipe_name}</Common.PageHeader>
            <Common.PageDescription>{foodcost.recipe_description}</Common.PageDescription>
            <S.ListWrapper>
              <FlatList
                renderItem={(product: { item: ProductDTO }) => (
                  <S.ListElement>
                    <S.ListElementLeftColumn>
                      <S.ListElementTitle>{capitalizeFirstLetter(product.item.product_name)}</S.ListElementTitle>
                      <S.ListElementDescription>{formatPrice(product.item.price)}zł / {product.item.base_unit}</S.ListElementDescription>
                    </S.ListElementLeftColumn>
                    <S.ListElementRightColumn>
                    <S.Price>
                        {product.item.weight}
                        <S.PriceCurrency>{product.item.unit}</S.PriceCurrency>
                      </S.Price>
                      <S.Price>
                        {formatPrice(product.item.price)}
                        <S.PriceCurrency>zł</S.PriceCurrency>
                      </S.Price>
                    </S.ListElementRightColumn>
                  </S.ListElement>
                )}
                data={foodcost.products}
                keyExtractor={(item) => item.product_id.toString()}
              />
            </S.ListWrapper>
          </S.InnerPageWrapper>
        )}
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  ListWrapper: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;
    padding-bottom: 36px;
  `,
  ListElement: styled.View`
    background-color: ${(p) => p.theme.primary};
    padding: 8px;
    border-radius: 16px;
    padding: 12px 24px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  ListElementLeftColumn: styled.View`
    display: flex;
    flex-direction: column;
  `,
  ListElementTitle: styled.Text`
    font-family: dmSerif;
    font-size: 20px;
    color: ${(p) => p.theme.highlight};
  `,
  ListElementDescription: styled.Text`
    font-family: dmSerif;
    font-size: 20px;
    color: ${(p) => p.theme.secondary};
  `,
  ListDetails: styled.Text`
    font-family: dmSerif;
    font-size: 18px;
    color: ${(p) => p.theme.highlight};
  `,
  ListElementRightColumn: styled.View`
    display: flex;
    flex-direction: row;
    gap: 8px;
  `,
  Price: styled.Text`
    font-family: dmSerif;
    font-size: 30px;
    color: ${(p) => p.theme.highlight};
  `,
  PriceCurrency: styled.Text`
    font-family: dmSerif;
    font-size: 22px;
    color: ${(p) => p.theme.highlight};
  `,

  InnerPageWrapper: styled.View`
    flex: 1;
  `
}

export default ProductsScreen
