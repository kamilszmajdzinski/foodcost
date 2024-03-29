import { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

interface TypographyProps {
  size?: number
  color?: string
  weight?: string
  family?: string
}

export const Typography = ({ size, color, weight, family, children }: PropsWithChildren<TypographyProps>) =>
    <TypograpgyStyles.Wrapper size={size} color={color} weight={weight} family={family}>{children}</TypograpgyStyles.Wrapper>

const TypograpgyStyles = {
  Wrapper: styled.Text<TypographyProps>`
    font-size: ${(p) => p.size || 16}px;
    color: ${(p) => p.color || p.theme.highlight};
    font-weight: ${(p) => p.weight || 'normal'};
    font-family: ${(p) => p.family || 'dmSerif'};
  `
}
