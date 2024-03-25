import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useEffect, useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'

import { supabase } from 'src/utils/supabase'

import ScreenLayout from 'src/components/ScreenLayout'
import styled from 'styled-components/native'
import { Button, IconButton } from 'src/components/Button/Button'

import { Common } from 'src/styles/common'
import { Product } from 'src/types/supabase'
import { useIsFocused } from '@react-navigation/native'
import { SELECT_DROPDOWN_STYLES } from 'src/styles/addFoodcostPage.styles'
import { formatPrice } from 'src/utils/formatPrice'
import { UNITS } from 'src/consts'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'

const mapStateToApi = (name, description, foodcostProducts, foodcost, servings) => ({
  name,
  description,
  products: foodcostProducts.map((product) => ({
    product_id: product.id,
    weight: product.weight,
    price: product.price,
    unit: product.unit
  })),
  foodcost,
  servings
})

type FoodcostProduct = {
  product_id: string
  name: string
  unit: string
  weight: number
  price: number
  baseUnit: string
  basePrice: number
}

async function addFoodCostWithProducts(foodCost) {
  // Start by adding the recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      name: foodCost.name,
      description: foodCost.description,
      foodcost: foodCost.foodcost,
      servings_number: foodCost.servings || 1,
      serving_foodcost: foodCost.foodcost / (foodCost.servings || 1)
    })
    .select('*')

  console.log(recipe)

  if (recipeError) {
    console.error('Error inserting recipe:', recipeError)
    return
  }

  // If the recipe was inserted successfully, add its products
  const recipeId = recipe[0].id // Assuming the insert returns the recipe, and taking the first.

  const productInserts = foodCost.products.map((product) => ({
    recipe_id: recipeId,
    product_id: product.product_id,
    weight: product.weight,
    price: product.price,
    unit: product.unit
  }))

  let { error: productsError } = await supabase.from('recipe_products').insert(productInserts)

  if (productsError) {
    console.error('Error inserting products:', productsError)
    // Optionally, handle rollback or cleanup here
    return
  }

  console.log('Food cost and products added successfully')
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

  const isFocused = useIsFocused()

  const addFoodcost = () => {
    addFoodCostWithProducts(mapStateToApi(name, description, foodcostProducts, foodcost, servings))
  }

  useEffect(() => {
    if (foodcostProducts) {
      const foodcost = foodcostProducts.reduce((acc, curr) => acc + curr.price, 0)
      setFoodcost(foodcost)
    } else setFoodcost(null)
  }, [foodcostProducts])

  const submitEnabled = name

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

  const handleProductConfirmation = () => {
    if (selectedProduct) {
      setFoodcostProducts([...foodcostProducts, selectedProduct])
      setSelectedProduct(null)
    }
  }

  const handleSelectPress = (item: Product) =>
    setSelectedProduct({
      product_id: item.id,
      baseUnit: item.unit,
      basePrice: item.price,
      unit: item.unit,
      weight: 1,
      price: item.price,
      name: item.name
    })

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
              <SelectDropdown
                search
                onSelect={(item) => handleSelectPress(item)}
                searchPlaceHolder="Search"
                defaultButtonText={foodcost && foodcost.length > 0 ? 'Add more...' : 'Add product...'}
                data={products.map((product) => ({ ...product }))}
                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                rowTextForSelection={(item) => item.name}
                buttonStyle={SELECT_DROPDOWN_STYLES.buttonStyle}
                buttonTextStyle={SELECT_DROPDOWN_STYLES.buttonTextStyle}
                dropdownStyle={SELECT_DROPDOWN_STYLES.dropdownStyle}
                rowTextStyle={SELECT_DROPDOWN_STYLES.rowTextStyle}
                searchInputStyle={SELECT_DROPDOWN_STYLES.searchInputStyle}
              />
            )}
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
        <S.PageFooter>
          {foodcost ? (
            <S.PageFooterTopRow>
              <S.PageFooterLeftColumn>
                <S.PageFooterTextLeft>Foodcost:</S.PageFooterTextLeft>
              </S.PageFooterLeftColumn>
              <S.PageFooterRightColumn>
                <S.PageFooterTextRight>{formatPrice(foodcost)} zł</S.PageFooterTextRight>
              </S.PageFooterRightColumn>
            </S.PageFooterTopRow>
          ) : null}
          <Button disabled={!submitEnabled} onPress={addFoodcost} isLoading={isLoading}>
            {isError ? 'Something went wrong, try again' : 'Add Foodcost'}
          </Button>
        </S.PageFooter>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const ProductRow = ({ name, unit, weight, price, index }) => {
  return (
    <S.ProductRowWrapper>
      <S.ProductRowLeftColumn>
        <S.SelectedProductRowNumber>{index}.</S.SelectedProductRowNumber>
        <S.ProductRowTitle>
          {capitalizeFirstLetter(name)} - {weight} {unit}
        </S.ProductRowTitle>
      </S.ProductRowLeftColumn>
      <S.ProductRowRightColumn>
        <S.ProductRowPrice>{formatPrice(price)} zł</S.ProductRowPrice>
        <IconButton icon={faPenToSquare} />
      </S.ProductRowRightColumn>
    </S.ProductRowWrapper>
  )
}

