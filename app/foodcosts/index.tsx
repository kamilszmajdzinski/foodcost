import { Stack } from 'expo-router'
import ScreenLayout from 'src/components/ScreenLayout'
import { FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import styled from 'styled-components/native'
import { router } from 'expo-router'

import { supabase } from 'src/utils/supabase'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'

import { AddButton } from 'src/components/AddButton/AddButton'
import Spinner from 'src/components/Spinner'
import Error from 'src/components/Error'

import { Common } from 'src/styles/common'

import { Foodcost } from 'src/types/supabase'

const ProductsScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [foodcosts, setFoodcosts] = useState<Foodcost[]>([])

  const isFocused = useIsFocused()

  const getFoodcosts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from('recipes').select()
      if (error) {
        setIsError(true)
        console.error(error)
      }
      if (data && data?.length > 0) {
        setFoodcosts(data)
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
        <Stack.Screen options={{ title: 'Foodcosts' }} />
        <Common.PageHeader>My foodcosts</Common.PageHeader>
        {isError && <Error />}
        {isLoading && <Spinner />}
        {foodcosts.length > 0 && (
          <S.ListWrapper>
            <FlatList
              renderItem={(foodcost) => (
                <S.ListElement onPress={() => router.push(`/foodcosts/${foodcost.item.id}`)}>
                  <S.ListElementLeftColumn>
                    <S.ListElementTitle>{capitalizeFirstLetter(foodcost.item.name)}</S.ListElementTitle>
                    <S.ListElementDescription numberOfLines={1}>{capitalizeFirstLetter(foodcost.item.description)}</S.ListElementDescription>
                  </S.ListElementLeftColumn>
                  <S.ListElementRightColumn>
                    <S.Price>
                      {foodcost.item.foodcost}
                      <S.PriceCurrency>zł</S.PriceCurrency>
                    </S.Price>
                  </S.ListElementRightColumn>
                </S.ListElement>
              )}
              data={foodcosts}
              keyExtractor={(item) => item.id}
            />
          </S.ListWrapper>
        )}
        <AddButton href="/foodcosts/addFoodcost" />
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
  ListElement: styled.TouchableOpacity`
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
    width: 80%;
  `,
  ListElementTitle: styled.Text`
    font-family: dmSerif;
    font-size: 30px;
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
  `
}

export default ProductsScreen
