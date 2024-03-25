import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

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
  `,
  ButtonIcon: styled(FontAwesomeIcon)<{ color?: string }>`
    color: ${(p) => p.color || p.theme.highlight};
    height: 100%;
    width: 100%;
  `,
  ButtonIconWrapper: styled.TouchableOpacity`
    padding: 12px;
    padding: 4px;
  `
}

const LoadingSpinner = () => (
  <ButtonStyles.Text>
    Loading... &nbsp; <ActivityIndicator color="#FFFFFF" />{' '}
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

export const IconButton = ({
  icon,
  onPress,
  disabled,
  isLoading,
  color
}: {
  icon: IconProp
  onPress: () => void
  disabled: boolean
  isLoading: boolean
  color?: string
}) => (
  <ButtonStyles.ButtonIconWrapper onPress={onPress} disabled={disabled}>
    {isLoading ? <LoadingSpinner /> : <ButtonStyles.ButtonIcon icon={icon} color={color} />}
  </ButtonStyles.ButtonIconWrapper>
)
