import styled from 'styled-components/native'
import { Stack } from 'expo-router'
import ScreenLayout from 'src/components/ScreenLayout'
import { useRouter } from 'expo-router'
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl'
import { faLemon } from '@fortawesome/free-solid-svg-icons/faLemon'


import { Common } from 'src/styles/common'

import { Card } from 'src/components/Card/Card'

export default function HomeScreen() {
  const router = useRouter()
  return (
    <ScreenLayout testID="home-screen-layout">
      <Common.PageWrapper>
        <Stack.Screen options={{ title: 'Home Screen' }} />
        <Common.PageHeader>Foodcost</Common.PageHeader>
        <S.Content>
          <Card rotate name="My foodcosts" icon={faListOl} />
          <Card name="My products" icon={faLemon} handlePress={() => router.push('/products')} />
        </S.Content>
      </Common.PageWrapper>
    </ScreenLayout>
  )
}

const S = {
  Content: styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 24px;
  `,
  Title: styled.Text`
    color: ${(p) => p.theme.primary};
    font-family: helvetica;
    font-weight: 900;
    font-size: ${(p) => p.theme.size(200, 'px')};
    margin-bottom: ${(p) => p.theme.size(10, 'px')};
  `,
  Text: styled.Text`
    color: ${(p) => p.theme.primary};
    font-family: helvetica;
    font-weight: 700;
    font-size: ${(p) => p.theme.size(15, 'px')};
    margin-bottom: ${(p) => p.theme.size(15, 'px')};
  `
}
