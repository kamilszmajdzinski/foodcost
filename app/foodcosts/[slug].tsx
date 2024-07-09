import { Stack, router } from 'expo-router'
import ScreenLayout from 'src/components/ScreenLayout'
import { FlatList, Alert, TextInput, Platform } from 'react-native'
import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import styled from 'styled-components/native'
import { useLocalSearchParams } from 'expo-router'

import { supabase } from 'src/utils/supabase'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'

import Spinner from 'src/components/Spinner'

import { Common } from 'src/styles/common'

import { FoodcostDTO, Product, ProductDTO } from 'src/types/supabase'
import { formatPrice } from 'src/utils/formatPrice'
import { TextBackground, Typography } from 'src/components/Typography'
import { IconButton } from 'src/components/Button/Button'
import { deleteFoodCost } from 'src/utils/api'

import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { ServingsModal } from 'src/components/ServingsModal'
import { AddProductModal } from 'src/components/AddProductModal'
import { EditFoodcostProductModal } from 'src/components/EditFoodcostProductModal/EditFoodcostProductModal'
import { FoodcostProduct } from './addFoodcost'
import { editFoodcost } from 'src/api/editFoodcost'

const FoodcostScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [foodcost, setFoodcost] = useState<FoodcostDTO | null>(null)

  const [products, setProducts] = useState<Product[]>([])

  const [isServingsModalOpen, setIsServingsModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)

  // do modala
  const [productToEdit, setProductToEdit] = useState<FoodcostProduct | null>(null)

  const [editMode, setEditMode] = useState(false)

  // edit foodcost data
  const [foodcostName, setFoodcostName] = useState('')
  const [foodcostDescription, setFoodcostDescription] = useState('')
  const [foodcostProducts, setFoodcostProducts] = useState<ProductDTO[]>([])
  const [servings, setServings] = useState<number | null>(null)
  const [foodcostCost, setFoodcostCost] = useState<number | null>(null)

  const { slug } = useLocalSearchParams()

  const isFocused = useIsFocused()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const viewHeight = event.nativeEvent.layoutMeasurement.height

    setIsScrolled(y > 0)
    setIsScrolledToBottom(y + viewHeight >= contentHeight)
  }

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
        setFoodcostName(data[0].recipe_name)
        setFoodcostDescription(data[0].recipe_description)
        setFoodcostProducts(data[0].products)
        setServings(data[0].servings_number)
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
      getProducts()
    }
  }, [isFocused])

  const handleDeletePress = () =>
    Alert.alert('Confirm deletion', `Do you really want to delete ${foodcost?.recipe_name}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => handleDelete() }
    ])

  const handleDelete = async () => {
    setFoodcost(null)
    setIsLoading(true)
    try {
      await deleteFoodCost(slug as string, () => {
        router.back()
      })
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbortEdit = () => {
    setEditMode(false)
    setFoodcostName(foodcost?.recipe_name || '')
    setFoodcostDescription(foodcost?.recipe_description || '')
    setFoodcostProducts(foodcost?.products || [])
  }

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

  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      await editFoodcost({
        recipeId: slug as string,
        updatedRecipe: {
          name: foodcostName,
          description: foodcostDescription,
          foodcost: foodcostCost,
          servings: servings
        },
        products: foodcostProducts
      })

      setEditMode(false)
      router.back()
    } catch (e) {
      console.error(e)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (editMode) {
      setFoodcostCost(foodcostProducts.reduce((acc, curr) => acc + curr.price, 0))
    }
  }, [editMode, foodcostProducts])

  console.log(isScrolled, isScrolledToBottom)

  return (
    <ScreenLayout isLoading={isLoading}>
      <Common.PageWrapper>
        <Stack.Screen options={{ title: 'Foodcost' }} />
        {isLoading && <Spinner />}
        {isServingsModalOpen && (
          <ServingsModal
            isVisible={isServingsModalOpen}
            setIsVisible={setIsServingsModalOpen}
            handleSelectServings={setServings}
            servings={foodcost?.servings_number}
          />
        )}
        {isAddProductModalOpen && (
          <EditFoodcostProductModal
            isVisible={isAddProductModalOpen}
            setIsVisible={setIsAddProductModalOpen}
            products={products}
            setFoodcostProducts={setFoodcostProducts}
          />
        )}
        {productToEdit && (
          <EditFoodcostProductModal
            isVisible={!!productToEdit}
            setIsVisible={setProductToEdit}
            products={products}
            setFoodcostProducts={setFoodcostProducts}
            isEdit
            product={productToEdit}
          />
        )}
        {foodcost && (
          <S.InnerPageWrapper>
            <Common.PageHeaderWrapper>
              {editMode ? (
                <S.FoodcostNameInput value={foodcostName} onChangeText={(text) => setFoodcostName(text)} />
              ) : (
                <Common.PageHeader>{foodcost.recipe_name}</Common.PageHeader>
              )}
              <S.HeaderIconsWrapper>
                {editMode ? (
                  <>
                    <IconButton icon={faXmark} onPress={handleAbortEdit} color="#8B0000" />
                    <IconButton icon={faCheck} onPress={handleSaveEdit} />
                  </>
                ) : (
                  <>
                    <IconButton icon={faEdit} onPress={() => setEditMode(true)} />
                    <IconButton icon={faTrash} onPress={handleDeletePress} />
                  </>
                )}
              </S.HeaderIconsWrapper>
            </Common.PageHeaderWrapper>
            {editMode ? (
              <S.FoodcostDescriptionInput value={foodcostDescription} onChangeText={(text) => setFoodcostDescription(text)} />
            ) : (
              <Common.PageDescription>{foodcost.recipe_description}</Common.PageDescription>
            )}
            <S.ListWrapper isScrolled={isScrolled} isScrolledToBottom={isScrolledToBottom}>
              <FlatList
                onScroll={handleScroll}
                scrollEventThrottle={16}
                renderItem={(product: { item: ProductDTO }) => (
                  <S.ListElement
                    onTouchEnd={(e) =>
                      editMode &&
                      setProductToEdit({
                        product_id: product.item.product_id.toString(),
                        weight: product.item.weight,
                        price: product.item.price,
                        unit: product.item.unit,
                        name: product.item.product_name,
                        basePrice: product.item.base_price,
                        baseUnit: product.item.base_unit,
                        id: product.item.product_id.toString()
                      })
                    }>
                    <S.ListElementLeftColumn>
                      <S.ListElementTitle>{capitalizeFirstLetter(product.item.product_name)}</S.ListElementTitle>
                      <S.ListElementDescription>
                        {formatPrice(product.item.base_price)}zł / {product.item.base_unit}
                      </S.ListElementDescription>
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
                data={foodcostProducts}
                keyExtractor={(item) => item.product_id.toString()}
              />
              {editMode && (
                <Typography handlePress={() => setIsAddProductModalOpen(true)} size={18}>
                  Tap on product to edit, press here to add another product...
                </Typography>
              )}
            </S.ListWrapper>
          </S.InnerPageWrapper>
        )}

        {foodcost && (
          <S.PageFooterWrapper>
            <S.PageFooterRow>
              <Typography size={32}>Foodcost:</Typography>
              <Typography size={48}>{formatPrice(editMode ? foodcostCost : foodcost.foodcost)} zł</Typography>
            </S.PageFooterRow>
            <S.PageFooterRow>
              <Typography size={18}>{editMode ? 'Servings: ' : 'Servings / foodcost per serving'}</Typography>

              {editMode ? (
                <S.OpenServingsModal>
                  <S.OpenServingsModalText>Tap to edit:</S.OpenServingsModalText>
                  <S.OpenServingsModalBadge onPress={() => setIsServingsModalOpen(true)}>
                    <S.OpenServingsModalBadgeText>{servings}</S.OpenServingsModalBadgeText>
                  </S.OpenServingsModalBadge>
                </S.OpenServingsModal>
              ) : (
                <Typography size={18}>
                  {foodcost.servings_number} / {formatPrice(foodcost.foodcost / foodcost.servings_number)} zł
                </Typography>
              )}
            </S.PageFooterRow>
          </S.PageFooterWrapper>
        )}
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  ListWrapper: styled.View<{ isScrolled; isScrolledToBottom }>`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 72px;

    background-color: ${(p) => p.theme.background};

    ${(props) =>
      props.isScrolled &&
      `
      border-top-width: 1px;
    border-top-color: red;

     `}
    ${(props) =>
      props.isScrolledToBottom &&
      `
    border-bottom-width: 1px;
    border-bottom-color: red;
  `}
  ${Platform.OS === 'android' &&
    `
    elevation: 10;
  `}
  `,
  FoodcostNameInput: styled.TextInput`
    font-size: 48px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  FoodcostDescriptionInput: styled.TextInput`
    font-size: 18px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,
  OpenServingsModal: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
  `,
  OpenServingsModalText: styled.Text`
    font-size: 10px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `,

  OpenServingsModalBadge: styled.TouchableOpacity`
    border-radius: 8px;
    background-color: ${(p) => p.theme.primary};
  `,
  OpenServingsModalBadgeText: styled.Text`
    font-size: 20px;
    font-family: dmSerif;
    padding: 8px;
    color: ${(p) => p.theme.dimmed};
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
    border-bottom: 1px solid red;
  `,
  PageFooterWrapper: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: ${(p) => p.theme.background};
  `,
  PageFooterRow: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  HeaderIconsWrapper: styled.View`
    display: flex;
    gap: 16px;
    flex-direction: row;
  `
}

export default FoodcostScreen
