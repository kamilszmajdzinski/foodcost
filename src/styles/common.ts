import styled from 'styled-components/native'

export const Common = {
  PageWrapper: styled.View<{ spaceBetween?: boolean }>`
    flex: 1;
    padding: 24px 16px 18px 16px;
    position: relative;
    width: 100%;
    justify-content: ${(p) => (p.spaceBetween ? 'space-between' : 'flex-start')};
  `,
  PageHeaderWrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  PageHeader: styled.Text`
    font-size: ${(p) => p.theme.size(48, 'px')};
    color: ${(p) => p.theme.highlight};
    font-family: dmSerif;
    font-weight: bold;
  `,
  PageDescription: styled.Text`
    font-size: ${(p) => p.theme.size(18, 'px')};
    color: ${(p) => p.theme.secondary};
    font-family: dmSerif;
    font-weight: normal;
  `,
  Button: styled.TouchableOpacity`
    border-radius: 16px;
    font-family: dmSerif;
    font-size: 24px;
    background-color: ${(p) => p.theme.highlight};
    text-align: center;
    padding: 24px;
  `,
  Input: styled.TextInput`
    font-size: 48px;
    font-family: dmSerif;
    color: ${(p) => p.theme.dimmed};
  `
}

export const CommonForm = {
  NameInputWrapper: styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: row;
    font-family: dmSerif;
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
  InputLabel: styled.Text`
    font-size: 22px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
    width: 65px;
  `,
  PickerInputWrapper: styled.View`
    width: 25%;
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
  WeightAndUnitInputsWrapper: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  PriceInputWrapper: styled.View`
    display: flex;
    align-items: center;
    width: 95%;
    flex-direction: row;
    font-family: dmSerif;
  `,
  PriceLabel: styled.Text`
    font-size: 16px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
  `
}

type FlexProps = {
  direction?: 'row' | 'column'
  gap?: number
  alignItems?: 'center' | 'start' | 'end' | 'space-between'
  justifyContent?: 'center' | 'start' | 'end' | 'space-between'
  height?: number
}

export const CommonLayout = {
  Flex: styled.View<FlexProps>`
    display: flex;
    width: 100%;
    flex-direction: ${(p) => p.direction || 'row'};
    gap: ${(p) => p.gap || 2}px;
    align-items: ${(p) => p.alignItems || 'center'};
    justify-content: ${(p) => p.justifyContent || 'center'};
    height: ${(p) => `${p.height}%` || 'auto'};
  `
}
