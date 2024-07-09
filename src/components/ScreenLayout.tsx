import styled from 'styled-components/native'
import Spinner from 'src/components/Spinner'
import useCacheAssets from 'src/hooks/useCacheAssets'

interface Props {
  children: React.ReactNode
  testID?: string
  isLoading?: boolean
}

export default function ScreenLayout({ children, isLoading = false, testID }: Props) {
  const areAssetsCached = useCacheAssets()

  if (isLoading === true) {
    return <S.Wrapper><Spinner /></S.Wrapper>
  }

  return <S.Wrapper testID={testID}>{!isLoading || areAssetsCached ? children : <Spinner />}</S.Wrapper>
}

const S = {
  Wrapper: styled.View`
    flex: 1;
  `
}
