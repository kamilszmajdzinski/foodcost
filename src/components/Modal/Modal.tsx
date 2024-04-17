import styled from 'styled-components/native'
import { IconButton } from 'src/components/Button/Button'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'

import { Modal as NativeModal } from 'react-native'
import { PropsWithChildren } from 'react'

const S = {
  ModalOuterWrapper: styled.View`
    flex: 1;
    justify-content: 'center';
    align-items: 'center';
    margin-top: 38%;
    background-color: ${(p) => p.theme.primary};
    border-radius: 20px;
    position: relative;
    width: 100%;
  `,
  ModalInnerWrapper: styled.View`
    background-color: 'white';
    padding: 8px 4px;
    align-items: 'center';
    width: 100%;
    height: 100%;
  `
}

type ModalProps = {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  hideCloseButton?: boolean
}

export const Modal = ({ isVisible, setIsVisible, children, hideCloseButton = false }: PropsWithChildren<ModalProps>) => {
  return (
    <NativeModal animationType="slide" transparent visible={isVisible}>
      <S.ModalOuterWrapper>
        {!hideCloseButton && <IconButton icon={faXmark} onPress={() => setIsVisible(false)} absolutePosition top={8} right={8} />}
        <S.ModalInnerWrapper>{children}</S.ModalInnerWrapper>
      </S.ModalOuterWrapper>
    </NativeModal>
  )
}
