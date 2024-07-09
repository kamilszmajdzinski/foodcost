import styled from 'styled-components/native'
import { Modal } from '../Modal'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { CommonLayout } from 'src/styles/common'

export const EditProductConfirmationModal = ({ isOpen, setIsOpen, handleConfirmation }) => {
  return (
    <Modal isVisible={isOpen} setIsVisible={setIsOpen}>
      <S.StyledWrapper direction="column" height={100} justifyContent="space-between">
        <Typography size={20}>Are you sure you want to edit this product?</Typography>
        <Button onPress={handleConfirmation}>Save product and recalculate foodcosts</Button>
      </S.StyledWrapper>
    </Modal>
  )
}

const S = {
  ModalWrapper: styled.View`
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    height: 100%;
  `,
  StyledWrapper: styled(CommonLayout.Flex)`
    padding: 40px 10px 30px 10px;
  `
}
