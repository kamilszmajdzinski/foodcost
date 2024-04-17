import SelectDropdown from 'react-native-select-dropdown'
import styled from 'styled-components/native'

import { SELECT_DROPDOWN_STYLES } from 'src/styles/addFoodcostPage.styles'
import { Product, ProductDTO } from 'src/types/supabase'

import { Modal } from '../Modal'
import { useState } from 'react'
import { SelectedProductRow } from 'src/domains/addFoodcost/SelectedProductRow'
import { FoodcostProduct } from 'app/foodcosts/addFoodcost'

import { Typography } from '../Typography'
import { appTheme } from 'src/config/theme'

type EditFoodcostProductModalProps = {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  setFoodcostProducts: (prev: ProductDTO[]) => void
  products: Product[]
  product?: FoodcostProduct | null
  isEdit?: boolean
}
export const EditFoodcostProductModal = ({
  isVisible,
  setIsVisible,
  setFoodcostProducts,
  product,
  products,
  isEdit = false
}: EditFoodcostProductModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<FoodcostProduct | null>(product || null)

  const onSelectProduct = (product: Product) => {
    setSelectedProduct({
      product_id: product.id,
      name: product.name,
      unit: product.unit,
      weight: 1,
      price: product.price,
      basePrice: product.price,
      baseUnit: product.unit,
      id: product.id
    })
  }

  const handleSave = () => {
    if (selectedProduct) {
      if (isEdit) {
        console.log('selected', selectedProduct)
        setFoodcostProducts((prev) => {
          const newProducts = prev.map((product) => {
            if (product.product_id === Number(selectedProduct.product_id)) {
              return ({
                product_id: Number(selectedProduct.product_id),
                product_name: selectedProduct.name,
                unit: selectedProduct.unit,
                weight: selectedProduct.weight,
                price: selectedProduct.price,
                base_price: selectedProduct.basePrice,
                base_unit: selectedProduct.baseUnit
              })
            }
            return product
          })
          return newProducts;
        })
      } else {
        setFoodcostProducts((prev) => [
          ...prev,
          {
            product_id: Number(selectedProduct.product_id),
            product_name: selectedProduct.name,
            unit: selectedProduct.unit,
            weight: selectedProduct.weight,
            price: selectedProduct.price,
            base_price: selectedProduct.basePrice,
            base_unit: selectedProduct.baseUnit
          }
        ])
      }
      setIsVisible(false)
    }
  }

  return (
    <Modal setIsVisible={setIsVisible} isVisible={isVisible} hideCloseButton={!!selectedProduct}>
      {selectedProduct && (
        <SelectedProductRow modalMode {...selectedProduct} setSelectedProduct={setSelectedProduct} setFoodcostProducts={() => {}} index={1} />
      )}
      {!selectedProduct && (
        <SelectDropdown
          search
          onSelect={onSelectProduct}
          searchPlaceHolder="Search"
          defaultButtonText={'Press here to add product...'}
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
      {selectedProduct && (
        <S.ButtonsWrapper>
          <Typography handlePress={() => setIsVisible(false)} size={20} color={appTheme.error}>
            Cancel
          </Typography>
          <Typography size={20} handlePress={handleSave}>
            Save
          </Typography>
        </S.ButtonsWrapper>
      )}
    </Modal>
  )
}

const S = {
  ButtonsWrapper: styled.View`
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 16px;
    justify-content: center;
    align-self: flex-end;
  `
}
