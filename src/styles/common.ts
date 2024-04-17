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
