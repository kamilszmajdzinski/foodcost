import styled from 'styled-components/native'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'

import { IconButton } from 'src/components/Button/Button'
import { Typography } from 'src/components/Typography'
import { appTheme } from 'src/config/theme'
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter'
import { formatPrice } from 'src/utils/formatPrice'

export const ProductRow = ({ name, unit, weight, price, index }: { name: string; unit: string; weight: number; price: number; index: number }) => (
  <ProductRowStyles.Wrapper key={`${name}-${index}`}>
    <ProductRowStyles.LeftColumn>
      <Typography size={22} color={appTheme.dimmed}>
        {index}.
      </Typography>
      <Typography size={22} color={appTheme.dimmed}>
        {capitalizeFirstLetter(name)} - {weight} {unit}
      </Typography>
    </ProductRowStyles.LeftColumn>
    <ProductRowStyles.RightColumn>
      <Typography size={22} color={appTheme.dimmed}>
        {formatPrice(price)} zł
      </Typography>
      <IconButton icon={faPenToSquare} onPress={() => {}} />
    </ProductRowStyles.RightColumn>
  </ProductRowStyles.Wrapper>
)

export const ProductRowStyles = {
  Wrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
  `,
  LeftColumn: styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  `,
  RightColumn: styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
  `
}
