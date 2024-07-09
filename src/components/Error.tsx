import styled from 'styled-components/native'
import { appTheme } from 'src/config/theme'

export default function Error() {
  return (
    <S.Wrapper testID="spinner">
      <S.ErrorText>Something went wrong...</S.ErrorText>
    </S.Wrapper>
  )
}

const S = {
  Wrapper: styled.View`
    background-color: ${appTheme.background};
    height: 80%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  ErrorText: styled.Text`
   color: ${appTheme.error};
   font-family: lato;
   font-size: 24px;
 `,
}
