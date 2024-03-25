import { Stack } from 'expo-router'
import ScreenLayout from 'src/components/ScreenLayout'
import { FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import styled from 'styled-components/native'

import { supabase } from 'src/utils/supabase'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'

import { AddButton } from 'src/components/AddButton/AddButton'
import Spinner from 'src/components/Spinner'
import Error from 'src/components/Error'

import { Common } from 'src/styles/common'

import { Product } from 'src/types/supabase'
import { formatPrice } from 'src/utils/formatPrice'

const ProductsScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  console.log(products)
  const isFocused = useIsFocused()

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

  return (
    <ScreenLayout>
      <Common.PageWrapper>
        <Stack.Screen options={{ title: 'Products' }} />
        <Common.PageHeader>My products</Common.PageHeader>
        {isError && <Error />}
        {isLoading && <Spinner />}
        {products.length > 0 && (
          <S.ListWrapper>
            <FlatList
              renderItem={(product) => (
                <S.ListElement>
                  <S.ListText>{capitalizeFirstLetter(product.item.name)}</S.ListText>
                  <S.ListDetails>
                    {formatPrice(product.item.price)}zł/{product.item.unit}
                  </S.ListDetails>
                </S.ListElement>
              )}
              data={products}
              keyExtractor={(item) => item.id}
            />
          </S.ListWrapper>
        )}
        <AddButton href="/products/addProduct" />
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
  ListText: styled.Text`
    font-family: dmSerif;
    font-size: 26px;
    color: ${(p) => p.theme.highlight};
  `,
  ListDetails: styled.Text`
    font-family: dmSerif;
    font-size: 18px;
    color: ${(p) => p.theme.highlight};
  `
}

export default ProductsScreen
