import { Stack, router } from 'expo-router'
import { ScrollView } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useState } from 'react'

import { supabase } from 'src/utils/supabase'
import { mapFormToApi } from 'src/utils/mapFormToApi'

import ScreenLayout from 'src/components/ScreenLayout'
import { Button } from 'src/components/Button/Button'
import { UNITS } from 'src/consts'

import { Common, CommonForm } from 'src/styles/common'

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<boolean | string>(false)

  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState(UNITS[0].value)
  const [price, setPrice] = useState('')

  const addProduct = async () => {
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

  const submitEnabled = name && weight && price && unit

  return (
    <ScreenLayout>
      <Common.PageWrapper spaceBetween>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Stack.Screen options={{ title: 'Add Product' }} />
          <Common.PageHeader>Add Product</Common.PageHeader>

          <CommonForm.NameInputWrapper>
            <CommonForm.InputLabel>Name:</CommonForm.InputLabel>
            <CommonForm.Input value={name} onChangeText={(text) => setName(text)} />
          </CommonForm.NameInputWrapper>
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
                items={UNITS}
                onValueChange={setUnit}
              />
            </CommonForm.PickerInputWrapper>
          </CommonForm.WeightAndUnitInputsWrapper>
          <CommonForm.PriceInputWrapper>
            <CommonForm.InputLabel>Price:</CommonForm.InputLabel>
            <CommonForm.Input value={price} onChangeText={(text) => setPrice(text)} keyboardType="numeric" />
            <CommonForm.PriceLabel>zł</CommonForm.PriceLabel>
          </CommonForm.PriceInputWrapper>
        </ScrollView>

        <Button disabled={!submitEnabled} onPress={addProduct} isLoading={isLoading}>
          {isError ? 'Something went wrong, try again' : 'Add Product'}
        </Button>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

export default AddProduct
