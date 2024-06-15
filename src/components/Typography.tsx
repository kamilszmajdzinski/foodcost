import { PropsWithChildren } from 'react'
import { appTheme } from 'src/config/theme'
import styled from 'styled-components/native'

interface TypographyProps {
  size?: number
  color?: string
  weight?: string
  family?: string
  handlePress?: () => void
}

export const Typography = ({ size, color, weight, family, handlePress, children }: PropsWithChildren<TypographyProps>) => (
  <TypograpgyStyles.Wrapper onPress={handlePress && handlePress} size={size} color={color} weight={weight} family={family}>
    {children}
  </TypograpgyStyles.Wrapper>
)

const TypograpgyStyles = {
  Wrapper: styled.Text<TypographyProps>`
    font-size: ${(p) => p.size || 16}px;
    color: ${(p) => p.color || p.theme.highlight};
    font-weight: ${(p) => p.weight || 'normal'};
    font-family: ${(p) => p.family || 'dmSerif'};
  `,
  Container: styled.View`
    justify-content: flex-start;
    align-items: flex-start;
    background-color: ${(p) => p.theme.primary};
    height: 100%;
  `,
  ShadowText: styled.Text`
    font-size: 48px;
    font-weight: bold;
    color: ${(p) => p.theme.highlight};
    position: absolute;
  `
}


export const TextBackground = ({ text }) => (
  <TypograpgyStyles.Container>
    <TypograpgyStyles.ShadowText style={{ textShadowOffset: { width: -5, height: -5 }, textShadowRadius: 0, textShadowColor: appTheme.background }}>{text}</TypograpgyStyles.ShadowText>
    <TypograpgyStyles.ShadowText style={{ textShadowOffset: { width: 5, height: -5 }, textShadowRadius: 0, textShadowColor: appTheme.background }}>{text}</TypograpgyStyles.ShadowText>
    <TypograpgyStyles.ShadowText style={{ textShadowOffset: { width: -5, height: 5 }, textShadowRadius: 0, textShadowColor: appTheme.background}}>{text}</TypograpgyStyles.ShadowText>
    <TypograpgyStyles.ShadowText style={{ textShadowOffset: { width: 5, height: 5 }, textShadowRadius: 0, textShadowColor: appTheme.background }}>{text}</TypograpgyStyles.ShadowText>
    <TypograpgyStyles.ShadowText style={{ color: appTheme.highlight }}>{text}</TypograpgyStyles.ShadowText>
  </TypograpgyStyles.Container>
)
