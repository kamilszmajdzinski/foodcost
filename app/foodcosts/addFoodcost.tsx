import { Stack, router } from 'expo-router'
import { ScrollView } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useState } from 'react'

import { supabase } from 'src/utils/supabase'
import { mapFormToApi } from 'src/utils/mapFormToApi'

import ScreenLayout from 'src/components/ScreenLayout'
import styled from 'styled-components/native'
import { Button } from 'src/components/Button/Button'

import { Common } from 'src/styles/common'

const AddFoodcost = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<boolean | string>(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  //   const [weight, setWeight] = useState('')
  //   const [unit, setUnit] = useState(UNITS[0].value)
  //   const [price, setPrice] = useState('')

  const addFoodcost = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const { error, status } = await supabase
        .from('products')
        .insert([mapFormToApi({ name, weight, unit, price })])
        .select()

      if (error) throw error
      if (status === 201) {
        router.back()
      }
    } catch (e) {
      setIsError('Error adding product')
    } finally {
      setIsLoading(false)
    }
  }

  const submitEnabled = name

  return (
    <ScreenLayout>
      <Common.PageWrapper spaceBetween>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Stack.Screen options={{ title: 'Add Foodcost' }} />
          <Common.PageHeader>Add Foodcost</Common.PageHeader>

          <S.NameInputWrapper>
            <S.InputLabel>Name:</S.InputLabel>
            <S.Input value={name} onChangeText={(text) => setName(text)} />
          </S.NameInputWrapper>
          <S.NameInputWrapper>
            <S.InputLabel>Description:</S.InputLabel>
            <S.Input value={description} onChangeText={(text) => setDescription(text)} />
          </S.NameInputWrapper>
          <S.ProductsWrapper>
            <S.Label size={30}>Products:</S.Label>

          </S.ProductsWrapper>

          {/* <S.WeightAndUnitInputsWrapper>
            <S.NumericalInputWrapper>
              <S.InputLabel>Weight:</S.InputLabel>
              <S.Input value={weight} onChangeText={(text) => setWeight(text)} keyboardType="numeric" />
            </S.NumericalInputWrapper>
            <S.PickerInputWrapper>
              <RNPickerSelect
                value={unit}
                style={{
                  inputIOS: {
                    fontFamily: 'dmSerif',
                    color: '#597E52'
                  }
                }}
                items={UNITS}
                onValueChange={setUnit}
              />
            </S.PickerInputWrapper>
          </S.WeightAndUnitInputsWrapper>
          <S.PriceInputWrapper>
            <S.InputLabel>Price:</S.InputLabel>
            <S.Input value={price} onChangeText={(text) => setPrice(text)} keyboardType="numeric" />
            <S.PriceLabel>zł</S.PriceLabel>
          </S.PriceInputWrapper> */}
        </ScrollView>

        <Button disabled={!submitEnabled} onPress={addFoodcost} isLoading={isLoading}>
          {isError ? 'Something went wrong, try again' : 'Add Foodcost'}
        </Button>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  ProductsWrapper: styled.View`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
  `,
  UnitSelect: styled(RNPickerSelect)`
    padding: 40px;
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
  NameInputWrapper: styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: row;
    font-family: dmSerif;
  `,
  PriceInputWrapper: styled.View`
    display: flex;
    align-items: center;
    width: 95%;
    flex-direction: row;
    font-family: dmSerif;
  `,
  WeightAndUnitInputsWrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  NumericalInputWrapper: styled.View`
    width: 75%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  PickerInputWrapper: styled.View`
    width: 25%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  InputLabel: styled.Text`
    font-size: 22px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
  `,
  Label: styled.Text<{ size?: number }>`
    font-size: ${(p) => p.size || 22}px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
  `,
  PriceLabel: styled.Text`
    font-size: 16px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
  `
}

export default AddFoodcost
