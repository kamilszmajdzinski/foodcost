import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

export const ButtonStyles = {
  Wrapper: styled.TouchableOpacity<{ isGrayedOut: boolean }>`
    border-radius: 40px;
    padding: 12px;
    background-color: ${(p) => p.theme.highlight};
    opacity: ${(p) => (p.isGrayedOut ? 0.5 : 1)};
  `,
  Text: styled.Text`
    font-family: dmSerif;
    font-size: 24px;
    color: white;
    text-align: center;
  `
}

const LoadingSpinner = () => (
  <ButtonStyles.Text>
    Loading... &nbsp; <ActivityIndicator color='#FFFFFF' />{' '}
  </ButtonStyles.Text>
)

export const Button = ({
  children,
  onPress,
  disabled,
  isLoading
}: {
  children: string
  onPress: () => void
  disabled: boolean
  isLoading: boolean
}) => (
  <ButtonStyles.Wrapper onPress={onPress} disabled={disabled} isGrayedOut={disabled}>
    {isLoading ? <LoadingSpinner /> : <ButtonStyles.Text>{children}</ButtonStyles.Text>}
  </ButtonStyles.Wrapper>
)