const UNITS_PRICE_RELATION_MAP = {
  'g/kg': 1000,
  'g/mg': 0.001,
  'mg/kg': 1000000,
  'mg/g': 1000,
  'kg/g': 0.001,
  'kg/mg': 0.000001
}

const UNITS_WEIGHT_RELATION_MAP = {
  'g/kg': 0.001,
  'g/mg': 1000,
  'mg/kg': 0.000001,
  'mg/g': 0.001,
  'kg/g': 1000,
  'kg/mg': 1000000,
  'mg/mg': 1,
  'g/g': 1,
  'kg/kg': 1
}

const SelectedProductRow = ({ name, unit, weight, price, setSelectedProduct, setFoodcostProducts, index, product_id }) => {
  const calculateWeightOnUnitChange = (product, unit): number => {
    if (product.unit === unit) {
      return product.weight
    } else {
      const relation = UNITS_WEIGHT_RELATION_MAP[`${product.unit}/${unit}`]
      return product.weight * relation
    }
  }

  const calculatePriceOnWeightChange = (product, weight): number => {
    if (product.baseUnit === product.unit) {
      return weight * product.basePrice
    } else {
      const relation = UNITS_PRICE_RELATION_MAP[`${product.baseUnit}/${unit}`]
      return product.basePrice * weight * relation
    }
  }

  const handleConfirmProduct = () => {
    setFoodcostProducts((prev) => [...prev, { name, unit, weight, price, id: product_id }])
    setSelectedProduct(null)
  }

  return (
    <S.SelectedProductRowWrapper>
      <S.SelectedProductRowLeftColumn>
        <S.SelectedProductRowNumber>{index}.</S.SelectedProductRowNumber>

        <S.SelectedProductRowLeftColumnContent>
          <S.SelectedProductRowLeftColumnText>{capitalizeFirstLetter(name)} </S.SelectedProductRowLeftColumnText>
          <S.SelectedProductRowLeftColumnData>
            <S.WeightInput
              keyboardType="numeric"
              onChangeText={(textValue) => {
                if (!isNaN(textValue) && !isNaN(parseFloat(textValue))) {
                  setSelectedProduct((prev) => {
                    const newPrice = calculatePriceOnWeightChange(prev, parseFloat(textValue))
                    return {
                      ...prev,
                      weight: parseFloat(textValue),
                      price: newPrice
                    }
                  })
                } else if (textValue === '') {
                  setSelectedProduct((prev) => ({ ...prev, weight: 0, price: 0 }))
                }
              }}
              value={weight.toString()}
            />
            <RNPickerSelect
              value={unit}
              style={{
                inputIOS: {
                  fontFamily: 'dmSerif',
                  color: '#597E52',
                  marginTop: 8
                }
              }}
              items={UNITS}
              // TODO: recalculating price on unit change - cos jest nie tak jeszze,
              // animacja ceny
              onValueChange={(unit) => {
                return setSelectedProduct((prev) => ({
                  ...prev,
                  unit,
                  weight: calculateWeightOnUnitChange(prev, unit)
                }))
              }}
            />
          </S.SelectedProductRowLeftColumnData>
        </S.SelectedProductRowLeftColumnContent>
      </S.SelectedProductRowLeftColumn>
      <S.SelectedProductRowRightColumn>
        <S.SelectedProductRowRightColumnText>{formatPrice(price)} zł</S.SelectedProductRowRightColumnText>
        <IconButton icon={faCheck} onPress={handleConfirmProduct} />
        <IconButton icon={faXmark} color="#780012" onPress={() => setSelectedProduct(null)} />
      </S.SelectedProductRowRightColumn>
    </S.SelectedProductRowWrapper>
  )
}

const S = {
  PageFooter: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 15%;
    justify-content: flex-end;
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
  PageFooterTextLeft: styled.Text`
    font-size: 26px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  PageFooterTextRight: styled.Text`
    font-size: 30px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  ProductRowWrapper: styled.View`
    display: flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
  `,
  ProductRowLeftColumn: styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  `,
  ProductRowRightColumn: styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
  `,
  ProductRowTitle: styled.Text`
    font-size: 22px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  ProductRowPrice: styled.Text`
    font-size: 28px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  SelectedProductRowWrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 8px 12px;
    /* border: 1px solid blue; */
  `,
  SelectedProductRowNumber: styled.Text`
    font-size: 22px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  SelectedProductRowRightColumn: styled.View`
    /* border: 1px solid red; */
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 6px;
    justify-content: flex-end;
    align-items: center;
  `,
  SelectedProductRowLeftColumn: styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex: 1;
  `,
  SelectedProductRowLeftColumnContent: styled.View`
    /* border: 1px solid green; */
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
    align-items: flex-start;
  `,
  SelectedProductRowLeftColumnText: styled.Text`
    font-size: 22px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  SelectedProductRowLeftColumnData: styled.View`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  `,
  SelectedProductRowRightColumnText: styled.Text`
    font-size: 26px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
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

  WeightInput: styled.TextInput`
    height: 32px;
    padding: 6px 10px;
    border-radius: 8px;
    background-color: ${(p) => p.theme.primary};
    font-family: dmSerif;
    width: 60%;
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
    color: ${(p) => p.theme.dimmed};
  `,
  Label: styled.Text<{ size?: number }>`
    font-size: ${(p) => p.size || 22}px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  PriceLabel: styled.Text`
    font-size: 16px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `
}

export default AddFoodcost
