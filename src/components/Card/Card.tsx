import styled from 'styled-components/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface CardInterface {
  name: string
  handlePress: () => void
  icon: IconProp
  rotate?: boolean
}

export const Card = ({ icon, name, handlePress, rotate }: CardInterface) => {
  return (
    <S.Wrapper onPress={handlePress}>
      <S.CardText>{name}</S.CardText>
      <S.CardIcon hasRotate={!!rotate} size={90} icon={icon} />
    </S.Wrapper>
  )
}

const S = {
  Wrapper: styled.TouchableOpacity`
    padding: ${(p) => p.theme.size(40, 'px')} ${(p) => p.theme.size(20, 'px')};
    border-color: ${(p) => p.theme.primary};
    border-width: ${(p) => p.theme.size(1, 'px')};
    border-radius: ${(p) => p.theme.size(30, 'px')};
    display: flex;
    background-color: ${(p) => p.theme.primary};
    flex-direction: row;
    position: relative;
    overflow: hidden;
  `,
  CardText: styled.Text`
    font-size: 24px;
    font-family: dmSerif;
    color: ${(p) => p.theme.highlight};
  `,
  CardIcon: styled(FontAwesomeIcon)<{ hasRotate: boolean }>`
    position: absolute;
    bottom: -10px;
    right: -5px;
    transform:${props => props.hasRotate ? 'rotate(45deg)' : 'rotate(0deg)'};
    color: ${(p) => p.theme.secondary};
    height: 180vh;
    width: 180px;
    opacity: 0.8;
  `
}
