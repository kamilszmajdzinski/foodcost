import styled from 'styled-components/native'
import RNPickerSelect from 'react-native-picker-select'

import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { IconButton } from 'src/components/Button/Button'
import { formatPrice } from 'src/utils/formatPrice'
import { Typography } from 'src/components/Typography'
import { appTheme } from 'src/config/theme'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'
import { calculatePriceOnWeightChange, calculateWeightOnUnitChange } from './utils'
import { UNITS } from 'src/consts'
import { FoodcostProduct } from 'app/foodcosts/addFoodcost'

interface SelectedProductRowProps {
  name: string
  unit: string
  weight: number
  price: number
  setSelectedProduct: any
  setFoodcostProducts: any
  index: number
  product_id: string
}

export const SelectedProductRow = ({
  name,
  unit,
  weight,
  price,
  setSelectedProduct,
  setFoodcostProducts,
  index,
  product_id
}: SelectedProductRowProps) => {
  const handleConfirmProduct = () => {
    setFoodcostProducts((prev: FoodcostProduct[]) => [...prev, { name, unit, weight, price, id: product_id }])
    setSelectedProduct(null)
  }

  const handleChangeWeight = (textValue: string) => {
    //@ts-expect-error fix this
    if (!isNaN(textValue) && !isNaN(parseFloat(textValue))) {
      setSelectedProduct((prev: FoodcostProduct) => {
        const newPrice = calculatePriceOnWeightChange(prev, unit, parseFloat(textValue))
        return {
          ...prev,
          weight: parseFloat(textValue),
          price: newPrice
        }
      })
    } else if (textValue === '') {
      setSelectedProduct((prev: FoodcostProduct) => ({ ...prev, weight: 0, price: 0 }))
    }
  }

  return (
    <SelectedProductRowStyles.Wrapper>
      <SelectedProductRowStyles.LeftColumn>
        <Typography size={22} color={appTheme.dimmed}>
          {index}.
        </Typography>

        <SelectedProductRowStyles.LeftColumnContent>
          <Typography size={22} color={appTheme.dimmed}>
            {capitalizeFirstLetter(name)}{' '}
          </Typography>
          <SelectedProductRowStyles.LeftColumnInnerWrapper>
            <SelectedProductRowStyles.WeightInput keyboardType="numeric" onChangeText={handleChangeWeight} value={weight.toString()} />
            <RNPickerSelect
              value={unit}
              style={ProductPickerStyles}
              items={UNITS}
              onValueChange={(unit) =>
                setSelectedProduct((prev: FoodcostProduct) => ({
                  ...prev,
                  unit,
                  weight: calculateWeightOnUnitChange(prev, unit)
                }))
              }
            />
          </SelectedProductRowStyles.LeftColumnInnerWrapper>
        </SelectedProductRowStyles.LeftColumnContent>
      </SelectedProductRowStyles.LeftColumn>

      <SelectedProductRowStyles.RightColumn>
        <Typography size={26}>{formatPrice(price)} zł</Typography>
        <IconButton icon={faCheck} onPress={handleConfirmProduct} />
        <IconButton icon={faXmark} color="#780012" onPress={() => setSelectedProduct(null)} />
      </SelectedProductRowStyles.RightColumn>
    </SelectedProductRowStyles.Wrapper>
  )
}

const ProductPickerStyles = {
  inputIOS: {
    fontFamily: 'dmSerif',
    color: '#597E52',
    marginTop: 8
  }
}

const SelectedProductRowStyles = {
  Wrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 8px 12px;
  `,
  LeftColumn: styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex: 1;
  `,
  RightColumn: styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 6px;
    justify-content: flex-end;
    align-items: center;
  `,
  LeftColumnContent: styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
    align-items: flex-start;
  `,
  LeftColumnInnerWrapper: styled.View`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  `,
  WeightInput: styled.TextInput`
    height: 32px;
    padding: 6px 10px;
    border-radius: 8px;
    background-color: ${(p) => p.theme.primary};
    font-family: dmSerif;
    width: 60%;
    font-size: 20px;
  `
}
