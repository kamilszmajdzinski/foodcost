import SelectDropdown from 'react-native-select-dropdown'

import { SELECT_DROPDOWN_STYLES } from 'src/styles/addFoodcostPage.styles'
import { Product } from 'src/types/supabase'

import { Modal } from '../Modal'

type AddProductModalProps = {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  handleSelectProduct: (product: Product) => void
  products: Product[]
}
export const AddProductModal = ({ isVisible, setIsVisible, handleSelectProduct, products }: AddProductModalProps) => {
  const onSelectProduct = (product: Product) => {
    handleSelectProduct(product)
    setIsVisible(false)
  }
  return (
    <Modal setIsVisible={setIsVisible} isVisible={isVisible}>
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
    </Modal>
  )
}
