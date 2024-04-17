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
  ButtonIconWrapper: styled.TouchableOpacity<{ absolutePosition?: boolean; top?: number; right?: number }>`
    padding: 12px;
    z-index: 100;
    position: ${(p) => (p.absolutePosition ? 'absolute' : 'relative')};
    top: ${(p) => (p.top ? p.top : 0)}px;
    right: ${(p) => (p.right ? p.right : 0)}px;
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
  isLoading?: boolean
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
  color,
  absolutePosition,
  top,
  right
}: {
  icon: IconProp
  onPress: () => void
  disabled?: boolean
  isLoading?: boolean
  color?: string
  absolutePosition?: boolean
  top?: number
  right?: number
}) => (
  <ButtonStyles.ButtonIconWrapper onPress={onPress} disabled={disabled} absolutePosition={absolutePosition} top={top} right={right}>
    {isLoading ? <LoadingSpinner /> : <ButtonStyles.ButtonIcon icon={icon} color={color} />}
  </ButtonStyles.ButtonIconWrapper>
)
